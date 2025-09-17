import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Space, 
  Divider,
  Row,
  Col,
  Tag,
  Upload,
  message,
  Modal,
  List,
  Avatar,
  Popconfirm,
  Progress,
  Alert,
  Tabs,
  DatePicker,
  Select,
  Switch
} from 'antd'
import dayjs from 'dayjs'
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useAppSelector } from '../store'
import { useGetResumeQuery, useUpdateResumeMutation } from '../services/resumeApi'
import { useNavigate } from 'react-router-dom'
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { TabPane } = Tabs
const { Option } = Select

interface Education {
  id: string
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
  description?: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Project {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
}

interface Skill {
  id: string
  name: string
  level?: number
  category: string
  description: string
}

interface Certificate {
  id: string
  name: string
  issuer?: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  description?: string
}

interface Language {
  id: string
  name: string
  level: string
  certificate?: string
}



interface Attachment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadTime: string
}

const Resume: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('basic')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'education' | 'experience' | 'projects' | 'skills' | 'certificates' | 'languages' | 'awards'>('education')
  const [editingItem, setEditingItem] = useState<any>(null)
  const [itemForm] = Form.useForm()
  


  // 简历数据状态
  const [resumeData, setResumeData] = useState({
    // 基本信息 - 必填
    name: '',
    birthDate: '',
    hometown: '',
    phone: '',
    email: '',
    // 基本信息 - 非必填
    maritalStatus: '',
    employmentStatus: '',
    // 简历内容
    title: '我的简历',
    objective: '',
    summary: '',
    awards: '',
    hobbies: '',
    // 数组数据
    education: [] as Education[],
    experience: [] as Experience[],
    projects: [] as Project[],
    skills: [] as Skill[],
    certificates: [] as Certificate[],
    languages: [] as Language[],
    attachments: [] as Attachment[],
    // 状态
    isPublic: false,
    isComplete: false
  })

  // 计算简历完整度
  const calculateCompleteness = () => {
    let score = 0
    const maxScore = 100

    // 基本信息权重 (必填项)
    if (resumeData.name) score += 10
    if (resumeData.birthDate) score += 5
    if (resumeData.hometown) score += 5
    if (resumeData.phone) score += 10
    if (resumeData.email) score += 10

    // 简历内容权重（非必填，但有加分）
    if (resumeData.objective) score += 10
    if (resumeData.summary) score += 10

    // 教育经历权重
    if (resumeData.education.length > 0) score += 10

    // 工作经历权重
    if (resumeData.experience.length > 0) score += 10

    // 技能权重
    if (resumeData.skills.length > 0) score += 10
    
    return Math.min(score, maxScore)
  }

  const completeness = calculateCompleteness()

  // 使用API获取简历数据
  const { data: resumeResponse, isLoading: resumeLoading } = useGetResumeQuery()
  const [updateResume, { isLoading: isUpdatingResume }] = useUpdateResumeMutation()

  useEffect(() => {
    if (resumeResponse) {
      const safeResumeData = {
        // 基本信息 - 必填
        name: resumeResponse.basicInfo?.name || '',
        birthDate: resumeResponse.basicInfo?.birthDate || '',
        hometown: resumeResponse.basicInfo?.hometown || '',
        phone: resumeResponse.basicInfo?.phone || '',
        email: resumeResponse.basicInfo?.email || '',
        // 基本信息 - 非必填
        maritalStatus: resumeResponse.basicInfo?.maritalStatus || '',
        employmentStatus: resumeResponse.basicInfo?.employmentStatus || '',
        // 简历内容
        title: resumeResponse.title || '我的简历',
        objective: resumeResponse.basicInfo?.jobObjective || '',
        summary: resumeResponse.basicInfo?.personalSummary || '',
        awards: resumeResponse.basicInfo?.awards || '',
        hobbies: resumeResponse.basicInfo?.hobbies || '',
        // 数组数据
        education: resumeResponse.education || [],
        experience: resumeResponse.experience || [],
        projects: resumeResponse.projects || [],
        skills: resumeResponse.skills || [],
        certificates: resumeResponse.certificates || [],
        languages: resumeResponse.languages || [],
        attachments: resumeResponse.attachments || [],
        // 状态
        isPublic: resumeResponse.isPublic || false,
        isComplete: resumeResponse.isComplete || false
      }
      
      // 处理表单数据，确保日期字段格式正确
      const formData = {
        ...safeResumeData,
        birthDate: safeResumeData.birthDate ? dayjs(safeResumeData.birthDate) : undefined
      }
      
      setResumeData(safeResumeData)
      form.setFieldsValue(formData)
    }
  }, [resumeResponse, form])

  // 保存简历
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      const updatedData = {
        ...resumeData,
        ...values,
        isComplete: calculateCompleteness() >= 80
      }
      
      // 构造符合后端期望的数据结构
      const saveData = {
        title: updatedData.title,
        basicInfo: {
          name: updatedData.name,
          birthDate: updatedData.birthDate,
          hometown: updatedData.hometown,
          phone: updatedData.phone,
          email: updatedData.email,
          maritalStatus: updatedData.maritalStatus,
          employmentStatus: updatedData.employmentStatus,
          jobObjective: updatedData.objective,
          personalSummary: updatedData.summary,
          awards: updatedData.awards,
          hobbies: updatedData.hobbies
        },
        education: updatedData.education,
        experience: updatedData.experience,
        projects: updatedData.projects,
        skills: updatedData.skills,
        certificates: updatedData.certificates,
        languages: updatedData.languages,
        attachments: updatedData.attachments,
        isPublic: updatedData.isPublic,
        isComplete: updatedData.isComplete
      }
      
      await updateResume(saveData).unwrap()
      setResumeData(updatedData)
      message.success('简历保存成功！')
      
      // 保存成功后显示返回按钮提示
      setTimeout(() => {
        message.info('您可以点击左上角"返回个人中心"查看保存的简历')
      }, 1500)
      
    } catch (error: any) {
      console.error('保存失败:', error)
      message.error(error?.data?.message || '保存失败，请检查输入信息')
    }
  }

  // 添加/编辑项目
  const handleAddItem = (type: typeof modalType) => {
    setModalType(type)
    setEditingItem(null)
    itemForm.resetFields()
    setIsModalVisible(true)
  }

  const handleEditItem = (type: typeof modalType, item: any) => {
    setModalType(type)
    setEditingItem(item)
    
    // 处理日期字段，确保DatePicker能正确显示
    const processedItem = { ...item }
    if (processedItem.startDate && typeof processedItem.startDate === 'string') {
      processedItem.startDate = dayjs(processedItem.startDate)
    }
    if (processedItem.endDate && typeof processedItem.endDate === 'string') {
      processedItem.endDate = dayjs(processedItem.endDate)
    }
    if (processedItem.issueDate && typeof processedItem.issueDate === 'string') {
      processedItem.issueDate = dayjs(processedItem.issueDate)
    }
    if (processedItem.birthDate && typeof processedItem.birthDate === 'string') {
      processedItem.birthDate = dayjs(processedItem.birthDate)
    }
    
    itemForm.setFieldsValue(processedItem)
    setIsModalVisible(true)
  }

  // 映射modalType到resumeData的键名
  const getDataKey = (type: string) => {
    const mapping: { [key: string]: string } = {
      'education': 'education',
      'experience': 'experience', 
      'projects': 'projects',
      'skills': 'skills',
      'certificates': 'certificates',
      'languages': 'languages',
      'awards': 'awards'
    }
    return mapping[type] || type
  }

  const handleSaveItem = async () => {
    try {
      const values = await itemForm.validateFields()
      
      // 处理日期格式
      const processedValues = { ...values }
      if (processedValues.startDate) {
        processedValues.startDate = processedValues.startDate.format('YYYY-MM-DD')
      }
      if (processedValues.endDate) {
        processedValues.endDate = processedValues.endDate.format('YYYY-MM-DD')
      }
      if (processedValues.issueDate) {
        processedValues.issueDate = processedValues.issueDate.format('YYYY-MM-DD')
      }
      
      const newItem = {
        ...processedValues,
        id: editingItem?.id || Date.now().toString()
      }

      const updatedData = { ...resumeData }
      const dataKey = getDataKey(modalType)
      
      if (editingItem) {
        // 编辑现有项目
        const items = updatedData[dataKey as keyof typeof updatedData] as any[]
        const index = items.findIndex((item: any) => item.id === editingItem.id)
        if (index !== -1) {
          items[index] = newItem
        }
      } else {
        // 添加新项目
        const items = updatedData[dataKey as keyof typeof updatedData] as any[]
        items.push(newItem)
      }

      // 保存到后端
      await updateResume(updatedData).unwrap()
      setResumeData(updatedData)
      setIsModalVisible(false)
      itemForm.resetFields()
      message.success(editingItem ? '更新成功' : '添加成功')
    } catch (error: any) {
      console.error('保存失败:', error)
      message.error(error?.data?.message || '操作失败，请重试')
    }
  }

  const handleDeleteItem = (type: string, id: string) => {
    const updatedData = { ...resumeData }
    const items = updatedData[type as keyof typeof updatedData] as any[]
    const filteredItems = items.filter((item: any) => item.id !== id)
    ;(updatedData as any)[type] = filteredItems
    setResumeData(updatedData)
    message.success('删除成功')
  }

  // 文件上传
  const handleUpload = async (file: File) => {
    try {
      // 这里应该实现实际的文件上传逻辑
      const formData = new FormData()
      formData.append('file', file)
      
      // 模拟上传
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type,
        fileSize: file.size,
        uploadTime: new Date().toISOString()
      }

      const updatedData = {
        ...resumeData,
        attachments: [...resumeData.attachments, newAttachment]
      }
      
      setResumeData(updatedData)
      message.success('文件上传成功')
    } catch (error) {
      message.error('文件上传失败')
    }
  }

  // 附件下载
  const handleDownload = (attachment: any) => {
    try {
      const link = document.createElement('a')
      link.href = attachment.fileUrl
      link.download = attachment.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      message.success('开始下载')
    } catch (error) {
      message.error('下载失败')
    }
  }

  // 预览简历
  const handlePreview = () => {
    const previewWindow = window.open('', '_blank', 'width=800,height=600')
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>简历预览 - ${resumeData.name || '未命名'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
            .item { margin-bottom: 10px; }
            .item-title { font-weight: bold; }
            .item-meta { color: #666; font-size: 14px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill-tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${resumeData.name || '姓名未填写'}</h1>
            <p>联系方式: ${resumeData.phone || '未填写'} | 邮箱: ${resumeData.email || '未填写'}</p>
            <p>籍贯: ${resumeData.hometown || '未填写'} | 出生年月: ${resumeData.birthDate || '未填写'}</p>
          </div>
          
          ${resumeData.objective ? `
          <div class="section">
            <div class="section-title">求职意向</div>
            <p>${resumeData.objective}</p>
          </div>
          ` : ''}
          
          ${resumeData.summary ? `
          <div class="section">
            <div class="section-title">个人总结</div>
            <p>${resumeData.summary}</p>
          </div>
          ` : ''}
          
          ${resumeData.education.length > 0 ? `
          <div class="section">
            <div class="section-title">教育经历</div>
            ${resumeData.education.map(edu => `
              <div class="item">
                <div class="item-title">${edu.school} - ${edu.major}</div>
                <div class="item-meta">${edu.degree} | ${edu.startDate} 至 ${edu.endDate}</div>
                ${edu.description ? `<p>${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${resumeData.experience.length > 0 ? `
          <div class="section">
            <div class="section-title">工作经历</div>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-title">${exp.company} - ${exp.position}</div>
                <div class="item-meta">${exp.startDate} 至 ${exp.endDate}</div>
                ${exp.description ? `<p>${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${resumeData.skills.length > 0 ? `
          <div class="section">
            <div class="section-title">技能特长</div>
            <div class="skills">
              ${resumeData.skills.map(skill => `
                <div class="skill-tag">${skill.name}${skill.category ? ` (${skill.category})` : ''}</div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${resumeData.certificates.length > 0 ? `
          <div class="section">
            <div class="section-title">证书资质</div>
            ${resumeData.certificates.map(cert => `
              <div class="item">
                <div class="item-title">${cert.name}</div>
                <div class="item-meta">获得时间: ${cert.issueDate}</div>
                ${cert.description ? `<p>${cert.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${resumeData.awards ? `
          <div class="section">
            <div class="section-title">获得奖励</div>
            <p>${resumeData.awards}</p>
          </div>
          ` : ''}
          
          ${resumeData.hobbies ? `
          <div class="section">
            <div class="section-title">兴趣爱好</div>
            <p>${resumeData.hobbies}</p>
          </div>
          ` : ''}
        </body>
        </html>
      `)
      previewWindow.document.close()
    }
  }

  // 导出PDF简历
  const handleExport = async () => {
    try {
      // 创建一个临时的打印样式的HTML
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>简历 - ${resumeData.name || '未命名'}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 5px 0; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
            .item { margin-bottom: 15px; }
            .item-title { font-weight: bold; font-size: 16px; }
            .item-meta { color: #666; font-size: 14px; margin: 2px 0; }
            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill-tag { background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 12px; border: 1px solid #ddd; }
            p { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${resumeData.name || '姓名未填写'}</h1>
            <p><strong>联系方式:</strong> ${resumeData.phone || '未填写'} | <strong>邮箱:</strong> ${resumeData.email || '未填写'}</p>
            <p><strong>籍贯:</strong> ${resumeData.hometown || '未填写'} | <strong>出生年月:</strong> ${resumeData.birthDate || '未填写'}</p>
            ${resumeData.maritalStatus ? `<p><strong>婚育状态:</strong> ${resumeData.maritalStatus}</p>` : ''}
            ${resumeData.employmentStatus ? `<p><strong>就业状态:</strong> ${resumeData.employmentStatus}</p>` : ''}
          </div>
          
          ${resumeData.objective ? `
          <div class="section">
            <div class="section-title">求职意向</div>
            <p>${resumeData.objective}</p>
          </div>
          ` : ''}
          
          ${resumeData.summary ? `
          <div class="section">
            <div class="section-title">个人总结</div>
            <p>${resumeData.summary}</p>
          </div>
          ` : ''}
          
          ${resumeData.education.length > 0 ? `
          <div class="section">
            <div class="section-title">教育经历</div>
            ${resumeData.education.map(edu => `
              <div class="item">
                <div class="item-title">${edu.school} - ${edu.major}</div>
                <div class="item-meta">${edu.degree} | ${edu.startDate} 至 ${edu.endDate}</div>
                ${edu.description ? `<p>${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${resumeData.experience.length > 0 ? `
          <div class="section">
            <div class="section-title">工作经历</div>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-title">${exp.company} - ${exp.position}</div>
                <div class="item-meta">${exp.startDate} 至 ${exp.endDate}</div>
                ${exp.description ? `<p>${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${resumeData.skills.length > 0 ? `
          <div class="section">
            <div class="section-title">技能特长</div>
            ${resumeData.skills.map(skill => `
              <div class="item">
                <div class="item-title">${skill.name}${skill.category ? ` (${skill.category})` : ''}</div>
                ${skill.description ? `<p>${skill.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${resumeData.certificates.length > 0 ? `
          <div class="section">
            <div class="section-title">证书资质</div>
            ${resumeData.certificates.map(cert => `
              <div class="item">
                <div class="item-title">${cert.name}</div>
                <div class="item-meta">获得时间: ${cert.issueDate}</div>
                ${cert.description ? `<p>${cert.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${resumeData.awards ? `
          <div class="section">
            <div class="section-title">获得奖励</div>
            <p>${resumeData.awards}</p>
          </div>
          ` : ''}
          
          ${resumeData.hobbies ? `
          <div class="section">
            <div class="section-title">兴趣爱好</div>
            <p>${resumeData.hobbies}</p>
          </div>
          ` : ''}
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
        </html>
      `
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        message.success('正在准备PDF导出，请在打印对话框中选择"保存为PDF"')
      } else {
        message.error('无法打开打印窗口，请检查浏览器设置')
      }
    } catch (error) {
      message.error('导出失败，请重试')
    }
  }

  // 渲染模态框内容
  const renderModalContent = () => {
    switch (modalType) {
      case 'education':
        return (
          <Form form={itemForm} layout="vertical">
            <Form.Item name="school" label="学校" rules={[{ required: true }]}>
              <Input placeholder="请输入学校名称" />
            </Form.Item>
            <Form.Item name="major" label="专业" rules={[{ required: true }]}>
              <Input placeholder="请输入专业名称" />
            </Form.Item>
            <Form.Item name="degree" label="学历" rules={[{ required: true }]}>
              <Select placeholder="请选择学历">
                <Option value="专科">专科</Option>
                <Option value="本科">本科</Option>
                <Option value="硕士">硕士</Option>
                <Option value="博士">博士</Option>
              </Select>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startDate" label="开始时间" rules={[{ required: true }]}>
                  <DatePicker placeholder="开始时间" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endDate" label="结束时间" rules={[{ required: true }]}>
                  <DatePicker placeholder="结束时间" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="description" label="描述">
              <TextArea rows={3} placeholder="请输入教育经历描述" />
            </Form.Item>
          </Form>
        )

      case 'experience':
        return (
          <Form form={itemForm} layout="vertical">
            <Form.Item name="company" label="公司" rules={[{ required: true }]}>
              <Input placeholder="请输入公司名称" />
            </Form.Item>
            <Form.Item name="position" label="职位" rules={[{ required: true }]}>
              <Input placeholder="请输入职位名称" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startDate" label="开始时间" rules={[{ required: true }]}>
                  <DatePicker placeholder="开始时间" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endDate" label="结束时间">
                  <DatePicker placeholder="结束时间" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="current" valuePropName="checked">
              <Switch checkedChildren="目前在职" unCheckedChildren="已离职" />
            </Form.Item>
            <Form.Item name="description" label="工作描述" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder="请描述您的工作内容和成就" />
            </Form.Item>
          </Form>
        )

      case 'skills':
        return (
          <Form form={itemForm} layout="vertical">
            <Form.Item name="name" label="技能名称" rules={[{ required: true }]}>
              <Input placeholder="请输入技能名称" />
            </Form.Item>
            <Form.Item name="description" label="技能描述" rules={[{ required: true }]}>
              <TextArea rows={3} placeholder="请详细描述您的技能水平和相关经验" />
            </Form.Item>
            <Form.Item name="category" label="技能分类">
              <Select placeholder="请选择技能分类">
                <Option value="编程语言">编程语言</Option>
                <Option value="前端框架">前端框架</Option>
                <Option value="后端技术">后端技术</Option>
                <Option value="数据库">数据库</Option>
                <Option value="工具软件">工具软件</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
          </Form>
        )

      case 'certificates':
        return (
          <Form form={itemForm} layout="vertical">
            <Form.Item name="name" label="证书名称" rules={[{ required: true }]}>
              <Input placeholder="请输入证书名称" />
            </Form.Item>
            <Form.Item name="issueDate" label="获得时间" rules={[{ required: true }]}>
              <DatePicker placeholder="获得时间" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="description" label="证书描述">
              <TextArea rows={2} placeholder="请输入证书相关描述" />
            </Form.Item>
          </Form>
        )

      default:
        return null
    }
  }

  // 添加调试信息
  console.log('Resume组件渲染状态:', {
    resumeLoading,
    resumeResponse,
    resumeData
  })

  // 如果正在加载，显示加载状态
  if (resumeLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">
          <div>加载简历数据中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/profile')}
            >
              返回个人中心
            </Button>
            <Title level={2} className="mb-0">我的简历</Title>
          </div>
          <Space>
            <Button icon={<EyeOutlined />} onClick={handlePreview}>预览</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出PDF
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              loading={isUpdatingResume}
              onClick={handleSave}
            >
              保存简历
            </Button>
          </Space>
        </div>
=======
        
        {/* 完整度提示 */}
        <div className="mt-4">
          <Alert
            message={
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>简历完整度</span>
                  <span className="font-medium">{completeness}%</span>
                </div>
                <Progress 
                  percent={completeness} 
                  size="small"
                  status={completeness >= 80 ? 'success' : 'active'}
                />
              </div>
            }
            description={
              completeness < 80 
                ? '建议完善基本信息、求职意向、教育经历和工作经验以提高简历完整度'
                : '您的简历已经很完整了！'
            }
            type={completeness >= 80 ? 'success' : 'info'}
            showIcon
            icon={completeness >= 80 ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          />
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 基本信息 */}
        <TabPane tab="基本信息" key="basic">
          <Card>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    name="name" 
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input placeholder="请输入您的姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    name="birthDate" 
                    label="出生年月"
                    rules={[{ required: true, message: '请选择出生年月' }]}
                  >
                    <DatePicker 
                      placeholder="请选择出生年月" 
                      style={{ width: '100%' }}
                      picker="month"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    name="hometown" 
                    label="籍贯"
                    rules={[{ required: true, message: '请输入籍贯' }]}
                  >
                    <Input placeholder="请输入您的籍贯" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    name="phone" 
                    label="联系方式"
                    rules={[
                      { required: true, message: '请输入联系方式' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                    ]}
                  >
                    <Input placeholder="请输入手机号码" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item 
                name="email" 
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入您的邮箱地址" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="maritalStatus" label="婚育状态">
                    <Select placeholder="请选择婚育状态">
                      <Option value="未婚">未婚</Option>
                      <Option value="已婚未育">已婚未育</Option>
                      <Option value="已婚已育">已婚已育</Option>
                      <Option value="其他">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="employmentStatus" label="就业状态">
                    <Select placeholder="请选择就业状态">
                      <Option value="在职">在职</Option>
                      <Option value="离职">离职</Option>
                      <Option value="应届毕业生">应届毕业生</Option>
                      <Option value="实习生">实习生</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item name="objective" label="求职意向">
                <TextArea rows={2} placeholder="请描述您的求职意向（非必填）" />
              </Form.Item>
              
              <Form.Item name="summary" label="个人总结">
                <TextArea rows={4} placeholder="请简要介绍您的背景、技能和优势（非必填）" />
              </Form.Item>

              <Form.Item name="awards" label="获得奖励">
                <TextArea rows={3} placeholder="请输入您获得的奖励（非必填）" />
              </Form.Item>

              <Form.Item name="hobbies" label="兴趣爱好">
                <TextArea rows={2} placeholder="请输入您的兴趣爱好（非必填）" />
              </Form.Item>

              <Form.Item name="isPublic" valuePropName="checked">
                <Switch checkedChildren="公开简历" unCheckedChildren="私密简历" />
                <Text type="secondary" className="ml-2">
                  公开后，招聘方可以主动联系您
                </Text>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* 教育经历 */}
        <TabPane tab="教育经历" key="education">
          <Card
            title="教育经历"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => handleAddItem('education')}
              >
                添加教育经历
              </Button>
            }
          >
            <List
              dataSource={resumeData.education}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      icon={<EditOutlined />}
                      onClick={() => handleEditItem('education', item)}
                    >
                      编辑
                    </Button>,
                    <Popconfirm
                      title="确定要删除这条教育经历吗？"
                      onConfirm={() => handleDeleteItem('education', item.id)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    title={`${item.school} - ${item.major}`}
                    description={
                      <div>
                        <Tag color="blue">{item.degree}</Tag>
                        <Text type="secondary">
                          {item.startDate} 至 {item.endDate}
                        </Text>
                        {item.description && (
                          <Paragraph className="mt-2 mb-0">
                            {item.description}
                          </Paragraph>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        {/* 工作经历 */}
        <TabPane tab="工作经历" key="experience">
          <Card
            title="工作经历"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => handleAddItem('experience')}
              >
                添加工作经历
              </Button>
            }
          >
            <List
              dataSource={resumeData.experience}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      icon={<EditOutlined />}
                      onClick={() => handleEditItem('experience', item)}
                    >
                      编辑
                    </Button>,
                    <Popconfirm
                      title="确定要删除这条工作经历吗？"
                      onConfirm={() => handleDeleteItem('experience', item.id)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    title={`${item.position} - ${item.company}`}
                    description={
                      <div>
                        <div className="mb-2">
                          <Text type="secondary">
                            {item.startDate} 至 {item.current ? '至今' : item.endDate}
                          </Text>
                          {item.current && <Tag color="green" className="ml-2">在职</Tag>}
                        </div>
                        <Paragraph className="mb-0">
                          {item.description}
                        </Paragraph>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        {/* 技能证书 */}
        <TabPane tab="技能证书" key="skills">
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="专业技能"
                extra={
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddItem('skills')}
                  >
                    添加技能
                  </Button>
                }
              >
                <List
                  dataSource={resumeData.skills}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditItem('skills', item)}
                        />,
                        <Popconfirm
                          title="确定要删除这个技能吗？"
                          onConfirm={() => handleDeleteItem('skills', item.id)}
                        >
                          <Button type="link" danger size="small" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={
                          <div>
                            <Tag>{item.category}</Tag>
                            <div className="mt-1">
                              <Text type="secondary">{item.description}</Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            
            <Col span={12}>
              <Card
                title="证书资质"
                extra={
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddItem('certificates')}
                  >
                    添加证书
                  </Button>
                }
              >
                <List
                  dataSource={resumeData.certificates}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditItem('certificates', item)}
                        />,
                        <Popconfirm
                          title="确定要删除这个证书吗？"
                          onConfirm={() => handleDeleteItem('certificates', item.id)}
                        >
                          <Button type="link" danger size="small" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={
                          <div>
                            <div>{item.issuer}</div>
                            <Text type="secondary" className="text-sm">
                              {item.issueDate}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 附件管理 */}
        <TabPane tab="附件管理" key="attachments">
          <Card
            title="简历附件"
            extra={
              <Upload
                beforeUpload={(file) => {
                  handleUpload(file)
                  return false
                }}
                showUploadList={false}
              >
                <Button type="primary" icon={<UploadOutlined />}>
                  上传附件
                </Button>
              </Upload>
            }
          >
            <Alert
              message="支持的文件类型"
              description="支持上传PDF、Word文档、图片等格式的文件，单个文件大小不超过10MB"
              type="info"
              showIcon
              className="mb-4"
            />
            
            <List
              dataSource={resumeData.attachments}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(item)}
                    >
                      下载
                    </Button>,
                    <Popconfirm
                      title="确定要删除这个附件吗？"
                      onConfirm={() => handleDeleteItem('attachments', item.id)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<FileTextOutlined />} />}
                    title={item.fileName}
                    description={
                      <div>
                        <Text type="secondary">
                          {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                        </Text>
                        <Divider type="vertical" />
                        <Text type="secondary">
                          {new Date(item.uploadTime).toLocaleDateString()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 添加/编辑模态框 */}
      <Modal
        title={`${editingItem ? '编辑' : '添加'}${
          modalType === 'education' ? '教育经历' :
          modalType === 'experience' ? '工作经历' :
          modalType === 'skills' ? '技能' :
          modalType === 'certificates' ? '证书' :
          modalType === 'languages' ? '语言' :
          modalType === 'awards' ? '获奖经历' : ''
        }`}
        open={isModalVisible}
        onOk={handleSaveItem}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        {renderModalContent()}
      </Modal>
    </div>
  )
}

export default Resume