import React, { useState, useEffect } from 'react'
import { Typography, Card, Steps, Collapse, Row, Col, Button, Space, Spin } from 'antd'
import { 
  UserOutlined, 
  SearchOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  QuestionCircleOutlined,
  PhoneOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

interface GuideItem {
  id: string
  category: string
  title: string
  content: string
  steps?: string
  order: number
  enabled: boolean
}

const Guide: React.FC = () => {
  const navigate = useNavigate()
  const [guides, setGuides] = useState<GuideItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/content/guides')
      const data = await response.json()
      if (data.success) {
        setGuides(data.data)
      }
    } catch (error) {
      console.error('获取使用指南失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: '注册账号',
      description: '创建您的个人账户，完善基本信息',
      icon: <UserOutlined />
    },
    {
      title: '浏览服务',
      description: '查看园区、政策、项目等各类服务信息',
      icon: <SearchOutlined />
    },
    {
      title: '提交申请',
      description: '根据需求提交相关申请或咨询',
      icon: <FileTextOutlined />
    },
    {
      title: '获得服务',
      description: '享受专业的人才服务支持',
      icon: <CheckCircleOutlined />
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <Title level={1}>使用指南</Title>
          <Paragraph className="text-lg text-gray-600">
            详细的平台使用说明，帮助您快速上手各项服务
          </Paragraph>
        </div>

        {/* 快速开始步骤 */}
        <Card className="mb-8">
          <Title level={2} className="text-center mb-6">快速开始</Title>
          <Steps
            current={-1}
            items={steps}
            className="mb-6"
          />
          <div className="text-center">
            <Space>
              <Button type="primary" size="large" onClick={() => navigate('/register')}>
                立即注册
              </Button>
              <Button size="large" onClick={() => navigate('/login')}>
                已有账号？登录
              </Button>
            </Space>
          </div>
        </Card>

        {/* 详细指南 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="详细使用指南">
              <Collapse accordion>
                {guides.map((guide) => (
                  <Panel header={guide.title} key={guide.id}>
                    <div className="space-y-4">
                      <Paragraph className="mb-4">
                        {guide.content}
                      </Paragraph>
                      {guide.steps && (
                        <div>
                          <Text strong>操作步骤：</Text>
                          <div className="mt-2 space-y-2">
                            {JSON.parse(guide.steps).map((step: string, stepIndex: number) => (
                              <Paragraph key={stepIndex} className="mb-2 ml-4">
                                {stepIndex + 1}. {step}
                              </Paragraph>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" className="w-full">
              {/* 快捷操作 */}
              <Card title="快捷操作" size="small">
                <Space direction="vertical" className="w-full">
                  <Button 
                    type="link" 
                    icon={<QuestionCircleOutlined />}
                    onClick={() => navigate('/faq')}
                    className="text-left p-0"
                  >
                    查看常见问题
                  </Button>
                  <Button 
                    type="link" 
                    icon={<PhoneOutlined />}
                    onClick={() => navigate('/contact')}
                    className="text-left p-0"
                  >
                    联系客服
                  </Button>
                  <Button 
                    type="link" 
                    onClick={() => navigate('/feedback')}
                    className="text-left p-0"
                  >
                    意见反馈
                  </Button>
                </Space>
              </Card>

              {/* 联系信息 */}
              <Card title="需要帮助？" size="small">
                <Space direction="vertical" size="small">
                  <Text><strong>客服热线：</strong>400-888-8888</Text>
                  <Text><strong>工作时间：</strong>周一至周五 9:00-18:00</Text>
                  <Text><strong>邮箱：</strong>support@xiaoyao.com</Text>
                </Space>
              </Card>

              {/* 下载中心 */}
              <Card title="资料下载" size="small">
                <Space direction="vertical" className="w-full">
                  <Button type="link" className="text-left p-0">
                    平台使用手册.pdf
                  </Button>
                  <Button type="link" className="text-left p-0">
                    入驻申请表.doc
                  </Button>
                  <Button type="link" className="text-left p-0">
                    政策申报指南.pdf
                  </Button>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Guide