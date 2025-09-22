import React from 'react'
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Progress,
  Table,
  Tag,
  Space,
  Button,
  Avatar,
  List,
  Timeline,
  Spin,
  Alert
} from 'antd'
import { 
  UserOutlined,
  ProjectOutlined,
  FileTextOutlined,
  BankOutlined,
  TrophyOutlined,
  RiseOutlined,
  EyeOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useGetDashboardStatsQuery } from '../../store/api/adminApi'

const { Title, Text } = Typography

const AdminDashboard: React.FC = () => {
  // 获取仪表盘统计数据
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description="无法获取仪表盘数据，请稍后重试"
        type="error"
        showIcon
      />
    )
  }

  // 模拟待审核申报 - 这里可以后续替换为真实API数据
  const pendingApplications = [
    {
      id: '1',
      applicantName: '张三',
      projectTitle: 'AI智能客服系统',
      submitTime: '2024-01-15 14:30',
      status: 'PENDING'
    },
    {
      id: '2',
      applicantName: '李四',
      projectTitle: '绿色能源储存解决方案',
      submitTime: '2024-01-15 10:20',
      status: 'PENDING'
    },
    {
      id: '3',
      applicantName: '王五',
      projectTitle: '智慧农业物联网平台',
      submitTime: '2024-01-14 16:45',
      status: 'PENDING'
    }
  ]

  // 模拟最新用户
  const recentUsers = [
    {
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      registerTime: '2024-01-15 14:30',
      avatar: null
    },
    {
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      registerTime: '2024-01-15 10:20',
      avatar: null
    },
    {
      id: '3',
      name: '王五',
      email: 'wangwu@example.com',
      registerTime: '2024-01-14 16:45',
      avatar: null
    }
  ]

  // 模拟系统活动
  const systemActivities = [
    {
      time: '2024-01-15 14:30',
      content: '用户"张三"提交了项目申报',
      type: 'application'
    },
    {
      time: '2024-01-15 10:20',
      content: '管理员审核通过了"绿色能源项目"',
      type: 'approval'
    },
    {
      time: '2024-01-14 16:45',
      content: '新增政策"人才引进实施办法"',
      type: 'policy'
    },
    {
      time: '2024-01-14 14:20',
      content: '用户"李四"注册成功',
      type: 'register'
    }
  ]

  const applicationColumns = [
    {
      title: '申请人',
      dataIndex: 'applicantName',
      key: 'applicantName'
    },
    {
      title: '项目名称',
      dataIndex: 'projectTitle',
      key: 'projectTitle',
      render: (title: string) => (
        <Button type="link" className="p-0 h-auto">
          {title}
        </Button>
      )
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="processing">待审核</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small">
            审核
          </Button>
          <Button size="small">
            查看
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>管理后台</Title>
        <Text type="secondary">欢迎回来，管理员</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="项目总数"
              value={stats?.totalProjects || 0}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="政策总数"
              value={stats?.totalPolicies || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="园区总数"
              value={stats?.totalParks || 0}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 申报统计 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核申报"
              value={stats?.pendingApplications || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已通过申报"
              value={stats?.approvedApplications || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={stats?.totalViews || 0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={stats?.activeUsers || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 待审核申报 */}
        <Col xs={24} lg={12}>
          <Card 
            title="待审核申报" 
            extra={<Button type="link">查看全部</Button>}
            className="h-full"
          >
            <Table
              columns={applicationColumns}
              dataSource={pendingApplications}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 最新用户 */}
        <Col xs={24} lg={12}>
          <Card 
            title="最新用户" 
            extra={<Button type="link">查看全部</Button>}
            className="h-full"
          >
            <List
              itemLayout="horizontal"
              dataSource={recentUsers}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={user.name}
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">{user.email}</Text>
                        <Text type="secondary" className="text-xs">
                          注册时间: {user.registerTime}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 系统活动 */}
        <Col xs={24}>
          <Card title="系统活动">
            <Timeline
              items={systemActivities.map((activity, index) => ({
                children: (
                  <div>
                    <Text>{activity.content}</Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      {activity.time}
                    </Text>
                  </div>
                ),
                color: activity.type === 'approval' ? 'green' : 
                       activity.type === 'application' ? 'blue' : 'gray'
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard