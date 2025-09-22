import React, { useState, useEffect } from 'react'
import { Typography, Card, Collapse, Input, Row, Col, Tag, Button, Space, Spin } from 'antd'
import { SearchOutlined, QuestionCircleOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography
const { Panel } = Collapse
const { Search } = Input

interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
  order: number
  enabled: boolean
  views: number
}

const FAQ: React.FC = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/content/faqs')
      const data = await response.json()
      if (data.success) {
        setFaqs(data.data)
      }
    } catch (error) {
      console.error('获取FAQ失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFAQClick = async (faqId: string) => {
    try {
      await fetch(`/api/content/faqs/${faqId}/views`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('更新浏览量失败:', error)
    }
  }

  const categories = [
    { key: 'all', label: '全部', color: 'blue' },
    { key: 'account', label: '账户相关', color: 'green' },
    { key: 'park', label: '园区服务', color: 'orange' },
    { key: 'policy', label: '政策咨询', color: 'purple' },
    { key: 'project', label: '项目申报', color: 'red' },
    { key: 'payment', label: '费用相关', color: 'cyan' }
  ]

  const filteredFAQ = faqs.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = !searchText || 
      item.question.toLowerCase().includes(searchText.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchText.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
          <Title level={1}>常见问题</Title>
          <Paragraph className="text-lg text-gray-600">
            快速找到您关心的问题答案
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            {/* 搜索框 */}
            <Card className="mb-6">
              <Search
                placeholder="搜索问题关键词..."
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                onSearch={setSearchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Card>

            {/* 分类标签 */}
            <Card className="mb-6">
              <Space wrap>
                {categories.map(category => (
                  <Tag
                    key={category.key}
                    color={activeCategory === category.key ? category.color : 'default'}
                    style={{ cursor: 'pointer', padding: '4px 12px', fontSize: '14px' }}
                    onClick={() => setActiveCategory(category.key)}
                  >
                    {category.label}
                  </Tag>
                ))}
              </Space>
            </Card>

            {/* FAQ列表 */}
            <Card>
              <Collapse accordion>
                {filteredFAQ.map((faq) => (
                  <Panel 
                    header={
                      <div className="flex items-center">
                        <QuestionCircleOutlined className="mr-2 text-blue-500" />
                        <span>{faq.question}</span>
                        <Tag 
                          color={categories.find(c => c.key === faq.category)?.color} 
                          className="ml-auto"
                        >
                          {categories.find(c => c.key === faq.category)?.label}
                        </Tag>
                      </div>
                    } 
                    key={faq.id}
                    onClick={() => handleFAQClick(faq.id)}
                  >
                    <div>
                      <Paragraph className="text-gray-700 leading-relaxed mb-2">
                        {faq.answer}
                      </Paragraph>
                      <div className="text-xs text-gray-400 text-right">
                        浏览量: {faq.views}
                      </div>
                    </div>
                  </Panel>
                ))}
              </Collapse>
              
              {filteredFAQ.length === 0 && (
                <div className="text-center py-8">
                  <QuestionCircleOutlined className="text-4xl text-gray-400 mb-4" />
                  <Paragraph className="text-gray-500">
                    没有找到相关问题，请尝试其他关键词或联系客服
                  </Paragraph>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={6}>
            <Space direction="vertical" size="large" className="w-full">
              {/* 联系客服 */}
              <Card title="需要更多帮助？" size="small">
                <Space direction="vertical" className="w-full">
                  <Button 
                    type="primary" 
                    icon={<PhoneOutlined />}
                    onClick={() => navigate('/contact')}
                    block
                  >
                    联系客服
                  </Button>
                  <Button 
                    onClick={() => navigate('/feedback')}
                    block
                  >
                    意见反馈
                  </Button>
                  <Button 
                    onClick={() => navigate('/guide')}
                    block
                  >
                    使用指南
                  </Button>
                </Space>
              </Card>

              {/* 热门问题 */}
              <Card title="热门问题" size="small">
                <Space direction="vertical" className="w-full">
                  <Button 
                    type="link" 
                    className="text-left p-0 h-auto"
                    onClick={() => setSearchText('注册')}
                  >
                    如何注册账户？
                  </Button>
                  <Button 
                    type="link" 
                    className="text-left p-0 h-auto"
                    onClick={() => setSearchText('园区入驻')}
                  >
                    园区入驻条件？
                  </Button>
                  <Button 
                    type="link" 
                    className="text-left p-0 h-auto"
                    onClick={() => setSearchText('政策申请')}
                  >
                    政策申请流程？
                  </Button>
                  <Button 
                    type="link" 
                    className="text-left p-0 h-auto"
                    onClick={() => setSearchText('收费')}
                  >
                    服务收费标准？
                  </Button>
                </Space>
              </Card>

              {/* 联系信息 */}
              <Card title="联系方式" size="small">
                <Space direction="vertical" size="small">
                  <div><strong>客服热线：</strong>400-888-8888</div>
                  <div><strong>工作时间：</strong>9:00-18:00</div>
                  <div><strong>邮箱：</strong>support@xiaoyao.com</div>
                  <div><strong>QQ群：</strong>123456789</div>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default FAQ