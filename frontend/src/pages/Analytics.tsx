import React, { useState } from 'react'
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Select,
  DatePicker,
  Table,
  Progress,
  Tag,
  Space,
  Button,
  Tabs,
  List,
  Avatar
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
  ClockCircleOutlined,
  DownloadOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { Line, Column, Pie, Area } from '@ant-design/plots'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const { TabPane } = Tabs

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('month')
  const [selectedMetric, setSelectedMetric] = useState<string>('overview')

  // 模拟统计数据
  const overviewStats = {
    totalUsers: 1248,
    totalProjects: 156,
    totalPolicies: 89,
    totalParks: 45,
    pendingApplications: 23,
    approvedApplications: 187,
    totalViews: 45678,
    activeUsers: 892,
    growthRate: 15.6,
    conversionRate: 12.8
  }

  // 模拟趋势数据
  const trendData = [
    { date: '2024-01-01', users: 100, applications: 15, views: 1200 },
    { date: '2024-01-02', users: 120, applications: 18, views: 1350 },
    { date: '2024-01-03', users: 135, applications: 22, views: 1480 },
    { date: '2024-01-04', users: 148, applications: 25, views: 1620 },
    { date: '2024-01-05', users: 162, applications: 28, views: 1750 },
    { date: '2024-01-06', users: 178, applications: 32, views: 1890 },
    { date: '2024-01-07', users: 195, applications: 35, views: 2020 }
  ]

  // 模拟分类统计
  const categoryStats = [
    { category: '人工智能', count: 45, percentage: 28.8 },
    { category: '生物医药', count: 38, percentage: 24.4 },
    { category: '新能源', count: 32, percentage: 20.5 },
    { category: '新材料', count: 25, percentage: 16.0 },
    { category: '其他', count: 16, percentage: 10.3 }
  ]

  // 模拟热门内容
  const popularContent = [
    {
      id: '1',
      title: '高新技术产业园区',
      type: 'PARK',
      views: 2580,
      applications: 45,
      rating: 4.8
    },
    {
      id: '2',
      title: 'AI智能制造扶持项目',
      type: 'PROJECT',
      views: 2340,
      applications: 38,
      rating: 4.6
    },
    {
      id: '3',
      title: '人才引进实施办法',
      type: 'POLICY',
      views: 2120,
      applications: 32,
      rating: 4.7
    }
  ]

  // 模拟用户活跃度
  const userActivityData = [
    { time: '00:00', count: 12 },
    { time: '02:00', count: 8 },
    { time: '04:00', count: 5 },
    { time: '06:00', count: 15 },
    { time: '08:00', count: 45 },
    { time: '10:00', count: 78 },
    { time: '12:00', count: 65 },
    { time: '14:00', count: 85 },
    { time: '16:00', count: 92 },
    { time: '18:00', count: 68 },
    { time: '20:00', count: 55 },
    { time: '22:00', count: 32 }
  ]

  // 图表配置
  const lineConfig = {
    data: trendData,
    xField: 'date',
    yField: 'users',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 3,
      shape: 'circle'
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '用户数',
        value: datum.users
      })
    }
  }

  const columnConfig = {
    data: categoryStats,
    xField: 'category',
    yField: 'count',
    color: '#52c41a',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
      style: {
        fill: '#000',
        opacity: 0.6
      }
    }
  }

  const pieConfig = {
    data: categoryStats,
    angleField: 'percentage',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name}: {percentage}%'
    },
    interactions: [{ type: 'element-active' }]
  }

  const areaConfig = {
    data: userActivityData,
    xField: 'time',
    yField: 'count',
    smooth: true,
    color: '#722ed1',
    areaStyle: {
      fillOpacity: 0.3
    }
  }

  const contentColumns = [
    {
      title: '内容标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: any) => (
        <Space>
          {record.type === 'PARK' && <BankOutlined />}
          {record.type === 'PROJECT' && <ProjectOutlined />}
          {record.type === 'POLICY' && <FileTextOutlined />}
          <Text strong>{title}</Text>
        </Space>
      )
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => (
        <Space>
          <EyeOutlined />
          <Text>{views.toLocaleString()}</Text>
        </Space>
      )
    },
    {
      title: '申报数',
      dataIndex: 'applications',
      key: 'applications',
      render: (applications: number) => (
        <Space>
          <FileTextOutlined />
          <Text>{applications}</Text>
        </Space>
      )
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Space>
          <TrophyOutlined />
          <Text>{rating}</Text>
        </Space>
      )
    }
  ]

  const handleExportData = () => {
    // 模拟导出功能
    console.log('导出数据')
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Title level={2}>数据分析</Title>
          <Space>
            <Select
              value={dateRange}
              onChange={setDateRange}
              style={{ width: 120 }}
            >
              <Option value="week">近一周</Option>
              <Option value="month">近一月</Option>
              <Option value="quarter">近三月</Option>
              <Option value="year">近一年</Option>
            </Select>
            <RangePicker />
            <Button icon={<DownloadOutlined />} onClick={handleExportData}>
              导出数据
            </Button>
          </Space>
        </div>
      </div>

      <Tabs defaultActiveKey="overview">
        {/* 概览统计 */}
        <TabPane 
          tab={
            <Space>
              <BarChartOutlined />
              概览统计
            </Space>
          } 
          key="overview"
        >
          {/* 核心指标卡片 */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总用户数"
                  value={overviewStats.totalUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                  suffix={
                    <Space>
                      <RiseOutlined />
                      <Text className="text-sm text-green-600">+{overviewStats.growthRate}%</Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="项目总数"
                  value={overviewStats.totalProjects}
                  prefix={<ProjectOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="政策总数"
                  value={overviewStats.totalPolicies}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="园区总数"
                  value={overviewStats.totalParks}
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
                  value={overviewStats.pendingApplications}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="已通过申报"
                  value={overviewStats.approvedApplications}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总浏览量"
                  value={overviewStats.totalViews}
                  prefix={<EyeOutlined />}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="转化率"
                  value={overviewStats.conversionRate}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 趋势图表 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="用户增长趋势">
                <Line {...lineConfig} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="分类统计">
                <Column {...columnConfig} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 用户分析 */}
        <TabPane 
          tab={
            <Space>
              <UserOutlined />
              用户分析
            </Space>
          } 
          key="users"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="用户活跃度分布">
                <Area {...areaConfig} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="用户类型分布">
                <Pie {...pieConfig} />
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="用户地域分布">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Text strong>北京市</Text>
                    <Progress percent={35} size="small" />
                    <Text type="secondary">437人</Text>
                  </div>
                  <div className="text-center">
                    <Text strong>上海市</Text>
                    <Progress percent={28} size="small" />
                    <Text type="secondary">349人</Text>
                  </div>
                  <div className="text-center">
                    <Text strong>深圳市</Text>
                    <Progress percent={22} size="small" />
                    <Text type="secondary">275人</Text>
                  </div>
                  <div className="text-center">
                    <Text strong>其他</Text>
                    <Progress percent={15} size="small" />
                    <Text type="secondary">187人</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 内容分析 */}
        <TabPane 
          tab={
            <Space>
              <FileTextOutlined />
              内容分析
            </Space>
          } 
          key="content"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="热门内容排行">
                <Table
                  columns={contentColumns}
                  dataSource={popularContent}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="内容类型分布">
                <List
                  dataSource={[
                    { type: '园区', count: 45, color: '#1890ff' },
                    { type: '政策', count: 89, color: '#52c41a' },
                    { type: '项目', count: 156, color: '#722ed1' },
                    { type: '职位', count: 234, color: '#fa8c16' }
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <div className="flex justify-between items-center w-full">
                        <Space>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <Text>{item.type}</Text>
                        </Space>
                        <Text strong>{item.count}</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="内容发布趋势">
                <div className="space-y-4">
                  {['本周', '上周', '上月'].map((period, index) => (
                    <div key={period} className="flex justify-between items-center">
                      <Text>{period}</Text>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          percent={[85, 72, 68][index]} 
                          size="small" 
                          style={{ width: 100 }}
                        />
                        <Text strong>{[34, 28, 25][index]}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Analytics