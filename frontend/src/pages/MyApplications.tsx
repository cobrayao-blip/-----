import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Tabs, 
  Empty,
  Tooltip,
  Modal,
  Descriptions,
  Timeline,
  Progress
} from 'antd'
import { 
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useGetUserApplicationsQuery } from '../services/api'

const { Title, Text } = Typography
const { TabPane } = Tabs

const MyApplications: React.FC = () => {
  const navigate = useNavigate()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  
  const { data: applicationsResponse, isLoading } = useGetUserApplicationsQuery()
  const applications = applicationsResponse?.data || { projectApplications: [], jobApplications: [] }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'PENDING': 'processing',
      'APPROVED': 'success',
      'REJECTED': 'error',
      'WITHDRAWN': 'default'
    }
    return colorMap[status] || 'default'
  }

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      'PENDING': '待审核',
      'APPROVED': '已通过',
      'REJECTED': '已拒绝',
      'WITHDRAWN': '已撤回'
    }
    return textMap[status] || status
  }

  const getProgressPercent = (status: string) => {
    const percentMap: Record<string, number> = {
      'PENDING': 30,
      'APPROVED': 100,
      'REJECTED': 100,
      'WITHDRAWN': 0
    }
    return percentMap[status] || 0
  }

  const projectColumns = [
    {
      title: '申报编号',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Text code>{id.slice(-8).toUpperCase()}</Text>
      )
    },
    {
      title: '项目名称',
      dataIndex: ['project', 'title'],
      key: 'projectTitle',
      render: (title: string, record: any) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/projects/${record.project.id}`)}
          className="p-0 h-auto"
        >
          {title}
        </Button>
      )
    },
    {
      title: '申报时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '进度',
      dataIndex: 'status',
      key: 'progress',
      render: (status: string) => (
        <Progress 
          percent={getProgressPercent(status)} 
          size="small"
          status={status === 'REJECTED' ? 'exception' : 'active'}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedApplication(record)
                setIsModalVisible(true)
              }}
            />
          </Tooltip>
          {record.status === 'PENDING' && (
            <Button type="text" danger size="small">
              撤回申报
            </Button>
          )}
        </Space>
      )
    }
  ]

  const jobColumns = [
    {
      title: '申报编号',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Text code>{id.slice(-8).toUpperCase()}</Text>
      )
    },
    {
      title: '职位名称',
      dataIndex: ['job', 'title'],
      key: 'jobTitle',
      render: (title: string, record: any) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/jobs/${record.job.id}`)}
          className="p-0 h-auto"
        >
          {title}
        </Button>
      )
    },
    {
      title: '公司名称',
      dataIndex: ['job', 'company'],
      key: 'company'
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedApplication(record)
                setIsModalVisible(true)
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const renderApplicationDetail = () => {
    if (!selectedApplication) return null

    const isProjectApplication = !!selectedApplication.project
    const target = isProjectApplication ? selectedApplication.project : selectedApplication.job

    return (
      <div>
        <Descriptions title="申报信息" column={2} className="mb-6">
          <Descriptions.Item label="申报编号">
            {selectedApplication.id.slice(-8).toUpperCase()}
          </Descriptions.Item>
          <Descriptions.Item label="申报时间">
            {new Date(selectedApplication.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={isProjectApplication ? "项目名称" : "职位名称"}>
            {target.title}
          </Descriptions.Item>
          <Descriptions.Item label="当前状态">
            <Tag color={getStatusColor(selectedApplication.status)}>
              {getStatusText(selectedApplication.status)}
            </Tag>
          </Descriptions.Item>
          {selectedApplication.reviewNote && (
            <Descriptions.Item label="审核意见" span={2}>
              {selectedApplication.reviewNote}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Card title="审核进度" size="small" className="mb-6">
          <Timeline
            items={[
              {
                color: 'green',
                dot: <CheckCircleOutlined className="text-green-500" />,
                children: (
                  <div>
                    <div className="font-medium">申报提交</div>
                    <div className="text-sm text-gray-500">
                      {new Date(selectedApplication.createdAt).toLocaleString()}
                    </div>
                  </div>
                ),
              },
              {
                color: selectedApplication.status === 'PENDING' ? 'blue' : 'green',
                dot: selectedApplication.status === 'PENDING' ? 
                  <ClockCircleOutlined className="text-blue-500" /> : 
                  <CheckCircleOutlined className="text-green-500" />,
                children: (
                  <div>
                    <div className="font-medium">材料审核</div>
                    <div className="text-sm text-gray-500">
                      {selectedApplication.status === 'PENDING' ? '审核中...' : '已完成'}
                    </div>
                  </div>
                ),
              },
              {
                color: selectedApplication.status === 'APPROVED' ? 'green' : 
                       selectedApplication.status === 'REJECTED' ? 'red' : 'gray',
                dot: selectedApplication.status === 'APPROVED' ? 
                  <CheckCircleOutlined className="text-green-500" /> :
                  selectedApplication.status === 'REJECTED' ?
                  <CloseCircleOutlined className="text-red-500" /> :
                  <ExclamationCircleOutlined className="text-gray-400" />,
                children: (
                  <div>
                    <div className="font-medium">审核结果</div>
                    <div className="text-sm text-gray-500">
                      {selectedApplication.reviewedAt ? 
                        new Date(selectedApplication.reviewedAt).toLocaleString() : 
                        '待完成'}
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        {isProjectApplication && (
          <Card title="项目信息" size="small">
            <Descriptions column={1}>
              <Descriptions.Item label="项目描述">
                {target.description}
              </Descriptions.Item>
              <Descriptions.Item label="资助金额">
                {target.funding ? `${(target.funding / 10000).toFixed(0)}万元` : '面议'}
              </Descriptions.Item>
              <Descriptions.Item label="项目周期">
                {target.duration || 12}个月
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {!isProjectApplication && (
          <Card title="职位信息" size="small">
            <Descriptions column={1}>
              <Descriptions.Item label="公司名称">
                {target.company}
              </Descriptions.Item>
              <Descriptions.Item label="工作地点">
                {target.location}
              </Descriptions.Item>
              <Descriptions.Item label="薪资待遇">
                {target.salary || '面议'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Title level={2}>我的申报</Title>
          <Text type="secondary">查看您的项目申报和职位申请记录</Text>
        </div>

        <Card>
          <Tabs defaultActiveKey="projects">
            <TabPane 
              tab={`项目申报 (${applications.projectApplications?.length || 0})`} 
              key="projects"
            >
              {applications.projectApplications?.length > 0 ? (
                <Table
                  columns={projectColumns}
                  dataSource={applications.projectApplications}
                  rowKey="id"
                  loading={isLoading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }}
                />
              ) : (
                <Empty 
                  description="暂无项目申报记录"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={() => navigate('/projects')}>
                    浏览项目
                  </Button>
                </Empty>
              )}
            </TabPane>

            <TabPane 
              tab={`职位申请 (${applications.jobApplications?.length || 0})`} 
              key="jobs"
            >
              {applications.jobApplications?.length > 0 ? (
                <Table
                  columns={jobColumns}
                  dataSource={applications.jobApplications}
                  rowKey="id"
                  loading={isLoading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }}
                />
              ) : (
                <Empty 
                  description="暂无职位申请记录"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={() => navigate('/jobs')}>
                    浏览职位
                  </Button>
                </Empty>
              )}
            </TabPane>
          </Tabs>
        </Card>

        {/* 申报详情模态框 */}
        <Modal
          title="申报详情"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              关闭
            </Button>
          ]}
          width={800}
        >
          {renderApplicationDetail()}
        </Modal>
      </div>
    </div>
  )
}

export default MyApplications