import React, { useState } from 'react'
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
  Descriptions,
  Steps,
  Upload,
  Image,
  Tabs,
  Timeline,
  Rate,
  Spin,
  Alert,
  Row,
  Col,
  Popconfirm
} from 'antd'
import { 
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  UserOutlined,
  ProjectOutlined,
  CalendarOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { 
  useGetProjectApplicationsQuery,
  useGetJobApplicationsQuery,
  useReviewProjectApplicationMutation,
  useReviewJobApplicationMutation,
  type Application 
} from '../../store/api/adminApi'

const { Title, Text } = Typography
const { Search, TextArea } = Input
const { Option } = Select
const { Step } = Steps
const { TabPane } = Tabs

const ApplicationManagement: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [reviewForm] = Form.useForm()

  // 获取项目申报数据
  const { 
    data: projectApplicationsData, 
    isLoading: isLoadingProjects, 
    error: projectError,
    refetch: refetchProjects 
  } = useGetProjectApplicationsQuery({
    page: currentPage,
    limit: pageSize,
    status: selectedStatus || undefined
  })

  // 获取工作申报数据
  const { 
    data: jobApplicationsData, 
    isLoading: isLoadingJobs, 
    error: jobError,
    refetch: refetchJobs 
  } = useGetJobApplicationsQuery({
    page: currentPage,
    limit: pageSize,
    status: selectedStatus || undefined
  })

  // 审核项目申报
  const [reviewProjectApplication, { isLoading: isReviewingProject }] = useReviewProjectApplicationMutation()
  
  // 审核工作申报
  const [reviewJobApplication, { isLoading: isReviewingJob }] = useReviewJobApplicationMutation()

  const projectApplications = projectApplicationsData?.applications || []
  const jobApplications = jobApplicationsData?.applications || []
  const projectTotal = projectApplicationsData?.total || 0
  const jobTotal = jobApplicationsData?.total || 0

  const currentApplications = activeTab === 'projects' ? projectApplications : jobApplications
  const currentTotal = activeTab === 'projects' ? projectTotal : jobTotal
  const isLoading = activeTab === 'projects' ? isLoadingProjects : isLoadingJobs
  const error = activeTab === 'projects' ? projectError : jobError

  // 处理审核
  const handleReview = async (values: any) => {
    if (!selectedApplication) return

    try {
      if (activeTab === 'projects') {
        await reviewProjectApplication({
          id: selectedApplication.id,
          status: values.status,
          comment: values.comment
        }).unwrap()
      } else {
        await reviewJobApplication({
          id: selectedApplication.id,
          status: values.status,
          comment: values.comment
        }).unwrap()
      }
      
      message.success('审核完成')
      setIsReviewModalVisible(false)
      reviewForm.resetFields()
    } catch (error) {
      message.error('审核失败')
    }
  }

  // 处理查看详情
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
    setIsModalVisible(true)
  }

  // 处理审核操作
  const handleReviewApplication = (application: Application) => {
    setSelectedApplication(application)
    setIsReviewModalVisible(true)
  }

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  // 处理状态筛选
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key)
    setCurrentPage(1)
  }

  // 刷新数据
  const handleRefresh = () => {
    if (activeTab === 'projects') {
      refetchProjects()
    } else {
      refetchJobs()
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'processing'
      case 'APPROVED': return 'success'
      case 'REJECTED': return 'error'
      case 'UNDER_REVIEW': return 'warning'
      default: return 'default'
    }
  }

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '待审核'
      case 'APPROVED': return '已通过'
      case 'REJECTED': return '已拒绝'
      case 'UNDER_REVIEW': return '审核中'
      default: return status
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '申请人',
      key: 'applicant',
      render: (record: Application) => (
        <Space>
          <UserOutlined />
          <div>
            <div className="font-medium">{record.applicantName}</div>
            <div className="text-sm text-gray-500">{record.applicantEmail}</div>
          </div>
        </Space>
      )
    },
    {
      title: activeTab === 'projects' ? '项目名称' : '职位名称',
      dataIndex: 'targetTitle',
      key: 'targetTitle',
      render: (title: string) => (
        <Button type="link" className="p-0 h-auto">
          {title}
        </Button>
      )
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: '审核时间',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      render: (date: string) => date ? new Date(date).toLocaleString() : '-'
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      render: (reviewer: string) => reviewer || '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Application) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewApplication(record)}
          >
            查看
          </Button>
          {record.status === 'PENDING' && (
            <Button 
              type="link" 
              icon={<CheckOutlined />}
              onClick={() => handleReviewApplication(record)}
            >
              审核
            </Button>
          )}
        </Space>
      )
    }
  ]

  // 渲染申报详情
  const renderApplicationDetail = () => {
    if (!selectedApplication) return null

    return (
      <Tabs defaultActiveKey="basic">
        <TabPane tab="基本信息" key="basic">
          <Descriptions column={2}>
            <Descriptions.Item label="申请人">{selectedApplication.applicantName}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{selectedApplication.applicantEmail}</Descriptions.Item>
            <Descriptions.Item label={activeTab === 'projects' ? '项目名称' : '职位名称'}>
              {selectedApplication.targetTitle}
            </Descriptions.Item>
            <Descriptions.Item label="申请类型">
              {activeTab === 'projects' ? '项目申报' : '工作申请'}
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">
              {new Date(selectedApplication.submitTime).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={getStatusColor(selectedApplication.status)}>
                {getStatusLabel(selectedApplication.status)}
              </Tag>
            </Descriptions.Item>
            {selectedApplication.reviewTime && (
              <Descriptions.Item label="审核时间">
                {new Date(selectedApplication.reviewTime).toLocaleString()}
              </Descriptions.Item>
            )}
            {selectedApplication.reviewer && (
              <Descriptions.Item label="审核人">{selectedApplication.reviewer}</Descriptions.Item>
            )}
            {selectedApplication.reviewComment && (
              <Descriptions.Item label="审核意见" span={2}>
                {selectedApplication.reviewComment}
              </Descriptions.Item>
            )}
          </Descriptions>
        </TabPane>
        
        <TabPane tab="申报材料" key="documents">
          <div className="space-y-4">
            {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
              selectedApplication.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <Space>
                    <FileTextOutlined />
                    <span>{doc}</span>
                  </Space>
                  <Button icon={<DownloadOutlined />} size="small">
                    下载
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                暂无申报材料
              </div>
            )}
          </div>
        </TabPane>

        <TabPane tab="审核记录" key="history">
          <Timeline>
            <Timeline.Item color="blue">
              <div>
                <div className="font-medium">申报提交</div>
                <div className="text-sm text-gray-500">
                  {new Date(selectedApplication.submitTime).toLocaleString()}
                </div>
              </div>
            </Timeline.Item>
            {selectedApplication.reviewTime && (
              <Timeline.Item 
                color={selectedApplication.status === 'APPROVED' ? 'green' : 'red'}
              >
                <div>
                  <div className="font-medium">
                    审核{selectedApplication.status === 'APPROVED' ? '通过' : '拒绝'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedApplication.reviewTime).toLocaleString()}
                  </div>
                  {selectedApplication.reviewComment && (
                    <div className="text-sm mt-1">
                      审核意见：{selectedApplication.reviewComment}
                    </div>
                  )}
                </div>
              </Timeline.Item>
            )}
          </Timeline>
        </TabPane>
      </Tabs>
    )
  }

  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description="无法获取申报数据，请稍后重试"
        type="error"
        showIcon
        action={
          <Button size="small" onClick={handleRefresh}>
            重试
          </Button>
        }
      />
    )
  }

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          <Title level={2}>申报管理</Title>
          
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Search
                placeholder="搜索申请人或项目名称"
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="选择状态"
                allowClear
                onChange={handleStatusChange}
                style={{ width: '100%' }}
              >
                <Option value="PENDING">待审核</Option>
                <Option value="UNDER_REVIEW">审核中</Option>
                <Option value="APPROVED">已通过</Option>
                <Option value="REJECTED">已拒绝</Option>
              </Select>
            </Col>
            <Col span={12}>
              <Space>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                >
                  刷新
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane 
            tab={`项目申报 (${projectTotal})`} 
            key="projects"
          >
            <Table
              columns={columns}
              dataSource={currentApplications}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: currentTotal,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                onChange: (page, size) => {
                  setCurrentPage(page)
                  setPageSize(size || 10)
                }
              }}
            />
          </TabPane>
          
          <TabPane 
            tab={`工作申请 (${jobTotal})`} 
            key="jobs"
          >
            <Table
              columns={columns}
              dataSource={currentApplications}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: currentTotal,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                onChange: (page, size) => {
                  setCurrentPage(page)
                  setPageSize(size || 10)
                }
              }}
            />
          </TabPane>
        </Tabs>

        {/* 申报详情模态框 */}
        <Modal
          title="申报详情"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={1000}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              关闭
            </Button>
          ]}
        >
          {renderApplicationDetail()}
        </Modal>

        {/* 审核模态框 */}
        <Modal
          title="审核申报"
          open={isReviewModalVisible}
          onOk={() => reviewForm.submit()}
          onCancel={() => {
            setIsReviewModalVisible(false)
            reviewForm.resetFields()
          }}
          confirmLoading={isReviewingProject || isReviewingJob}
          okText="提交审核"
          cancelText="取消"
        >
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={handleReview}
          >
            <Form.Item
              name="status"
              label="审核结果"
              rules={[{ required: true, message: '请选择审核结果' }]}
            >
              <Select placeholder="请选择审核结果">
                <Option value="APPROVED">通过</Option>
                <Option value="REJECTED">拒绝</Option>
                <Option value="UNDER_REVIEW">需要进一步审核</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="comment"
              label="审核意见"
              rules={[{ required: true, message: '请填写审核意见' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="请填写审核意见..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export default ApplicationManagement