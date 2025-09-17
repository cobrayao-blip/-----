import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Space, 
  Pagination,
  Empty,
  Spin,
  Progress,
  Avatar,
  Tooltip
} from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  StarOutlined,
  TrophyOutlined,
  RocketOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useGetProjectsQuery } from '../services/api'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select

const Projects: React.FC = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedStage, setSelectedStage] = useState<string>('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 6

  // 使用API获取项目数据
  const { data: projectsResponse, isLoading } = useGetProjectsQuery({
    search: searchText,
    category: selectedCategory,
    stage: selectedStage,
    industry: selectedIndustry
  })

  const projects = projectsResponse?.data || []
  
  // 过滤项目数据
  const filteredProjects = projects

  const startIndex = (currentPage - 1) * pageSize
  const currentProjects = filteredProjects.slice(startIndex, startIndex + pageSize)

  const handleSearch = (value: string) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }

  // 计算申报进度
  const getApplicationProgress = (project: any) => {
    const now = dayjs()
    const startDate = dayjs(project.applicationStart)
    const endDate = dayjs(project.applicationEnd)
    
    if (!startDate.isValid() || !endDate.isValid()) return 0
    
    const totalDays = endDate.diff(startDate, 'day')
    const passedDays = now.diff(startDate, 'day')
    return Math.max(0, Math.min(100, (passedDays / totalDays) * 100))
  }

  const getApplicationStatus = (project: any) => {
    const now = dayjs()
    const startDate = dayjs(project.applicationStart)
    const endDate = dayjs(project.applicationEnd)
    
    if (now.isBefore(startDate)) return { text: '未开始', color: 'default' }
    if (now.isAfter(endDate)) return { text: '已截止', color: 'red' }
    return { text: '申报中', color: 'green' }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <Title level={2}>创业扶持项目</Title>
          <Paragraph className="text-gray-600 text-lg">
            发现优质创业扶持项目，获得资金支持和政策扶持
          </Paragraph>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索项目名称或描述"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="项目类别"
                allowClear
                size="large"
                className="w-full"
                value={selectedCategory}
                onChange={(value) => {
                  setSelectedCategory(value)
                  handleFilterChange()
                }}
              >
                <Option value="AI">人工智能</Option>
                <Option value="ENERGY">新能源</Option>
                <Option value="BIOTECH">生物技术</Option>
                <Option value="FINTECH">金融科技</Option>
                <Option value="EDUCATION">教育科技</Option>
                <Option value="HEALTHCARE">医疗健康</Option>
              </Select>
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="申报状态"
                allowClear
                size="large"
                className="w-full"
                value={selectedStage}
                onChange={(value) => {
                  setSelectedStage(value)
                  handleFilterChange()
                }}
              >
                <Option value="OPEN">申报中</Option>
                <Option value="CLOSED">已截止</Option>
                <Option value="UPCOMING">即将开始</Option>
              </Select>
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Button 
                size="large" 
                onClick={() => {
                  setSearchText('')
                  setSelectedCategory('')
                  setSelectedStage('')
                  setSelectedIndustry('')
                  setCurrentPage(1)
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 项目列表 */}
        <Spin spinning={isLoading}>
          {currentProjects.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {currentProjects.map((project) => {
                  const progress = getApplicationProgress(project)
                  const status = getApplicationStatus(project)
                  
                  return (
                    <Col xs={24} md={12} lg={8} key={project.id}>
                      <Card
                        hoverable
                        className="h-full"
                        cover={
                          <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center relative">
                            <div className="text-center text-white">
                              <RocketOutlined className="text-4xl mb-2" />
                              <div className="text-lg font-semibold">{project.title}</div>
                            </div>
                            <Tag 
                              color={status.color} 
                              className="absolute top-4 right-4"
                            >
                              {status.text}
                            </Tag>
                          </div>
                        }
                        actions={[
                          <Tooltip title="查看详情" key="view">
                            <EyeOutlined onClick={() => handleViewProject(project.id)} />
                          </Tooltip>,
                          <Tooltip title="收藏项目" key="favorite">
                            <HeartOutlined />
                          </Tooltip>,
                          <Tooltip title="分享项目" key="share">
                            <ShareAltOutlined />
                          </Tooltip>,
                        ]}
                      >
                        <Card.Meta
                          title={
                            <Space direction="vertical" size="small" className="w-full">
                              <div className="flex justify-between items-start">
                                <Text strong className="text-lg">
                                  {project.title}
                                </Text>
                                <Tag color="blue">
                                  {project.category}
                                </Tag>
                              </div>
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size="small" className="w-full">
                              <Paragraph 
                                ellipsis={{ rows: 3 }} 
                                className="text-gray-600 mb-3"
                              >
                                {project.description}
                              </Paragraph>
                              
                              {/* 项目关键信息 */}
                              <Row gutter={[8, 8]} className="mb-3">
                                <Col span={12}>
                                  <div className="text-center p-2 bg-blue-50 rounded">
                                    <DollarOutlined className="text-blue-600 mb-1" />
                                    <div className="text-sm font-bold text-blue-600">
                                      {project.funding ? `${(project.funding / 10000).toFixed(0)}万` : '面议'}
                                    </div>
                                    <div className="text-xs text-gray-500">资助金额</div>
                                  </div>
                                </Col>
                                <Col span={12}>
                                  <div className="text-center p-2 bg-green-50 rounded">
                                    <CalendarOutlined className="text-green-600 mb-1" />
                                    <div className="text-sm font-bold text-green-600">
                                      {project.duration || 12}个月
                                    </div>
                                    <div className="text-xs text-gray-500">项目周期</div>
                                  </div>
                                </Col>
                              </Row>

                              {/* 联系人信息 */}
                              <div className="flex items-center space-x-2 py-2 border-t">
                                <Avatar size="small" icon={<TeamOutlined />} />
                                <div>
                                  <Text strong className="text-sm">{project.contactPerson || '项目负责人'}</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    {project.contactPhone || '联系方式'}
                                  </Text>
                                </div>
                              </div>
                              
                              {/* 申报进度 */}
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>申报进度</span>
                                  <span>{progress.toFixed(0)}%</span>
                                </div>
                                <Progress 
                                  percent={progress} 
                                  size="small"
                                  status={status.color === 'red' ? 'exception' : 'active'}
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>
                                    开始: {dayjs(project.applicationStart).format('MM-DD')}
                                  </span>
                                  <span>
                                    截止: {dayjs(project.applicationEnd).format('MM-DD')}
                                  </span>
                                </div>
                              </div>
                              
                              {/* 统计信息 */}
                              <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                                <span>
                                  <EyeOutlined /> {project.viewCount || 0} 浏览
                                </span>
                                <span>
                                  <TeamOutlined /> {project.applicationCount || 0} 申报
                                </span>
                              </div>
                            </Space>
                          }
                        />
                        
                        <Button 
                          type="primary" 
                          block 
                          className="mt-4"
                          onClick={() => handleViewProject(project.id)}
                        >
                          查看详情
                        </Button>
                      </Card>
                    </Col>
                  )
                })}
              </Row>

              {/* 分页 */}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={filteredProjects.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Empty
                description="暂无符合条件的项目"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => {
                  setSearchText('')
                  setSelectedCategory('')
                  setSelectedStage('')
                  setSelectedIndustry('')
                  setCurrentPage(1)
                }}>
                  重置筛选条件
                </Button>
              </Empty>
            </div>
          )}
        </Spin>
      </div>
    </div>
  )
}

export default Projects