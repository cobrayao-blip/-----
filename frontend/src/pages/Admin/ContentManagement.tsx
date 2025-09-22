import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input,
  Select,
  Modal,
  Form,
  message,
  Tabs,
  Upload,
  Image,
  Switch,
  DatePicker,
  InputNumber,
  Popconfirm,
  Spin
} from 'antd'
import dayjs from 'dayjs'
import { 
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  BankOutlined,
  FileTextOutlined,
  ProjectOutlined,
  InfoCircleOutlined,
  StarOutlined
} from '@ant-design/icons'
import { 
  useGetParksQuery,
  useCreateParkMutation,
  useUpdateParkMutation,
  useDeleteParkMutation,
  useGetPoliciesQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  type Park,
  type Policy,
  type Project,
  type Job
} from '../../store/api/adminApi'
import TestimonialManagement from './TestimonialManagement'

const { Title } = Typography
const { Search } = Input
const { Option } = Select
const { TextArea } = Input

interface AboutContent {
  id: string
  section: 'mission' | 'values' | 'team' | 'contact' | 'stats'
  title: string
  content: string
  order: number
  enabled: boolean
  updatedAt: string
}

const ContentManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedPark, setSelectedPark] = useState<Park | null>(null)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create'>('view')
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'parks')
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedAboutContent, setSelectedAboutContent] = useState<AboutContent | null>(null)
  const [uploadFileList, setUploadFileList] = useState<any[]>([])

  // 关于我们相关状态
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false)
  const [aboutModalType, setAboutModalType] = useState<'edit' | 'create'>('create')
  const [aboutContents, setAboutContents] = useState<AboutContent[]>([])

  const [form] = Form.useForm()
  const [aboutForm] = Form.useForm()

  // API hooks
  const { data: parksData, isLoading: parksLoading, refetch: refetchParks, error: parksError } = useGetParksQuery({})
  const { data: policiesData, isLoading: policiesLoading, refetch: refetchPolicies, error: policiesError } = useGetPoliciesQuery({})
  const { data: projectsData, isLoading: projectsLoading, refetch: refetchProjects, error: projectsError } = useGetProjectsQuery({})
  const { data: jobsData, isLoading: jobsLoading, refetch: refetchJobs, error: jobsError } = useGetJobsQuery({})

  // 调试信息
  useEffect(() => {
    console.log('Parks Data:', parksData, 'Loading:', parksLoading, 'Error:', parksError)
    console.log('Policies Data:', policiesData, 'Loading:', policiesLoading, 'Error:', policiesError)
    console.log('Projects Data:', projectsData, 'Loading:', projectsLoading, 'Error:', projectsError)
    console.log('Jobs Data:', jobsData, 'Loading:', jobsLoading, 'Error:', jobsError)
    
    // 检查认证状态
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    console.log('当前Token:', token ? '存在' : '不存在')
    console.log('当前用户:', user ? JSON.parse(user) : '未登录')
    
    // 检查API错误并提供友好提示
    if (parksError || policiesError || projectsError || jobsError) {
      const errorMessage = parksError?.data?.message || policiesError?.data?.message || projectsError?.data?.message || jobsError?.data?.message
      if (errorMessage && errorMessage.includes('认证') || errorMessage === 'API endpoint not found') {
        message.error('认证失败，请重新登录管理员账户', 5)
        console.log('🔑 解决方案：')
        console.log('1. 访问 http://localhost:3000/admin-login')
        console.log('2. 点击"使用管理员账户登录"按钮')
        console.log('3. 或手动输入: admin@xiaoyao.com / admin123456')
      }
    }
  }, [parksData, policiesData, projectsData, jobsData, parksLoading, policiesLoading, projectsLoading, jobsLoading, parksError, policiesError, projectsError, jobsError])

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key)
    setSearchParams({ tab: key })
  }

  // 监听URL参数变化，保持标签页状态
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && ['parks', 'policies', 'projects', 'jobs', 'about', 'testimonials'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const [createPark] = useCreateParkMutation()
  const [updatePark] = useUpdateParkMutation()
  const [deletePark] = useDeleteParkMutation()

  const [createPolicy] = useCreatePolicyMutation()
  const [updatePolicy] = useUpdatePolicyMutation()
  const [deletePolicy] = useDeletePolicyMutation()

  const [createProject] = useCreateProjectMutation()
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  const [createJob] = useCreateJobMutation()
  const [updateJob] = useUpdateJobMutation()
  const [deleteJob] = useDeleteJobMutation()

  // 模拟关于我们数据
  useEffect(() => {
    setAboutContents([
      {
        id: '1',
        section: 'mission',
        title: '我们的使命',
        content: '致力于为人才提供最优质的服务平台，连接优秀人才与优质企业，推动产业发展和人才成长。',
        order: 1,
        enabled: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        section: 'values',
        title: '核心价值观',
        content: '诚信、专业、创新、共赢 - 以诚信为本，专业服务，持续创新，实现多方共赢。',
        order: 2,
        enabled: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        section: 'team',
        title: '团队介绍',
        content: '我们拥有一支专业的人才服务团队，具备丰富的行业经验和专业知识，为用户提供全方位的人才服务。',
        order: 3,
        enabled: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        section: 'contact',
        title: '联系我们',
        content: '地址：江苏省苏州市工业园区\
电话：400-123-4567\
邮箱：contact@xiaoyao.com\
网址：www.xiaoyao.com',
        order: 4,
        enabled: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        section: 'stats',
        title: '平台数据',
        content: '累计服务企业1000+家，成功匹配人才5000+人次，覆盖20+个行业领域。',
        order: 5,
        enabled: true,
        updatedAt: new Date().toISOString()
      }
    ])
  }, [])

  const getStatusLabel = (status: string) => {
    const statusMap = {
      'PUBLISHED': <Tag color="green">已发布</Tag>,
      'DRAFT': <Tag color="orange">草稿</Tag>,
      'ARCHIVED': <Tag color="red">已归档</Tag>
    }
    return statusMap[status as keyof typeof statusMap] || <Tag>{status}</Tag>
  }

  const getPolicyTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'TALENT': '人才政策',
      'INVESTMENT': '投资政策',
      'STARTUP': '创业政策',
      'INNOVATION': '创新政策',
      'FUNDING': '资金政策',
      'TAX': '税收政策',
      'HOUSING': '住房政策',
      'EDUCATION': '教育政策',
      'HEALTHCARE': '医疗政策',
      'OTHER': '其他'
    }
    return typeMap[type] || type
  }

  const getPolicyLevelLabel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'NATIONAL': '国家级',
      'PROVINCIAL': '省级',
      'MUNICIPAL': '市级',
      'DISTRICT': '区级'
    }
    return levelMap[level] || level
  }

  const getParkTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'HIGH_TECH': '高新技术园区',
      'INDUSTRIAL': '工业园区',
      'ECONOMIC': '经济开发区',
      'SCIENCE': '科技园区',
      'CULTURAL': '文化创意园区',
      'LOGISTICS': '物流园区',
      'AGRICULTURAL': '农业园区',
      'OTHER': '其他'
    }
    return typeMap[type] || type
  }

  const getParkLevelLabel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'NATIONAL': '国家级',
      'PROVINCIAL': '省级',
      'MUNICIPAL': '市级',
      'DISTRICT': '区级'
    }
    return levelMap[level] || level
  }

  const getProjectCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'TECH': '科技创新',
      'STARTUP': '创业扶持',
      'TALENT': '人才引进',
      'RESEARCH': '科研项目',
      'ENERGY': '新能源',
      'AGRICULTURE': '智慧农业',
      'FINTECH': '金融科技',
      'ENVIRONMENT': '环保技术',
      'EDUCATION': '在线教育',
      'OTHER': '其他'
    }
    return categoryMap[category] || category
  }

  const getJobTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'FULL_TIME': '全职',
      'PART_TIME': '兼职',
      'CONTRACT': '合同工',
      'INTERNSHIP': '实习',
      'REMOTE': '远程工作'
    }
    return typeMap[type] || type
  }

  const getJobLevelLabel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'JUNIOR': '初级',
      'MID': '中级',
      'SENIOR': '高级',
      'LEAD': '主管',
      'MANAGER': '经理',
      'DIRECTOR': '总监',
      'VP': '副总裁',
      'C_LEVEL': 'C级高管'
    }
    return levelMap[level] || level
  }

  const handleViewPark = (park: Park) => {
    setSelectedPark(park)
    setModalType('view')
    setIsModalVisible(true)
  }

  const handleEditPark = (park: Park) => {
    setSelectedPark(park)
    setModalType('edit')
    form.setFieldsValue(park)
    setIsModalVisible(true)
  }

  const handleCreatePark = () => {
    setSelectedPark(null)
    setModalType('create')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleDeletePark = async (parkId: string) => {
    try {
      await deletePark(parkId).unwrap()
      message.success('园区删除成功')
      refetchParks()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy)
    setModalType('view')
    setIsModalVisible(true)
  }

  const handleEditPolicy = (policy: Policy) => {
    setSelectedPolicy(policy)
    setModalType('edit')
    
    // 调试信息
    console.log('政策标题:', policy.title)
    console.log('政策内容长度:', policy.content ? policy.content.length : 0)
    console.log('政策内容预览:', policy.content ? policy.content.substring(0, 100) + '...' : '无内容')
    
    // 处理日期字段转换
    const formValues = {
      ...policy,
      effectiveDate: policy.effectiveDate ? dayjs(policy.effectiveDate) : null,
      expiryDate: policy.expiryDate ? dayjs(policy.expiryDate) : null,
      publishDate: policy.publishDate ? dayjs(policy.publishDate) : null
    }
    
    form.setFieldsValue(formValues)
    
    // 确保content字段被正确设置
    setTimeout(() => {
      if (policy.content) {
        form.setFieldValue('content', policy.content)
        console.log('✅ 已设置content字段，长度:', policy.content.length)
      }
    }, 50)
    
    // 处理附件数据 - 将JSON字符串转换为Upload组件的fileList格式
    if (policy.attachments) {
      try {
        const attachmentFiles = JSON.parse(policy.attachments)
        if (Array.isArray(attachmentFiles)) {
          const fileList = attachmentFiles.map((file, index) => ({
            uid: `${index}`,
            name: file.name,
            status: 'done' as const,
            url: file.url,
            response: {
              success: true,
              data: { url: file.url }
            }
          }))
          
          // 设置Upload组件的fileList
          setUploadFileList(fileList)
        }
      } catch (error) {
        console.error('解析附件数据失败:', error)
      }
    } else {
      setUploadFileList([])
    }
    
    setIsModalVisible(true)
  }

  const handleCreatePolicy = () => {
    setSelectedPolicy(null)
    setModalType('create')
    form.resetFields()
    setUploadFileList([]) // 清空文件列表
    setIsModalVisible(true)
  }

  const handleDeletePolicy = async (policyId: string) => {
    try {
      await deletePolicy(policyId).unwrap()
      message.success('政策删除成功')
      refetchPolicies()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setModalType('view')
    setIsModalVisible(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setModalType('edit')
    
    // 处理日期字段转换和资金单位转换
    const formValues = {
      ...project,
      applicationStart: project.applicationStart ? dayjs(project.applicationStart) : null,
      applicationEnd: project.applicationEnd ? dayjs(project.applicationEnd) : null,
      // 将元转换为万元显示
      funding: project.funding ? project.funding / 10000 : null
    }
    
    form.setFieldsValue(formValues)
    setIsModalVisible(true)
  }

  const handleCreateProject = () => {
    setSelectedProject(null)
    setModalType('create')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId).unwrap()
      message.success('项目删除成功')
      refetchProjects()
    } catch (error) {
      message.error('删除失败')
    }
  }

  // 职位相关处理函数
  const handleViewJob = (job: Job) => {
    setSelectedJob(job)
    setModalType('view')
    setIsModalVisible(true)
  }

  const handleEditJob = (job: Job) => {
    setSelectedJob(job)
    setModalType('edit')
    
    // 处理日期字段转换
    const formValues = {
      ...job,
      validUntil: job.validUntil ? dayjs(job.validUntil) : null
    }
    
    form.setFieldsValue(formValues)
    setIsModalVisible(true)
  }

  const handleCreateJob = () => {
    setSelectedJob(null)
    setModalType('create')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId).unwrap()
      message.success('职位删除成功')
      refetchJobs()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleCreateAboutContent = () => {
    setSelectedAboutContent(null)
    setAboutModalType('create')
    aboutForm.resetFields()
    setIsAboutModalVisible(true)
  }

  const handleEditAboutContent = (content: AboutContent) => {
    setSelectedAboutContent(content)
    setAboutModalType('edit')
    aboutForm.setFieldsValue(content)
    setIsAboutModalVisible(true)
  }

  const handleDeleteAboutContent = (contentId: string) => {
    setAboutContents(prev => prev.filter(item => item.id !== contentId))
    message.success('内容删除成功')
  }

  const handleAboutModalOk = async () => {
    try {
      const values = await aboutForm.validateFields()
      
      if (aboutModalType === 'create') {
        const newContent: AboutContent = {
          id: Date.now().toString(),
          ...values,
          updatedAt: new Date().toISOString()
        }
        setAboutContents(prev => [...prev, newContent])
        message.success('内容创建成功')
      } else if (aboutModalType === 'edit' && selectedAboutContent) {
        setAboutContents(prev => 
          prev.map(item => 
            item.id === selectedAboutContent.id 
              ? { ...item, ...values, updatedAt: new Date().toISOString() }
              : item
          )
        )
        message.success('内容更新成功')
      }
      
      setIsAboutModalVisible(false)
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  const handleModalOk = async () => {
    if (modalType === 'view') {
      setIsModalVisible(false)
      return
    }

    try {
      const values = await form.validateFields()
      
      // 处理日期字段转换 - 将dayjs对象转换为ISO字符串
      const processedValues = { ...values }
      
      if (activeTab === 'policies') {
        console.log('保存政策数据:', processedValues)
        console.log('附件数据:', processedValues.attachments)
        
        if (processedValues.effectiveDate) {
          processedValues.effectiveDate = processedValues.effectiveDate.toISOString()
        }
        if (processedValues.expiryDate) {
          processedValues.expiryDate = processedValues.expiryDate.toISOString()
        }
        if (processedValues.publishDate) {
          processedValues.publishDate = processedValues.publishDate.toISOString()
        }
      } else if (activeTab === 'projects') {
        if (processedValues.applicationStart) {
          processedValues.applicationStart = processedValues.applicationStart.toISOString()
        }
        if (processedValues.applicationEnd) {
          processedValues.applicationEnd = processedValues.applicationEnd.toISOString()
        }
        // 将万元转换为元
        if (processedValues.funding) {
          processedValues.funding = processedValues.funding * 10000
        }
      } else if (activeTab === 'jobs') {
        if (processedValues.validUntil) {
          processedValues.validUntil = processedValues.validUntil.toISOString()
        }
      }
      
      if (activeTab === 'parks') {
        if (modalType === 'create') {
          await createPark(processedValues).unwrap()
          message.success('园区创建成功')
          refetchParks()
        } else if (modalType === 'edit' && selectedPark) {
          await updatePark({ id: selectedPark.id, ...processedValues }).unwrap()
          message.success('园区更新成功')
          refetchParks()
        }
      } else if (activeTab === 'policies') {
        if (modalType === 'create') {
          await createPolicy(processedValues).unwrap()
          message.success('政策创建成功')
          refetchPolicies()
        } else if (modalType === 'edit' && selectedPolicy) {
          await updatePolicy({ id: selectedPolicy.id, ...processedValues }).unwrap()
          message.success('政策更新成功')
          refetchPolicies()
        }
      } else if (activeTab === 'projects') {
        if (modalType === 'create') {
          await createProject(processedValues).unwrap()
          message.success('项目创建成功')
          refetchProjects()
        } else if (modalType === 'edit' && selectedProject) {
          await updateProject({ id: selectedProject.id, ...processedValues }).unwrap()
          message.success('项目更新成功')
          refetchProjects()
        }
      } else if (activeTab === 'jobs') {
        if (modalType === 'create') {
          await createJob(processedValues).unwrap()
          message.success('职位创建成功')
          refetchJobs()
        } else if (modalType === 'edit' && selectedJob) {
          await updateJob({ id: selectedJob.id, ...processedValues }).unwrap()
          message.success('职位更新成功')
          refetchJobs()
        }
      }
      
      setIsModalVisible(false)
    } catch (error: any) {
      console.error('操作失败:', error)
      message.error(error?.data?.message || '操作失败，请重试')
    }
  }

  const getParkColumns = () => [
    {
      title: '园区名称',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: Park) => 
        record.name.toLowerCase().includes(value.toLowerCase())
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getParkTypeLabel(type)
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => getParkLevelLabel(level)
    },
    {
      title: '位置',
      key: 'location',
      render: (record: Park) => `${record.province} ${record.city} ${record.district}`
    },
    {
      title: '面积(km²)',
      dataIndex: 'area',
      key: 'area'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filteredValue: selectedStatus ? [selectedStatus] : null,
      onFilter: (value: any, record: Park) => record.status === value,
      render: (status: string) => getStatusLabel(status)
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Park) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewPark(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditPark(record)}
          />
          <Popconfirm
            title="确定删除这个园区吗？"
            onConfirm={() => handleDeletePark(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const getPolicyColumns = () => [
    {
      title: '政策标题',
      dataIndex: 'title',
      key: 'title',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: Policy) => 
        record.title.toLowerCase().includes(value.toLowerCase())
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getPolicyTypeLabel(type)
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => getPolicyLevelLabel(level)
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filteredValue: selectedStatus ? [selectedStatus] : null,
      onFilter: (value: any, record: Policy) => record.status === value,
      render: (status: string) => getStatusLabel(status)
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Policy) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewPolicy(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditPolicy(record)}
          />
          <Popconfirm
            title="确定删除这个政策吗？"
            onConfirm={() => handleDeletePolicy(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const getProjectColumns = () => [
    {
      title: '项目标题',
      dataIndex: 'title',
      key: 'title',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: Project) => 
        record.title.toLowerCase().includes(value.toLowerCase())
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => getProjectCategoryLabel(category)
    },
    {
      title: '资助金额（万元）',
      dataIndex: 'funding',
      key: 'funding',
      render: (funding: number) => funding ? (funding / 10000).toLocaleString() : '-'
    },
    {
      title: '周期（月）',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filteredValue: selectedStatus ? [selectedStatus] : null,
      onFilter: (value: any, record: Project) => record.status === value,
      render: (status: string) => getStatusLabel(status)
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Project) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewProject(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditProject(record)}
          />
          <Popconfirm
            title="确定删除这个项目吗？"
            onConfirm={() => handleDeleteProject(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const getAboutColumns = () => [
    {
      title: '分类',
      dataIndex: 'section',
      key: 'section',
      render: (section: string) => {
        const sectionMap = {
          'mission': '我们的使命',
          'values': '核心价值观',
          'team': '团队介绍',
          'contact': '联系我们',
          'stats': '数据统计'
        }
        return sectionMap[section as keyof typeof sectionMap] || section
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => content.length > 50 ? `${content.substring(0, 50)}...` : content
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order'
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Switch checked={enabled} disabled />
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: AboutContent) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditAboutContent(record)}
          />
          <Popconfirm
            title="确定删除这个内容吗？"
            onConfirm={() => handleDeleteAboutContent(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const getJobColumns = () => [
    {
      title: '职位名称',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company'
    },
    {
      title: '工作类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getJobTypeLabel(type)
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => getJobLevelLabel(level)
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      key: 'salary'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          'PUBLISHED': { color: 'green', text: '已发布' },
          'DRAFT': { color: 'orange', text: '草稿' },
          'ARCHIVED': { color: 'red', text: '已归档' }
        }
        const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status }
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      }
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-'
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount'
    },
    {
      title: '申请数',
      dataIndex: 'applicationCount',
      key: 'applicationCount'
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Job) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewJob(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditJob(record)}
          />
          <Popconfirm
            title="确定删除这个职位吗？"
            onConfirm={() => handleDeleteJob(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const renderFormFields = () => {
    if (activeTab === 'parks') {
      return (
        <>
          <Form.Item
            name="name"
            label="园区名称"
            rules={[{ required: true, message: '请输入园区名称' }]}
          >
            <Input placeholder="请输入园区名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="园区描述"
            rules={[{ required: true, message: '请输入园区描述' }]}
          >
            <TextArea rows={4} placeholder="请输入园区描述" />
          </Form.Item>

          <Form.Item
            name="province"
            label="省份"
            rules={[{ required: true, message: '请输入省份' }]}
          >
            <Input placeholder="请输入省份" />
          </Form.Item>

          <Form.Item
            name="city"
            label="城市"
            rules={[{ required: true, message: '请输入城市' }]}
          >
            <Input placeholder="请输入城市" />
          </Form.Item>

          <Form.Item
            name="district"
            label="区县"
            rules={[{ required: true, message: '请输入区县' }]}
          >
            <Input placeholder="请输入区县" />
          </Form.Item>

          <Form.Item
            name="address"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>

          <Form.Item
            name="type"
            label="园区类型"
            rules={[{ required: true, message: '请选择园区类型' }]}
          >
            <Select placeholder="请选择园区类型">
              <Option value="HIGH_TECH">高新技术园区</Option>
              <Option value="INDUSTRIAL">工业园区</Option>
              <Option value="ECONOMIC">经济开发区</Option>
              <Option value="SCIENCE">科技园区</Option>
              <Option value="CULTURAL">文化创意园区</Option>
              <Option value="LOGISTICS">物流园区</Option>
              <Option value="AGRICULTURAL">农业园区</Option>
              <Option value="OTHER">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="园区级别"
            rules={[{ required: true, message: '请选择园区级别' }]}
          >
            <Select placeholder="请选择园区级别">
              <Option value="NATIONAL">国家级</Option>
              <Option value="PROVINCIAL">省级</Option>
              <Option value="MUNICIPAL">市级</Option>
              <Option value="DISTRICT">区级</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="area"
            label="园区面积(平方公里)"
            rules={[{ required: true, message: '请输入园区面积' }]}
          >
            <InputNumber min={0} placeholder="请输入园区面积" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="establishedYear"
            label="成立年份"
            rules={[{ required: true, message: '请输入成立年份' }]}
          >
            <InputNumber min={1900} max={new Date().getFullYear()} placeholder="请输入成立年份" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="contact"
            label="联系信息"
            rules={[{ required: true, message: '请输入联系信息' }]}
          >
            <TextArea rows={3} placeholder="请输入联系信息" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="PUBLISHED">已发布</Option>
              <Option value="DRAFT">草稿</Option>
              <Option value="ARCHIVED">已归档</Option>
            </Select>
          </Form.Item>
        </>
      )
    } else if (activeTab === 'policies') {
      return (
        <>
          <Form.Item
            name="title"
            label="政策标题"
            rules={[{ required: true, message: '请输入政策标题' }]}
          >
            <Input placeholder="请输入政策标题" />
          </Form.Item>

          <Form.Item
            name="summary"
            label="政策摘要"
          >
            <TextArea rows={3} placeholder="请输入政策摘要" />
          </Form.Item>

          <Form.Item
            name="content"
            label="政策内容"
            rules={[{ required: true, message: '请输入政策内容' }]}
            extra={
              <div className="text-gray-500 text-sm">
                💡 <strong>格式提示：</strong>
                段落之间用空行分隔，每段会自动首行缩进 • 使用 **粗体** 表示重点内容 • 使用数字或符号开头可创建列表 • 内容将按原格式在详情页显示
              </div>
            }
          >
            <TextArea 
              rows={12} 
              placeholder="请输入政策内容&#10;&#10;格式提示：&#10;• 段落之间请用空行分隔&#10;• 每段开头会自动缩进&#10;• 支持换行符显示&#10;• 可以使用标题、列表等格式"
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="政策类型"
            rules={[{ required: true, message: '请选择政策类型' }]}
          >
            <Select placeholder="请选择政策类型">
              <Option value="TALENT">人才政策</Option>
              <Option value="INVESTMENT">投资政策</Option>
              <Option value="STARTUP">创业政策</Option>
              <Option value="TAX">税收政策</Option>
              <Option value="HOUSING">住房政策</Option>
              <Option value="EDUCATION">教育政策</Option>
              <Option value="OTHER">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="政策级别"
            rules={[{ required: true, message: '请选择政策级别' }]}
          >
            <Select placeholder="请选择政策级别">
              <Option value="NATIONAL">国家级</Option>
              <Option value="PROVINCIAL">省级</Option>
              <Option value="MUNICIPAL">市级</Option>
              <Option value="DISTRICT">区级</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="publishDate"
            label="发布日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="effectiveDate"
            label="生效日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label="失效日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Input placeholder="请输入标签，多个标签用逗号分隔" />
          </Form.Item>

          <Form.Item
            name="keywords"
            label="关键词"
          >
            <Input placeholder="请输入关键词，多个关键词用逗号分隔" />
          </Form.Item>

          <Form.Item
            name="department"
            label="发布部门"
          >
            <Input placeholder="请输入发布部门" />
          </Form.Item>

          <Form.Item
            name="attachments"
            label="附件"
          >
            <Upload
              multiple
              action="/api/admin/upload"
              name="files"
              fileList={uploadFileList}
              headers={{
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }}
              onChange={(info) => {
                const { fileList } = info
                
                // 更新文件列表状态
                setUploadFileList(fileList)
                
                // 过滤出上传成功的文件
                const successFiles = fileList
                  .filter(file => file.status === 'done' && file.response?.success)
                  .map(file => ({
                    name: file.name,
                    url: file.response.data[0]?.url || file.response.data?.url || file.url
                  }))
                
                // 将文件信息存储为JSON字符串
                if (successFiles.length > 0) {
                  form.setFieldsValue({
                    attachments: JSON.stringify(successFiles)
                  })
                }
                
                // 处理上传错误
                if (info.file.status === 'error') {
                  message.error(`${info.file.name} 上传失败`)
                } else if (info.file.status === 'done') {
                  message.success(`${info.file.name} 上传成功`)
                }
              }}
              onRemove={(file) => {
                // 当删除文件时，更新表单数据
                const newFileList = uploadFileList.filter(item => item.uid !== file.uid)
                setUploadFileList(newFileList)
                
                const successFiles = newFileList
                  .filter(file => file.status === 'done')
                  .map(file => ({
                    name: file.name,
                    url: file.url || file.response?.data?.url
                  }))
                
                form.setFieldsValue({
                  attachments: successFiles.length > 0 ? JSON.stringify(successFiles) : ''
                })
              }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <div className="text-gray-500 text-sm mt-1">
              支持上传多个文件，文件格式：PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX等，单个文件最大10MB
            </div>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="PUBLISHED">已发布</Option>
              <Option value="DRAFT">草稿</Option>
              <Option value="ARCHIVED">已归档</Option>
            </Select>
          </Form.Item>
        </>
      )
    } else if (activeTab === 'projects') {
      return (
        <>
          <Form.Item
            name="title"
            label="项目标题"
            rules={[{ required: true, message: '请输入项目标题' }]}
          >
            <Input placeholder="请输入项目标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea rows={20} placeholder="请输入项目描述" />
          </Form.Item>

          <Form.Item
            name="category"
            label="项目分类"
            rules={[{ required: true, message: '请选择项目分类' }]}
          >
            <Select placeholder="请选择项目分类">
              <Option value="TECH">科技创新</Option>
              <Option value="STARTUP">创业扶持</Option>
              <Option value="TALENT">人才引进</Option>
              <Option value="RESEARCH">科研项目</Option>
              <Option value="OTHER">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="funding"
            label="资助金额（万元）"
          >
            <InputNumber min={0} placeholder="请输入资助金额" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="项目周期（月）"
          >
            <InputNumber min={1} placeholder="请输入项目周期" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="申报要求"
          >
            <TextArea rows={4} placeholder="请输入申报要求" />
          </Form.Item>

          <Form.Item
            name="benefits"
            label="项目优势"
          >
            <TextArea rows={4} placeholder="请输入项目优势" />
          </Form.Item>

          <Form.Item
            name="applicationStart"
            label="申报开始时间"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="applicationEnd"
            label="申报结束时间"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="联系人"
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="联系电话"
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="contactEmail"
            label="联系邮箱"
          >
            <Input placeholder="请输入联系邮箱" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="PUBLISHED">已发布</Option>
              <Option value="DRAFT">草稿</Option>
              <Option value="ARCHIVED">已归档</Option>
            </Select>
          </Form.Item>
        </>
      )
    } else if (activeTab === 'jobs') {
      return (
        <>
          <Form.Item
            name="title"
            label="职位名称"
            rules={[{ required: true, message: '请输入职位名称' }]}
          >
            <Input placeholder="请输入职位名称" />
          </Form.Item>

          <Form.Item
            name="company"
            label="公司名称"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="职位描述"
            rules={[{ required: true, message: '请输入职位描述' }]}
          >
            <TextArea rows={6} placeholder="请输入职位描述" />
          </Form.Item>

          <Form.Item
            name="type"
            label="工作类型"
            rules={[{ required: true, message: '请选择工作类型' }]}
          >
            <Select placeholder="请选择工作类型">
              <Option value="全职">全职</Option>
              <Option value="兼职">兼职</Option>
              <Option value="实习">实习</Option>
              <Option value="合同工">合同工</Option>
              <Option value="远程">远程</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="职位级别"
            rules={[{ required: true, message: '请输入职位级别' }]}
          >
            <Input placeholder="请输入职位级别，如：初级、中级、高级、专家级" />
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item
            name="location"
            label="工作地点"
            rules={[{ required: true, message: '请输入工作地点' }]}
          >
            <Input placeholder="请输入工作地点" />
          </Form.Item>

          <Form.Item
            name="salary"
            label="薪资范围"
          >
            <Input placeholder="请输入薪资范围，如：8K-15K、面议" />
          </Form.Item>

          <Form.Item
            name="benefits"
            label="福利待遇"
          >
            <TextArea rows={3} placeholder="请输入福利待遇" />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="任职要求"
          >
            <TextArea rows={4} placeholder="请输入任职要求" />
          </Form.Item>

          <Form.Item
            name="companySize"
            label="公司规模"
          >
            <Select placeholder="请选择公司规模">
              <Option value="1-20人">1-20人</Option>
              <Option value="21-100人">21-100人</Option>
              <Option value="101-500人">101-500人</Option>
              <Option value="501-1000人">501-1000人</Option>
              <Option value="1000人以上">1000人以上</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="industry"
            label="所属行业"
          >
            <Select placeholder="请选择所属行业">
              <Option value="TECH">科技</Option>
              <Option value="FINANCE">金融</Option>
              <Option value="EDUCATION">教育</Option>
              <Option value="HEALTHCARE">医疗</Option>
              <Option value="MANUFACTURING">制造业</Option>
              <Option value="RETAIL">零售</Option>
              <Option value="CONSULTING">咨询</Option>
              <Option value="MEDIA">媒体</Option>
              <Option value="OTHER">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="validUntil"
            label="有效期至"
          >
            <DatePicker 
              placeholder="请选择有效期" 
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            name="contact"
            label="联系方式"
          >
            <Input placeholder="请输入联系方式" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="PUBLISHED">已发布</Option>
              <Option value="DRAFT">草稿</Option>
              <Option value="ARCHIVED">已归档</Option>
            </Select>
          </Form.Item>
        </>
      )
    }
    return null
  }

  const renderViewContent = () => {
    if (modalType !== 'view') return null

    if (activeTab === 'parks' && selectedPark) {
      return (
        <div>
          <p><strong>园区名称：</strong>{selectedPark.name}</p>
          <p><strong>描述：</strong>{selectedPark.description}</p>
          <p><strong>位置：</strong>{selectedPark.province} {selectedPark.city} {selectedPark.district}</p>
          <p><strong>详细地址：</strong>{selectedPark.address}</p>
          <p><strong>园区类型：</strong>{selectedPark.type}</p>
          <p><strong>园区级别：</strong>{selectedPark.level}</p>
          <p><strong>面积：</strong>{selectedPark.area} 平方公里</p>
          <p><strong>成立年份：</strong>{selectedPark.establishedYear}</p>
          <p><strong>联系信息：</strong>{selectedPark.contact}</p>
          <p><strong>状态：</strong>{getStatusLabel(selectedPark.status)}</p>
          <p><strong>创建时间：</strong>{new Date(selectedPark.createdAt).toLocaleString()}</p>
        </div>
      )
    } else if (activeTab === 'policies' && selectedPolicy) {
      return (
        <div>
          <div className="bg-blue-100 p-3 mb-4 rounded border-l-4 border-blue-500">
            <h4 className="text-blue-800 font-bold">🔍 政策详情页面</h4>
            <p className="text-blue-600 text-sm">如果您看到这个蓝色框，说明您正在查看政策详情</p>
          </div>
          <p><strong>政策标题：</strong>{selectedPolicy.title}</p>
          <div className="mb-3">
            <strong>政策摘要：</strong>
            <div className="mt-1 p-2 bg-gray-50 rounded text-sm" style={{ whiteSpace: 'pre-wrap' }}>
              {selectedPolicy.summary || '未设置'}
            </div>
          </div>
          <div className="mb-3">
            <strong>政策内容：</strong>
            <div className="mt-1 p-3 bg-white border rounded policy-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '13px' }}>
              {selectedPolicy.content}
            </div>
          </div>
          <p><strong>政策类型：</strong>{getPolicyTypeLabel(selectedPolicy.type)}</p>
          <p><strong>政策级别：</strong>{getPolicyLevelLabel(selectedPolicy.level)}</p>
          <p><strong>发布日期：</strong>{selectedPolicy.publishDate ? new Date(selectedPolicy.publishDate).toLocaleDateString() : '未设置'}</p>
          <p><strong>生效日期：</strong>{selectedPolicy.effectiveDate ? new Date(selectedPolicy.effectiveDate).toLocaleDateString() : '未设置'}</p>
          {selectedPolicy.expiryDate && <p><strong>失效日期：</strong>{new Date(selectedPolicy.expiryDate).toLocaleDateString()}</p>}
          <p><strong>标签：</strong>{selectedPolicy.tags || '未设置'}</p>
          <p><strong>关键词：</strong>{selectedPolicy.keywords || '未设置'}</p>
          <p><strong>发布部门：</strong>{selectedPolicy.department || '未设置'}</p>
          <p><strong>原始附件数据：</strong>
            <code className="bg-gray-100 p-1 rounded text-xs">
              {JSON.stringify(selectedPolicy.attachments) || 'null'}
            </code>
          </p>
          <p><strong>附件：</strong>
            {(() => {
              console.log('=== 附件调试开始 ===')
              console.log('selectedPolicy:', selectedPolicy)
              console.log('附件原始数据:', selectedPolicy.attachments)
              console.log('附件数据类型:', typeof selectedPolicy.attachments)
              
              if (!selectedPolicy.attachments) {
                console.log('附件数据为空或null')
                return <span className="text-gray-500">无附件数据</span>
              }
              
              if (selectedPolicy.attachments === '') {
                console.log('附件数据为空字符串')
                return <span className="text-gray-500">附件数据为空</span>
              }
              
              try {
                const attachments = JSON.parse(selectedPolicy.attachments)
                console.log('解析后的附件数组:', attachments)
                console.log('附件数组长度:', attachments?.length)
                
                if (!Array.isArray(attachments)) {
                  console.log('附件数据不是数组格式')
                  return <span className="text-orange-500">附件数据格式错误（非数组）</span>
                }
                
                if (attachments.length === 0) {
                  console.log('附件数组为空')
                  return <span className="text-gray-500">附件数组为空</span>
                }
                
                console.log('准备渲染附件列表')
                return (
                  <div className="mt-2">
                    <div className="text-green-600 text-sm mb-2">找到 {attachments.length} 个附件：</div>
                    {attachments.map((file: any, index: number) => {
                      console.log(`附件 ${index}:`, file)
                      return (
                        <div key={index} className="mb-1 p-2 bg-gray-50 rounded">
                          <Button 
                            type="link" 
                            size="small"
                            icon={<UploadOutlined />}
                            onClick={() => {
                              console.log('点击下载文件:', file)
                              if (file.url) {
                                console.log('打开文件URL:', file.url)
                                window.open(file.url, '_blank')
                              } else {
                                console.log('文件URL不存在')
                                message.info('文件链接不可用')
                              }
                            }}
                          >
                            {file.name || '未知文件名'}
                          </Button>
                          <div className="text-xs text-gray-500 ml-4">
                            URL: {file.url || '无URL'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              } catch (e) {
                console.error('解析附件JSON失败:', e)
                console.log('原始附件数据:', selectedPolicy.attachments)
                return (
                  <div>
                    <span className="text-red-500">附件数据解析失败</span>
                    <div className="text-xs text-gray-500 mt-1">
                      原始数据: {selectedPolicy.attachments}
                    </div>
                  </div>
                )
              }
            })()}
          </p>
          <p><strong>状态：</strong>{getStatusLabel(selectedPolicy.status)}</p>
          <p><strong>创建时间：</strong>{new Date(selectedPolicy.createdAt).toLocaleString()}</p>
        </div>
      )
    } else if (activeTab === 'projects' && selectedProject) {
      return (
        <div>
          <p><strong>项目标题：</strong>{selectedProject.title}</p>
          <p><strong>描述：</strong>{selectedProject.description}</p>
          <p><strong>分类：</strong>{selectedProject.category}</p>
          <p><strong>资助金额：</strong>{selectedProject.funding ? `${(selectedProject.funding / 10000).toLocaleString()}万元` : '未设置'}</p>
          <p><strong>周期：</strong>{selectedProject.duration ? `${selectedProject.duration}个月` : '未设置'}</p>
          <p><strong>申报要求：</strong>{selectedProject.requirements || '未设置'}</p>
          <p><strong>项目优势：</strong>{selectedProject.benefits || '未设置'}</p>
          <p><strong>申报开始时间：</strong>{selectedProject.applicationStart ? new Date(selectedProject.applicationStart).toLocaleDateString() : '未设置'}</p>
          <p><strong>申报结束时间：</strong>{selectedProject.applicationEnd ? new Date(selectedProject.applicationEnd).toLocaleDateString() : '未设置'}</p>
          <p><strong>联系人：</strong>{selectedProject.contactPerson || '未设置'}</p>
          <p><strong>联系电话：</strong>{selectedProject.contactPhone || '未设置'}</p>
          <p><strong>联系邮箱：</strong>{selectedProject.contactEmail || '未设置'}</p>
          <p><strong>状态：</strong>{getStatusLabel(selectedProject.status)}</p>
          <p><strong>创建时间：</strong>{new Date(selectedProject.createdAt).toLocaleString()}</p>
        </div>
      )
    } else if (activeTab === 'jobs' && selectedJob) {
      return (
        <div>
          <p><strong>职位名称：</strong>{selectedJob.title}</p>
          <p><strong>公司名称：</strong>{selectedJob.company}</p>
          <div className="mb-3">
            <strong>职位描述：</strong>
            <div className="mt-1 p-3 bg-gray-50 rounded" style={{ whiteSpace: 'pre-wrap' }}>
              {selectedJob.description}
            </div>
          </div>
          <p><strong>工作类型：</strong>{selectedJob.type}</p>
          <p><strong>职位级别：</strong>{selectedJob.level}</p>
          <p><strong>部门：</strong>{selectedJob.department || '未设置'}</p>
          <p><strong>工作地点：</strong>{selectedJob.location}</p>
          <p><strong>薪资范围：</strong>{selectedJob.salary || '未设置'}</p>
          {selectedJob.benefits && (
            <div className="mb-3">
              <strong>福利待遇：</strong>
              <div className="mt-1 p-2 bg-gray-50 rounded text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedJob.benefits}
              </div>
            </div>
          )}
          {selectedJob.requirements && (
            <div className="mb-3">
              <strong>任职要求：</strong>
              <div className="mt-1 p-2 bg-gray-50 rounded text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedJob.requirements}
              </div>
            </div>
          )}
          <p><strong>公司规模：</strong>{selectedJob.companySize || '未设置'}</p>
          <p><strong>所属行业：</strong>{selectedJob.industry || '未设置'}</p>
          <p><strong>发布时间：</strong>{selectedJob.publishDate ? new Date(selectedJob.publishDate).toLocaleDateString() : '未设置'}</p>
          <p><strong>有效期至：</strong>{selectedJob.validUntil ? new Date(selectedJob.validUntil).toLocaleDateString() : '未设置'}</p>
          <p><strong>联系方式：</strong>{selectedJob.contact || '未设置'}</p>
          <p><strong>浏览量：</strong>{selectedJob.viewCount || 0}</p>
          <p><strong>申请数：</strong>{selectedJob.applicationCount || 0}</p>
          <p><strong>状态：</strong>{getStatusLabel(selectedJob.status)}</p>
          <p><strong>创建时间：</strong>{new Date(selectedJob.createdAt || new Date()).toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  const tabItems = [
    {
      key: 'parks',
      label: (
        <Space>
          <BankOutlined />
          园区管理
        </Space>
      ),
      children: (
        <div>
          <div className="mb-4">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreatePark}
            >
              新增园区
            </Button>
          </div>
          <Spin spinning={parksLoading}>
            <Table
              columns={getParkColumns()}
              dataSource={parksData?.parks || []}
              rowKey="id"
              pagination={{
                current: 1,
                pageSize: 10,
                total: parksData?.total || 0
              }}
            />
          </Spin>
        </div>
      )
    },
    {
      key: 'policies',
      label: (
        <Space>
          <FileTextOutlined />
          政策管理
        </Space>
      ),
      children: (
        <div>
          <div className="mb-4">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreatePolicy}
            >
              新增政策
            </Button>
          </div>
          <Spin spinning={policiesLoading}>
            <Table
              columns={getPolicyColumns()}
              dataSource={policiesData?.policies || []}
              rowKey="id"
              pagination={{
                current: 1,
                pageSize: 10,
                total: policiesData?.total || 0
              }}
            />
          </Spin>
        </div>
      )
    },
    {
      key: 'projects',
      label: (
        <Space>
          <ProjectOutlined />
          项目管理
        </Space>
      ),
      children: (
        <div>
          <div className="mb-4">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateProject}
            >
              新增项目
            </Button>
          </div>
          <Spin spinning={projectsLoading}>
            <Table
              columns={getProjectColumns()}
              dataSource={projectsData?.projects || []}
              rowKey="id"
              pagination={{
                current: 1,
                pageSize: 10,
                total: projectsData?.total || 0
              }}
            />
          </Spin>
        </div>
      )
    },
    {
      key: 'jobs',
      label: (
        <Space>
          <ProjectOutlined />
          职位管理
        </Space>
      ),
      children: (
        <div>
          <div className="mb-4">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateJob}
            >
              新增职位
            </Button>
          </div>
          <Spin spinning={jobsLoading}>
            <Table
              columns={getJobColumns()}
              dataSource={jobsData?.jobs || []}
              rowKey="id"
              pagination={{
                current: 1,
                pageSize: 10,
                total: jobsData?.total || 0
              }}
            />
          </Spin>
        </div>
      )
    },
    {
      key: 'about',
      label: (
        <Space>
          <InfoCircleOutlined />
          关于我们
        </Space>
      ),
      children: (
        <div>
          <div className="mb-4">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateAboutContent}
            >
              新增内容
            </Button>
          </div>
          <Table
            columns={getAboutColumns()}
            dataSource={aboutContents}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
          />
        </div>
      )
    },
    {
      key: 'testimonials',
      label: (
        <Space>
          <StarOutlined />
          评价管理
        </Space>
      ),
      children: <TestimonialManagement />
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>内容管理</Title>
      </div>

      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          items={tabItems}
          tabBarExtraContent={
            <Space>
              <Search
                placeholder="搜索内容标题"
                allowClear
                style={{ width: 250 }}
                onSearch={setSearchText}
              />
              <Select
                placeholder="状态"
                allowClear
                style={{ width: 100 }}
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Option value="PUBLISHED">已发布</Option>
                <Option value="DRAFT">草稿</Option>
                <Option value="ARCHIVED">已归档</Option>
              </Select>
            </Space>
          }
        />
      </Card>

      {/* 内容编辑模态框 */}
      <Modal
        title={
          modalType === 'view' ? '内容详情' :
          modalType === 'edit' ? '编辑内容' : '新增内容'
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText={modalType === 'view' ? '关闭' : '确定'}
        cancelText="取消"
      >
        {modalType === 'view' ? (
          renderViewContent()
        ) : (
          <Form form={form} layout="vertical">
            {renderFormFields()}
          </Form>
        )}
      </Modal>

      {/* 关于我们内容编辑模态框 */}
      <Modal
        title={aboutModalType === 'edit' ? '编辑关于我们内容' : '新增关于我们内容'}
        open={isAboutModalVisible}
        onOk={handleAboutModalOk}
        onCancel={() => setIsAboutModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={aboutForm} layout="vertical">
          <Form.Item
            name="section"
            label="内容分类"
            rules={[{ required: true, message: '请选择内容分类' }]}
          >
            <Select placeholder="请选择内容分类">
              <Option value="mission">我们的使命</Option>
              <Option value="values">核心价值观</Option>
              <Option value="team">团队介绍</Option>
              <Option value="contact">联系我们</Option>
              <Option value="stats">数据统计</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={4} placeholder="请输入内容" />
          </Form.Item>

          <Form.Item
            name="order"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber min={1} placeholder="请输入排序" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ContentManagement