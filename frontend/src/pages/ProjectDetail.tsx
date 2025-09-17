import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Space, 
  Button, 
  Descriptions,
  Spin,
  Alert,
  Divider,
  Progress,
  Timeline
} from 'antd'
import { 
  ArrowLeftOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useGetProjectByIdQuery } from '../services/api'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: projectResponse, isLoading, error } = useGetProjectByIdQuery(id!)
  const project = projectResponse?.data

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Alert
            message="项目信息加载失败"
            description="请检查网络连接或稍后重试"
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

  // 解析申报要求和项目优势
  let requirements = []
  let benefits = []
  try {
    requirements = project.requirements ? JSON.parse(project.requirements) : []
  } catch (e) {
    requirements = project.requirements ? project.requirements.split(',') : []
  }
  
  try {
    benefits = project.benefits ? JSON.parse(project.benefits) : []
  } catch (e) {
    benefits = project.benefits ? project.benefits.split(',') : []
  }

  // 计算申报进度
  const now = dayjs()
  const startDate = dayjs(project.applicationStart)
  const endDate = dayjs(project.applicationEnd)
  const totalDays = endDate.diff(startDate, 'day')
  const passedDays = now.diff(startDate, 'day')
  const progress = Math.max(0, Math.min(100, (passedDays / totalDays) * 100))
  
  const isApplicationOpen = now.isAfter(startDate) && now.isBefore(endDate)
  const isApplicationClosed = now.isAfter(endDate)

  const handleApply = () => {
    navigate(`/projects/${id}/apply`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/projects')}
            size="large"
          >
            返回项目列表
          </Button>
        </div>

        {/* 项目基本信息 */}
        <Card className="mb-6">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Space align="start" size="middle" wrap>
                    <Title level={2} className="mb-0">
                      {project.title}
                    </Title>
                    <Tag color="blue" className="text-base px-3 py-1">
                      {project.category}
                    </Tag>
                    <Tag color={project.status === 'PUBLISHED' ? 'green' : 'orange'} className="text-base px-3 py-1">
                      {project.status === 'PUBLISHED' ? '正在申报' : '暂停申报'}
                    </Tag>
                  </Space>
                </div>

                <Paragraph className="text-lg text-gray-700 leading-relaxed">
                  {project.description}
                </Paragraph>

                {/* 项目关键信息 */}
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <DollarOutlined className="text-2xl text-blue-600 mb-2" />
                      <div className="text-lg font-bold text-blue-600">
                        {project.funding ? `${(project.funding / 10000).toFixed(0)}万元` : '面议'}
                      </div>
                      <div className="text-sm text-gray-600">资助金额</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CalendarOutlined className="text-2xl text-green-600 mb-2" />
                      <div className="text-lg font-bold text-green-600">
                        {project.duration || 12}个月
                      </div>
                      <div className="text-sm text-gray-600">项目周期</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <TeamOutlined className="text-2xl text-orange-600 mb-2" />
                      <div className="text-lg font-bold text-orange-600">
                        {project.applicationCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">申报人数</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <FileTextOutlined className="text-2xl text-purple-600 mb-2" />
                      <div className="text-lg font-bold text-purple-600">
                        {project.viewCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">浏览次数</div>
                    </div>
                  </Col>
                </Row>
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              {/* 申报时间进度 */}
              <Card title="申报时间" size="small" className="mb-4">
                <Timeline
                  items={[
                    {
                      dot: <CheckCircleOutlined className="text-green-500" />,
                      children: (
                        <div>
                          <div className="font-medium">申报开始</div>
                          <div className="text-sm text-gray-500">
                            {dayjs(project.applicationStart).format('YYYY-MM-DD')}
                          </div>
                        </div>
                      ),
                    },
                    {
                      dot: isApplicationClosed ? 
                        <CheckCircleOutlined className="text-red-500" /> : 
                        <ClockCircleOutlined className="text-blue-500" />,
                      children: (
                        <div>
                          <div className="font-medium">申报截止</div>
                          <div className="text-sm text-gray-500">
                            {dayjs(project.applicationEnd).format('YYYY-MM-DD')}
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>申报进度</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    percent={progress} 
                    status={isApplicationClosed ? 'exception' : 'active'}
                    strokeColor={isApplicationClosed ? '#ff4d4f' : '#1890ff'}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {isApplicationClosed ? '申报已截止' : 
                     isApplicationOpen ? '申报进行中' : '申报未开始'}
                  </div>
                </div>
              </Card>

              {/* 申报按钮 */}
              <Button 
                type="primary" 
                size="large" 
                block
                disabled={!isApplicationOpen}
                onClick={handleApply}
                className="mb-4"
              >
                {isApplicationClosed ? '申报已截止' : 
                 isApplicationOpen ? '立即申报' : '申报未开始'}
              </Button>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* 申报要求 */}
          <Col xs={24} lg={12}>
            <Card title="申报要求" className="h-full">
              {requirements.length > 0 ? (
                <ul className="space-y-2">
                  {requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{req.trim()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary">暂无具体要求</Text>
              )}
            </Card>
          </Col>

          {/* 项目优势 */}
          <Col xs={24} lg={12}>
            <Card title="项目优势" className="h-full">
              {benefits.length > 0 ? (
                <ul className="space-y-2">
                  {benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{benefit.trim()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary">暂无项目优势信息</Text>
              )}
            </Card>
          </Col>

          {/* 联系方式 */}
          <Col xs={24}>
            <Card title="联系方式">
              <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
                {project.contactPerson && (
                  <Descriptions.Item label={<><TeamOutlined /> 联系人</>}>
                    {project.contactPerson}
                  </Descriptions.Item>
                )}
                {project.contactPhone && (
                  <Descriptions.Item label={<><PhoneOutlined /> 联系电话</>}>
                    <a href={`tel:${project.contactPhone}`}>{project.contactPhone}</a>
                  </Descriptions.Item>
                )}
                {project.contactEmail && (
                  <Descriptions.Item label={<><MailOutlined /> 邮箱地址</>}>
                    <a href={`mailto:${project.contactEmail}`}>{project.contactEmail}</a>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ProjectDetail