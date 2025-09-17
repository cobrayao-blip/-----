import React, { useState } from 'react'
import { 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Modal, 
  Descriptions,
  Timeline,
  Input,
  Select,
  DatePicker,
  Form,
  message,
  Tabs,
  Statistic,
  Progress
} from 'antd'
import { 
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const JobApplications: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [searchForm] = Form.useForm()

  // 模拟求职申请数据
  const jobApplications = [
    {
      id: '1',
      jobTitle: '高级前端工程师',
      company: '腾讯科技有限公司',
      location: '深圳市南山区',
      salary: '25K-35K',
      status: 'INTERVIEW_SCHEDULED',
      applyTime: '2024-01-15 14:30:00',
      updateTime: '2024-01-18 10:20:00',
      jobType: 'FULL_TIME',
      workExperience: '3-5年',
      education: '本科',
      description: '负责公司核心产品的前端开发工作，参与产品架构设计和技术选型。',
      requirements: ['React', 'TypeScript', 'Node.js', '微前端'],
      benefits: ['五险一金', '年终奖', '股票期权', '弹性工作'],
      interviewTime: '2024-01-20 14:00:00',
      interviewLocation: '腾讯大厦A座15楼',
      contactPerson: '张经理',
      contactPhone: '13800138001'
    },
    {
      id: '2',
      jobTitle: 'Python后端开发工程师',
      company: '字节跳动科技有限公司',
      location: '北京市海淀区',
      salary: '30K-45K',
      status: 'PENDING',
      applyTime: '2024-01-20 09:15:00',
      updateTime: '2024-01-20 09:15:00',
      jobType: 'FULL_TIME',
      workExperience: '3-5年',
      education: '本科',
      description: '负责后端服务开发，参与系统架构设计和性能优化。',
      requirements: ['Python', 'Django', 'MySQL', 'Redis'],
      benefits: ['六险一金', '免费三餐', '健身房', '年度旅游']
    },
    {
      id: '3',
      jobTitle: 'UI/UX设计师',
      company: '美团点评',
      location: '北京市朝阳区',
      salary: '20K-30K',
      status: 'REJECTED',
      applyTime: '2024-01-10 16:45:00',
      updateTime: '2024-01-12 14:30:00',
      jobType: 'FULL_TIME',
      workExperience: '2-4年',
      education: '本科',
      description: '负责产品界面设计和用户体验优化。',
      requirements: ['Figma', 'Sketch', 'Photoshop', '用户研究'],
      benefits: ['五险一金', '年终奖', '带薪年假'],
      rejectReason: '工作经验不符合要求'
    },
    {
      id: '4',
      jobTitle: '产品经理',
      company: '阿里巴巴集团',
      location: '杭州市西湖区',
      salary: '35K-50K',
      status: 'OFFER_RECEIVED',
      applyTime: '2024-01-05 11:20:00',
      updateTime: '2024-01-25 16:30:00',
      jobType: 'FULL_TIME',
      workExperience: '5-8年',
      education: '硕士',
      description: '负责产品规划和需求分析，协调各部门推进产品开发。',
      requirements: ['产品设计', '数据分析', '项目管理', 'SQL'],
      benefits: ['股票期权', '六险一金', '免费班车', '子女教育基金'],
      offerDetails: {
        salary: '42K',
        bonus: '6个月年终奖',
        stockOptions: '10000股',
        startDate: '2024-02-15'
      }
    }
  ]

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待处理',
      'VIEWED': '已查看',
      'INTERVIEW_SCHEDULED': '面试安排',
      'INTERVIEWED': '已面试',
      'OFFER_RECEIVED': '收到Offer',
      'REJECTED': '已拒绝',
      'WITHDRAWN': '已撤回'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'PENDING': 'processing',
      'VIEWED': 'default',
      'INTERVIEW_SCHEDULED': 'warning',
      'INTERVIEWED': 'purple',
      'OFFER_RECEIVED': 'success',
      'REJECTED': 'error',
      'WITHDRAWN': 'default'
    }
    return colorMap[status] || 'default'
  }

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application)
    setIsDetailModalVisible(true)
  }

  const handleWithdraw = (applicationId: string) => {
    Modal.confirm({
      title: '确认撤回申请',
      content: '撤回后将无法恢复，确定要撤回这个求职申请吗？',
      onOk: () => {
        message.success('申请已撤回')
      }
    })
  }

  const columns = [
    {
      title: '职位信息',
      key: 'jobInfo',
      render: (record: any) => (
        <div>
          <div className="font-medium text-lg">{record.jobTitle}</div>
          <div className="text-gray-600 text-sm mt-1">
            <Space>
              <span>{record.company}</span>
              <span>•</span>
              <Space>
                <EnvironmentOutlined />
                {record.location}
              </Space>
              <span>•</span>
              <Space>
                <DollarOutlined />
                {record.salary}
              </Space>
            </Space>
          </div>
        </div>
      )
    },
    {
      title: '申请状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      render: (time: string) => (
        <Space direction="vertical" size={0}>
          <span>{new Date(time).toLocaleDateString()}</span>
          <Text type="secondary" className="text-xs">
            {new Date(time).toLocaleTimeString()}
          </Text>
        </Space>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (time: string) => (
        <Space direction="vertical" size={0}>
          <span>{new Date(time).toLocaleDateString()}</span>
          <Text type="secondary" className="text-xs">
            {new Date(time).toLocaleTimeString()}
          </Text>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
          {record.status === 'PENDING' && (
            <Button 
              type="link" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleWithdraw(record.id)}
            >
              撤回申请
            </Button>
          )}
        </Space>
      )
    }
  ]

  // 统计数据
  const statistics = {
    total: jobApplications.length,
    pending: jobApplications.filter(app => app.status === 'PENDING').length,
    interview: jobApplications.filter(app => app.status === 'INTERVIEW_SCHEDULED').length,
    offer: jobApplications.filter(app => app.status === 'OFFER_RECEIVED').length,
    rejected: jobApplications.filter(app => app.status === 'REJECTED').length
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Title level={2}>
          <UserOutlined className="mr-2" />
          求职记录
        </Title>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <Statistic
            title="总申请数"
            value={statistics.total}
            suffix="个"
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
        <Card>
          <Statistic
            title="待处理"
            value={statistics.pending}
            suffix="个"
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
        <Card>
          <Statistic
            title="面试邀请"
            value={statistics.interview}
            suffix="个"
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
        <Card>
          <Statistic
            title="收到Offer"
            value={statistics.offer}
            suffix="个"
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
        <Card>
          <Statistic
            title="被拒绝"
            value={statistics.rejected}
            suffix="个"
            valueStyle={{ color: '#f5222d' }}
          />
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card className="mb-6">
        <Form form={searchForm} layout="inline">
          <Form.Item name="keyword">
            <Input 
              placeholder="搜索职位或公司" 
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="申请状态" style={{ width: 120 }}>
              <Option value="">全部状态</Option>
              <Option value="PENDING">待处理</Option>
              <Option value="INTERVIEW_SCHEDULED">面试安排</Option>
              <Option value="OFFER_RECEIVED">收到Offer</Option>
              <Option value="REJECTED">已拒绝</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange">
            <RangePicker placeholder={['开始日期', '结束日期']} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 申请列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={jobApplications}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="求职申请详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedApplication && (
          <Tabs defaultActiveKey="basic">
            <TabPane tab="基本信息" key="basic">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="职位名称" span={2}>
                  <Text strong className="text-lg">{selectedApplication.jobTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="公司名称">
                  {selectedApplication.company}
                </Descriptions.Item>
                <Descriptions.Item label="工作地点">
                  <Space>
                    <EnvironmentOutlined />
                    {selectedApplication.location}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="薪资范围">
                  <Space>
                    <DollarOutlined />
                    {selectedApplication.salary}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="工作经验">
                  {selectedApplication.workExperience}
                </Descriptions.Item>
                <Descriptions.Item label="学历要求">
                  {selectedApplication.education}
                </Descriptions.Item>
                <Descriptions.Item label="工作类型">
                  {selectedApplication.jobType === 'FULL_TIME' ? '全职' : '兼职'}
                </Descriptions.Item>
                <Descriptions.Item label="申请状态">
                  <Tag color={getStatusColor(selectedApplication.status)}>
                    {getStatusLabel(selectedApplication.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="申请时间">
                  <Space>
                    <CalendarOutlined />
                    {new Date(selectedApplication.applyTime).toLocaleString()}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="职位描述" span={2}>
                  {selectedApplication.description}
                </Descriptions.Item>
                <Descriptions.Item label="技能要求" span={2}>
                  <Space wrap>
                    {selectedApplication.requirements?.map((req: string) => (
                      <Tag key={req} color="blue">{req}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="福利待遇" span={2}>
                  <Space wrap>
                    {selectedApplication.benefits?.map((benefit: string) => (
                      <Tag key={benefit} color="green">{benefit}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </TabPane>

            {selectedApplication.status === 'INTERVIEW_SCHEDULED' && (
              <TabPane tab="面试信息" key="interview">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="面试时间">
                    <Space>
                      <CalendarOutlined />
                      {new Date(selectedApplication.interviewTime).toLocaleString()}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="面试地点">
                    <Space>
                      <EnvironmentOutlined />
                      {selectedApplication.interviewLocation}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="联系人">
                    {selectedApplication.contactPerson}
                  </Descriptions.Item>
                  <Descriptions.Item label="联系电话">
                    {selectedApplication.contactPhone}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
            )}

            {selectedApplication.status === 'OFFER_RECEIVED' && (
              <TabPane tab="Offer详情" key="offer">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="薪资待遇">
                    {selectedApplication.offerDetails?.salary}
                  </Descriptions.Item>
                  <Descriptions.Item label="年终奖">
                    {selectedApplication.offerDetails?.bonus}
                  </Descriptions.Item>
                  <Descriptions.Item label="股票期权">
                    {selectedApplication.offerDetails?.stockOptions}
                  </Descriptions.Item>
                  <Descriptions.Item label="入职时间">
                    {new Date(selectedApplication.offerDetails?.startDate).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
            )}

            {selectedApplication.status === 'REJECTED' && (
              <TabPane tab="拒绝原因" key="rejection">
                <Card>
                  <Text>{selectedApplication.rejectReason || '暂无拒绝原因说明'}</Text>
                </Card>
              </TabPane>
            )}
          </Tabs>
        )}
      </Modal>
    </div>
  )
}

export default JobApplications