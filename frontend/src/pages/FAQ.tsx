import React, { useState } from 'react'
import { Typography, Card, Collapse, Input, Row, Col, Tag, Button, Space } from 'antd'
import { SearchOutlined, QuestionCircleOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography
const { Panel } = Collapse
const { Search } = Input

const FAQ: React.FC = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { key: 'all', label: '全部', color: 'blue' },
    { key: 'account', label: '账户相关', color: 'green' },
    { key: 'park', label: '园区服务', color: 'orange' },
    { key: 'policy', label: '政策咨询', color: 'purple' },
    { key: 'project', label: '项目申报', color: 'red' },
    { key: 'payment', label: '费用相关', color: 'cyan' }
  ]

  const faqData = [
    {
      category: 'account',
      question: '如何注册逍遥人才网账户？',
      answer: '您可以点击页面右上角的"立即注册"按钮，填写手机号码获取验证码，设置密码后完善个人信息即可完成注册。注册过程简单快捷，通常只需要3-5分钟。'
    },
    {
      category: 'account',
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入注册时的手机号码，系统会发送验证码到您的手机，验证成功后可以重新设置密码。'
    },
    {
      category: 'account',
      question: '如何修改个人信息？',
      answer: '登录后进入"个人中心"，点击"编辑资料"即可修改姓名、联系方式、工作经历等个人信息。修改后需要重新审核，通常1-2个工作日完成。'
    },
    {
      category: 'park',
      question: '如何申请入驻园区？',
      answer: '浏览园区列表，选择合适的园区后点击"申请入驻"，填写企业基本信息、业务范围、预期入驻时间等，上传相关资质文件后提交申请。园区方会在5个工作日内回复。'
    },
    {
      category: 'park',
      question: '园区入驻有什么条件？',
      answer: '不同园区的入驻条件不同，一般要求：1）企业注册资本达到一定标准；2）符合园区产业定位；3）具备相应的技术实力或市场前景；4）无不良信用记录。具体条件请查看各园区详情页面。'
    },
    {
      category: 'park',
      question: '园区服务费用如何收取？',
      answer: '园区服务费用包括：租金、物业费、服务费等。具体标准因园区而异，部分园区对初创企业有优惠政策。详细费用信息请咨询具体园区或联系我们的客服。'
    },
    {
      category: 'policy',
      question: '如何查询最新的人才政策？',
      answer: '进入"政策咨询"页面，可以按地区、政策类型、发布时间等条件筛选查看最新政策。我们会及时更新各地的人才引进、创业扶持、税收优惠等政策信息。'
    },
    {
      category: 'policy',
      question: '政策申请需要什么材料？',
      answer: '不同政策需要的材料不同，一般包括：身份证明、学历证明、工作证明、企业营业执照、项目计划书等。具体材料清单请查看各政策的详细说明。'
    },
    {
      category: 'policy',
      question: '政策申请多久能有结果？',
      answer: '政策申请的审核周期因政策类型而异，一般为15-30个工作日。我们会及时跟进申请进度，并通过短信、邮件等方式通知您审核结果。'
    },
    {
      category: 'project',
      question: '什么样的项目可以申请孵化？',
      answer: '我们主要孵化科技创新类项目，包括：人工智能、大数据、物联网、生物医药、新材料、新能源等领域。项目应具有一定的技术含量和市场前景。'
    },
    {
      category: 'project',
      question: '项目孵化提供哪些服务？',
      answer: '项目孵化服务包括：办公场地、资金支持、技术指导、市场推广、法律咨询、财务管理、人才招聘等全方位服务。具体服务内容根据项目需求定制。'
    },
    {
      category: 'project',
      question: '项目孵化的成功率如何？',
      answer: '我们的项目孵化成功率约为70%，远高于行业平均水平。成功的关键在于：项目筛选严格、导师团队专业、服务体系完善、资源整合能力强。'
    },
    {
      category: 'payment',
      question: '平台服务是否收费？',
      answer: '基础的信息浏览、政策查询等服务免费。部分增值服务如专业咨询、项目孵化、定制服务等会收取相应费用。具体收费标准请咨询客服。'
    },
    {
      category: 'payment',
      question: '支持哪些付款方式？',
      answer: '我们支持多种付款方式：支付宝、微信支付、银行转账、企业对公转账等。大额付款建议使用银行转账，安全可靠。'
    },
    {
      category: 'payment',
      question: '如何申请退款？',
      answer: '如需退款，请联系客服说明原因。符合退款条件的，我们会在3-5个工作日内处理。退款将原路返回到您的付款账户。'
    }
  ]

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = !searchText || 
      item.question.toLowerCase().includes(searchText.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchText.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
                {filteredFAQ.map((faq, index) => (
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
                    key={index}
                  >
                    <Paragraph className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </Paragraph>
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