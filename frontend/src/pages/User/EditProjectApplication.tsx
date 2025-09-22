import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Button,
  Steps,
  message,
  Spin,
  Alert,
  Upload,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Descriptions
} from 'antd'
import {
  UserOutlined,
  ProjectOutlined,
  FileOutlined,
  CheckOutlined,
  UploadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import {
  useGetProjectApplicationDetailQuery,
  useUpdateProjectApplicationMutation
} from '../../store/api/userApi'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Step } = Steps

interface EditProjectApplicationProps {}

const EditProjectApplication: React.FC<EditProjectApplicationProps> = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<any>({})
  const [fileLists, setFileLists] = useState<{[key: string]: any[]}>({
    resume: [],
    businessPlan: [],
    financialReport: [],
    otherDocs: []
  })

  // API调用
  const { 
    data: applicationResponse, 
    isLoading, 
    error 
  } = useGetProjectApplicationDetailQuery(id!, { skip: !id })

  const [updateApplication, { isLoading: isUpdating }] = useUpdateProjectApplicationMutation()

  const application = applicationResponse?.data

  useEffect(() => {
    if (application) {
      // 解析个人信息
      let personalInfo = {}
      try {
        personalInfo = application.personalInfo ? JSON.parse(application.personalInfo) : {}
      } catch (e) {
        console.error('解析个人信息失败:', e)
      }

      // 解析项目信息
      let projectInfo = {}
      try {
        projectInfo = application.projectInfo ? JSON.parse(application.projectInfo) : {}
      } catch (e) {
        console.error('解析项目信息失败:', e)
      }

      // 设置表单数据
      setFormData({
        personalInfo,
        projectInfo
      })

      // 解析文件信息
      const parseFileUrls = (fileUrlString: string, fileType: string) => {
        console.log(`解析${fileType}文件:`, fileUrlString)
        if (!fileUrlString) return []
        try {
          const parsed = JSON.parse(fileUrlString)
          console.log(`${fileType}解析结果:`, parsed)
          const fileArray = Array.isArray(parsed) ? parsed : [parsed]
          
          // 确保每个文件对象都有正确的格式，以便显示下载按钮
          const processedFiles = fileArray.map((file: any, index: number) => ({
            uid: file.uid || `existing-${index}`,
            name: file.name || file.originalName || `文件${index + 1}`,
            status: 'done', // 设置为已完成状态，这样会显示下载按钮
            url: file.url,
            response: file.response || { success: true, data: { url: file.url } },
            size: file.size || 0
          })).filter((file: any) => file.url) // 只保留有URL的文件
          
          console.log(`${fileType}处理后的文件:`, processedFiles)
          return processedFiles
        } catch (e) {
          console.error(`解析${fileType}文件失败:`, e)
          return []
        }
      }

      const fileLists = {
        resume: parseFileUrls(application.resumeUrl, '简历'),
        businessPlan: parseFileUrls(application.businessPlanUrl, '商业计划书'),
        financialReport: parseFileUrls(application.financialReportUrl, '财务报告'),
        otherDocs: parseFileUrls(application.otherDocsUrl, '其他材料')
      }

      console.log('所有文件列表:', fileLists)
      setFileLists(fileLists)

      // 设置表单字段值（在文件列表设置后）
      form.setFieldsValue({
        // 个人信息
        name: personalInfo.name,
        phone: personalInfo.phone,
        email: personalInfo.email,
        education: personalInfo.education,
        workExperience: personalInfo.workExperience,
        skills: personalInfo.skills,
        // 项目信息
        projectName: projectInfo.projectName,
        projectDescription: projectInfo.projectDescription,
        marketAnalysis: projectInfo.marketAnalysis,
        competitiveAdvantage: projectInfo.competitiveAdvantage,
        businessModel: projectInfo.businessModel,
        financialPlan: projectInfo.financialPlan,
        teamIntroduction: projectInfo.teamIntroduction,
        // 文件字段 - 设置为文件列表以满足表单验证
        resume: fileLists.resume && fileLists.resume.length > 0 ? fileLists.resume : undefined,
        businessPlan: fileLists.businessPlan && fileLists.businessPlan.length > 0 ? fileLists.businessPlan : undefined,
        financialReport: fileLists.financialReport && fileLists.financialReport.length > 0 ? fileLists.financialReport : undefined,
        otherDocs: fileLists.otherDocs && fileLists.otherDocs.length > 0 ? fileLists.otherDocs : undefined
      })
    }
  }, [application, form])

  const steps = [
    {
      title: '个人信息',
      icon: <UserOutlined />,
      description: '编辑基本个人信息'
    },
    {
      title: '项目计划',
      icon: <ProjectOutlined />,
      description: '编辑详细项目计划书'
    },
    {
      title: '申报材料',
      icon: <FileOutlined />,
      description: '更新相关文档'
    },
    {
      title: '确认提交',
      icon: <CheckOutlined />,
      description: '确认信息并重新提交'
    }
  ]

  const handleNext = async () => {
    try {
      const values = await form.validateFields()
      setFormData(prev => ({
        ...prev,
        [getCurrentStepKey()]: values
      }))
      setCurrentStep(prev => prev + 1)
    } catch (error) {
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

  // 创建上传配置
  const createUploadProps = (fieldName: string) => {
    const token = localStorage.getItem('token')
    
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
        const currentFileList = info.fileList || []
        setFileLists(prev => ({
          ...prev,
          [fieldName]: currentFileList
        }))
        
        form.setFieldsValue({
          [fieldName]: currentFileList.length > 0 ? currentFileList : undefined
        })
        
        if (info.file.status === 'done') {
          if (info.file.response && info.file.response.success) {
            message.success(`${info.file.name} 文件上传成功`)
          } else {
            message.error(`${info.file.name} 上传失败`)
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败`)
        }
      },
      onRemove: (file: any) => {
        const currentFiles = fileLists[fieldName] || []
        const newFiles = currentFiles.filter((f: any) => f.uid !== file.uid)
        
        setFileLists(prev => ({
          ...prev,
          [fieldName]: newFiles
        }))
        
        const fieldValue = newFiles.length > 0 ? newFiles : undefined
        form.setFieldsValue({
          [fieldName]: fieldValue
        })
      }
    }
  }

  // 提取文件URL的辅助函数
  const extractFileUrl = (file: any) => {
    if (!file) return null;
    
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
    
    return url;
  };

  // 处理文件列表，只保留必要的信息
  const processFileList = (fileList: any[]) => {
    return fileList.map(file => ({
      uid: file.uid,
      name: file.name || file.originalName,
      url: extractFileUrl(file),
      size: file.size,
      status: file.status,
      response: file.response
    })).filter(file => file.url) // 只保留有URL的文件
  }

  // 最终提交
  const handleFinalSubmit = async () => {
    try {
      const updateData = {
        id: id!,
        personalInfo: formData.personalInfo,
        projectInfo: formData.projectInfo,
        resumeUrl: JSON.stringify(processFileList(fileLists.resume)),
        businessPlanUrl: JSON.stringify(processFileList(fileLists.businessPlan)),
        financialReportUrl: JSON.stringify(processFileList(fileLists.financialReport)),
        otherDocsUrl: JSON.stringify(processFileList(fileLists.otherDocs))
      }

      console.log('提交的更新数据:', updateData)

      await updateApplication(updateData).unwrap()
      message.success('申报更新成功，已重新提交审核')
      navigate('/profile')
    } catch (error) {
      console.error('提交失败:', error)
      message.error('提交失败，请重试')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="p-6">
        <Alert
          message="加载失败"
          description="无法获取申报信息，请稍后重试"
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/profile')}>
              返回个人中心
            </Button>
          }
        />
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
                <Input placeholder="请输入您的真实姓名" />
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
                <Input placeholder="请输入您的手机号码" />
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
                <Input placeholder="请输入您的邮箱地址" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="education"
                label="学历"
                rules={[{ required: true, message: '请选择学历' }]}

              >
                <Input placeholder="如：本科、硕士、博士等" />
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
              description="请仔细核对以下信息，确认无误后重新提交申报"
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
                <Descriptions.Item label="市场分析">
                  <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                    {formData.projectInfo?.marketAnalysis}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="竞争优势">
                  <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                    {formData.projectInfo?.competitiveAdvantage}
                  </Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            
            <Card title="申报材料">
              <Text>已上传的文件将在提交后进行重新审核</Text>
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
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/profile')}
            className="mb-4"
          >
            返回个人中心
          </Button>
          <Title level={2}>重新编辑项目申报</Title>
          <Text type="secondary">
            修改您的申报信息并重新提交审核
          </Text>
        </div>

        <Card>
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

          <Form
            form={form}
            layout="vertical"
            className="mb-6"
          >
            {renderStepContent()}
          </Form>

          <Divider />

          <div className="flex justify-between">
            <div>
              {currentStep > 0 && (
                <Button onClick={handlePrev}>
                  上一步
                </Button>
              )}
            </div>
            <div>
              {currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={handleNext}>
                  下一步
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handleFinalSubmit}
                  loading={isUpdating}
                >
                  重新提交申报
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default EditProjectApplication