import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Steps, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Upload, 
  message, 
  Select,
  DatePicker,
  InputNumber,
  Radio,
  Checkbox,
  Divider,
  Space,
  Alert,
  Descriptions
} from 'antd'
import { 
  ArrowLeftOutlined,
  UploadOutlined,
  FileTextOutlined,
  UserOutlined,
  ProjectOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useGetProjectByIdQuery } from '../services/api'
import { useApplyProjectMutation } from '../store/api/projectApi'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select
const { Step } = Steps

interface ApplicationFormData {
  // 个人信息
  personalInfo: {
    name: string
    phone: string
    email: string
    education: string
    workExperience: string
    skills: string
  }
  // 项目信息
  projectInfo: {
    projectName: string
    projectDescription: string
    marketAnalysis: string
    competitiveAdvantage: string
    businessModel: string
    financialPlan: string
    teamIntroduction: string
  }
  // 申报材料
  documents: {
    resume: any[]
    businessPlan: any[]
    financialReport: any[]
    otherDocs: any[]
  }
}

const ProjectApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({})
  const [fileLists, setFileLists] = useState<{[key: string]: any[]}>({
    resume: [],
    businessPlan: [],
    financialReport: [],
    otherDocs: []
  })
  
  const { data: projectResponse, isLoading: projectLoading } = useGetProjectByIdQuery(id!)
  const [applyProject, { isLoading: applying }] = useApplyProjectMutation()
  
  const project = projectResponse?.data

  const steps = [
    {
      title: '个人信息',
      icon: <UserOutlined />,
      description: '填写基本个人信息'
    },
    {
      title: '项目计划',
      icon: <ProjectOutlined />,
      description: '详细项目计划书'
    },
    {
      title: '申报材料',
      icon: <FileTextOutlined />,
      description: '上传相关文档'
    },
    {
      title: '确认提交',
      icon: <CheckCircleOutlined />,
      description: '确认信息并提交'
    }
  ]

  const handleNext = async () => {
    try {
      // 添加调试信息
      const currentValues = form.getFieldsValue()
      console.log('当前步骤:', currentStep)
      console.log('当前表单值:', currentValues)
      
      const values = await form.validateFields()
      console.log('验证通过的值:', values)
      
      setFormData(prev => ({
        ...prev,
        [getCurrentStepKey()]: values
      }))
      setCurrentStep(prev => prev + 1)
    } catch (error) {
      console.error('表单验证失败:', error)
      const currentValues = form.getFieldsValue()
      console.log('验证失败时的表单值:', currentValues)
      message.error('请完善必填信息')
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1)
  }

  const getCurrentStepKey = () => {
    const keys = ['personalInfo', 'projectInfo', 'documents', 'confirmation']
    return keys[currentStep]
  }

  const handleSubmit = async () => {
    try {
      // 获取当前步骤的表单数据
      const currentStepData = form.getFieldsValue()
      
      // 合并所有步骤的数据
      const allFormData = {
        ...formData,
        [getCurrentStepKey()]: currentStepData
      }
      
      console.log('所有表单数据:', allFormData);
      
      // 提取文件数据 - 确保从正确的位置获取文档数据
      let documentsData = allFormData.documents || {};
      
      // 如果当前在文档步骤，使用当前步骤的数据
      if (getCurrentStepKey() === 'documents') {
        documentsData = { ...documentsData, ...currentStepData };
      }
      
      console.log('文档数据:', documentsData);
      
      const resumeFiles = documentsData.resume || [];
      const businessPlanFiles = documentsData.businessPlan || [];
      const financialReportFiles = documentsData.financialReport || [];
      const otherDocsFiles = documentsData.otherDocs || [];
      
      console.log('提交时的文件数据:', {
        documentsData,
        resumeFiles,
        businessPlanFiles,
        financialReportFiles,
        otherDocsFiles
      });
      
      // 提取文件URL的辅助函数
      const extractFileUrl = (file: any) => {
        if (!file) return null;
        
        console.log('提取文件URL，文件对象:', file);
        
        // 检查不同可能的URL字段
        let url = null;
        
        if (file.url) {
          url = file.url;
        } else if (file.response?.data?.url) {
          url = file.response.data.url;
        } else if (file.response?.data?.[0]?.url) {
          url = file.response.data[0].url;
        } else if (Array.isArray(file.response?.data) && file.response.data.length > 0) {
          url = file.response.data[0].url;
        } else if (file.response?.data?.filename) {
          // 如果有filename，构建URL
          url = `/uploads/${file.response.data.filename}`;
        }
        
        console.log('提取到的URL:', url);
        return url;
      };

      // 构建提交数据 - 匹配后端期望的格式
      const submitData = {
        projectId: id!,
        personalInfo: allFormData.personalInfo,
        projectInfo: allFormData.projectInfo,
        documents: {
          resume: resumeFiles || [],
          businessPlan: businessPlanFiles || [],
          financialReport: financialReportFiles || [],
          otherDocs: otherDocsFiles || []
        }
      }
      
      console.log('最终提交数据:', submitData);
      
      // 验证必填字段 - 检查文件是否上传成功
      const hasValidResumeFiles = resumeFiles && resumeFiles.length > 0 && 
        resumeFiles.some(file => file.status === 'done' && (file.response?.success || file.url));
      const hasValidBusinessPlanFiles = businessPlanFiles && businessPlanFiles.length > 0 && 
        businessPlanFiles.some(file => file.status === 'done' && (file.response?.success || file.url));
      
      console.log('文件验证结果:', {
        resumeFiles,
        businessPlanFiles,
        hasValidResumeFiles,
        hasValidBusinessPlanFiles
      });
      
      if (!hasValidResumeFiles) {
        throw new Error('请上传简历文件并等待上传完成');
      }
      if (!hasValidBusinessPlanFiles) {
        throw new Error('请上传商业计划书并等待上传完成');
      }
      
      await applyProject(submitData).unwrap()
      
      message.success('申报提交成功！')
      navigate('/projects')
    } catch (error: any) {
      console.error('申报提交错误:', error)
      
      // 处理特定错误
      if (error?.data?.message === '您已申请过此项目') {
        message.error('您已申请过此项目，请勿重复申请')
        // 可以选择跳转到申请记录页面
        setTimeout(() => {
          navigate('/user/applications')
        }, 2000)
      } else {
        message.error(error?.data?.message || '申报提交失败，请重试')
      }
    }
  }

  // 创建上传配置的工厂函数
  const createUploadProps = (fieldName: string) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    console.log('文件上传使用的token:', token ? `${token.substring(0, 20)}...` : 'null');
    
    return {
      action: '/api/users/upload-project-files',
      name: 'files',
      headers: {
        Authorization: `Bearer ${token}`
      },
      fileList: fileLists[fieldName] || [],
      showUploadList: {
        showDownloadIcon: true,
        showRemoveIcon: true,
        showPreviewIcon: false,
      },
      beforeUpload: (file: any) => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/msword' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                         file.type === 'image/jpeg' ||
                         file.type === 'image/png'
      if (!isValidType) {
        message.error('只支持 PDF、DOC、DOCX、JPG、PNG 格式文件')
        return false
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB')
        return false
      }
      return true
    },
    onChange: (info: any) => {
      console.log('文件状态变化:', info.file.status, info.file.name, info.file.response)
      console.log('当前文件列表:', info.fileList)
      
      // 更新文件列表状态
      const currentFileList = info.fileList || []
      setFileLists(prev => ({
        ...prev,
        [fieldName]: currentFileList
      }))
      
      // 更新表单字段值
      form.setFieldsValue({
        [fieldName]: currentFileList.length > 0 ? currentFileList : undefined
      })
      
      if (info.file.status === 'uploading') {
        console.log('上传中...', info.file.name)
      } else if (info.file.status === 'done') {
        console.log('上传完成，响应:', info.file.response)
        if (info.file.response && info.file.response.success) {
          message.success(`${info.file.name} 文件上传成功`)
          console.log('上传成功，文件信息:', info.file.response)
        } else {
          console.log('上传失败，响应不成功:', info.file.response)
          message.error(`${info.file.name} 上传失败: ${info.file.response?.message || '未知错误'}`)
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
        console.error('上传错误:', info.file.error, info.file.response)
      }
      
      // 手动触发字段验证
      form.validateFields([fieldName]).catch(() => {})
      console.log('设置表单字段和文件列表:', fieldName, currentFileList)
    },
    onRemove: (file: any) => {
      console.log('移除文件:', file.name)
      // 获取当前文件列表并移除指定文件
      const currentFiles = fileLists[fieldName] || []
      const newFiles = currentFiles.filter((f: any) => f.uid !== file.uid)
      
      // 更新文件列表状态
      setFileLists(prev => ({
        ...prev,
        [fieldName]: newFiles
      }))
      
      // 更新表单字段值
      const fieldValue = newFiles.length > 0 ? newFiles : undefined
      form.setFieldsValue({
        [fieldName]: fieldValue
      })
      
      // 手动触发字段验证
      form.validateFields([fieldName]).catch(() => {})
      
      console.log('移除文件后的字段值:', fieldName, fieldValue)
    }
    };
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <Text>加载项目信息中...</Text>
          </div>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Alert
            message="项目不存在"
            description="请检查项目链接是否正确"
            type="error"
            showIcon
            action={
              <Button onClick={() => navigate('/projects')}>
                返回项目列表
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // 个人信息
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入真实姓名" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="education"
                label="学历"
                rules={[{ required: true, message: '请选择学历' }]}
              >
                <Select placeholder="请选择学历">
                  <Option value="高中">高中</Option>
                  <Option value="大专">大专</Option>
                  <Option value="本科">本科</Option>
                  <Option value="硕士">硕士</Option>
                  <Option value="博士">博士</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="workExperience"
                label="工作经历"
                rules={[{ required: true, message: '请填写工作经历' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="请详细描述您的工作经历，包括公司名称、职位、工作内容等"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="skills"
                label="专业技能"
                rules={[{ required: true, message: '请填写专业技能' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="请描述您的专业技能，如：软件开发、数据分析、项目管理等"
                />
              </Form.Item>
            </Col>
          </Row>
        )

      case 1: // 项目计划
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                name="projectName"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入您的创业项目名称" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="projectDescription"
                label="项目描述"
                rules={[{ required: true, message: '请填写项目描述' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="请详细描述您的项目内容、目标和预期成果"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="marketAnalysis"
                label="市场分析"
                rules={[{ required: true, message: '请填写市场分析' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="请分析目标市场、用户需求、市场规模等"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="competitiveAdvantage"
                label="竞争优势"
                rules={[{ required: true, message: '请填写竞争优势' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="请描述您的项目相比竞争对手的优势"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="businessModel"
                label="商业模式"
                rules={[{ required: true, message: '请填写商业模式' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="请描述您的盈利模式和商业计划"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="financialPlan"
                label="资金规划"
                rules={[{ required: true, message: '请填写资金规划' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="请说明资金需求、使用计划和预期回报"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="teamIntroduction"
                label="团队介绍"
              >
                <TextArea 
                  rows={3} 
                  placeholder="请介绍您的团队成员及其专业背景"
                />
              </Form.Item>
            </Col>
          </Row>
        )

      case 2: // 申报材料
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                name="resume"
                label="个人简历"
                rules={[{ required: true, message: '请上传个人简历' }]}
                extra="请上传详细的个人简历，包括教育背景、工作经历等"
              >
                <Upload {...createUploadProps('resume')} maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传简历 (PDF/DOC/DOCX)</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="businessPlan"
                label="商业计划书"
                rules={[{ required: true, message: '请上传商业计划书' }]}
                extra="请上传完整的商业计划书，包括市场分析、财务预测等"
              >
                <Upload {...createUploadProps('businessPlan')} maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传商业计划书 (PDF/DOC/DOCX)</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="financialReport"
                label="财务报告"
                extra="可选上传，最多3个文件。如有相关财务数据或报告，请一并上传"
              >
                <Upload {...createUploadProps('financialReport')} maxCount={3}>
                  <Button icon={<UploadOutlined />}>上传财务报告 (可选)</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="otherDocs"
                label="其他材料"
                extra="可选上传，最多5个文件。如有专利证书、获奖证明等其他支撑材料，请上传"
              >
                <Upload {...createUploadProps('otherDocs')} maxCount={5}>
                  <Button icon={<UploadOutlined />}>上传其他材料 (可选)</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        )

      case 3: // 确认提交
        return (
          <div>
            <Alert
              message="请确认申报信息"
              description="请仔细核对以下信息，确认无误后提交申报"
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Card title="个人信息" className="mb-4">
              <Descriptions column={2}>
                <Descriptions.Item label="姓名">{formData.personalInfo?.name}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{formData.personalInfo?.phone}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{formData.personalInfo?.email}</Descriptions.Item>
                <Descriptions.Item label="学历">{formData.personalInfo?.education}</Descriptions.Item>
              </Descriptions>
            </Card>
            
            <Card title="项目信息" className="mb-4">
              <Descriptions column={1}>
                <Descriptions.Item label="项目名称">{formData.projectInfo?.projectName}</Descriptions.Item>
                <Descriptions.Item label="项目描述">
                  <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                    {formData.projectInfo?.projectDescription}
                  </Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            
            <Card title="申报材料">
              <Text>已上传的文件将在提交后进行审核</Text>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(`/projects/${id}`)}
            size="large"
          >
            返回项目详情
          </Button>
        </div>

        {/* 项目信息 */}
        <Card className="mb-6">
          <div className="text-center">
            <Title level={3}>申报项目：{project.title}</Title>
            <Text type="secondary">
              资助金额：{project.funding ? `${(project.funding / 10000).toFixed(0)}万元` : '面议'} | 
              项目周期：{project.duration || 12}个月
            </Text>
          </div>
        </Card>

        {/* 步骤条 */}
        <Card className="mb-6">
          <Steps current={currentStep} className="mb-8">
            {steps.map((step, index) => (
              <Step 
                key={index}
                title={step.title} 
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>
        </Card>

        {/* 表单内容 */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            initialValues={formData[getCurrentStepKey() as keyof ApplicationFormData]}
          >
            {renderStepContent()}
          </Form>

          <Divider />

          {/* 操作按钮 */}
          <div className="flex justify-between">
            <Button 
              onClick={handlePrev} 
              disabled={currentStep === 0}
              size="large"
            >
              上一步
            </Button>
            
            <Space>
              <Button onClick={() => navigate(`/projects/${id}`)}>
                取消申报
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={handleNext} size="large">
                  下一步
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handleSubmit} 
                  loading={applying}
                  size="large"
                >
                  提交申报
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProjectApplication