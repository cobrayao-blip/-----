import React from 'react'
import { 
  Typography, 
  Button, 
  Row, 
  Col, 
  Card, 
  Space, 
  Statistic,
  Avatar
} from 'antd'
import { 
  RocketOutlined, 
  TeamOutlined, 
  BankOutlined, 
  FileTextOutlined,
  ArrowRightOutlined,
  StarOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Title, Paragraph } = Typography

const Home: React.FC = () => {
  const features = [
    {
      icon: <BankOutlined className="text-4xl text-blue-500" />,
      title: '园区服务',
      description: '汇聚全国优质产业园区，提供一站式入驻服务',
      link: '/parks'
    },
    {
      icon: <FileTextOutlined className="text-4xl text-green-500" />,
      title: '政策咨询',
      description: '实时更新各地人才政策，助力政策申报',
      link: '/policies'
    },
    {
      icon: <RocketOutlined className="text-4xl text-purple-500" />,
      title: '项目孵化',
      description: '创业项目展示平台，连接投资与创新',
      link: '/projects'
    },
    {
      icon: <TeamOutlined className="text-4xl text-orange-500" />,
      title: '人才招聘',
      description: '精准匹配人才需求，构建人才生态圈',
      link: '/jobs'
    }
  ]

  const stats = [
    { title: '注册用户', value: 50000, suffix: '+' },
    { title: '合作园区', value: 200, suffix: '+' },
    { title: '成功项目', value: 1000, suffix: '+' },
    { title: '职位机会', value: 5000, suffix: '+' }
  ]

  const testimonials = [
    {
      name: '张创业',
      role: '科技公司CEO',
      avatar: 'https://via.placeholder.com/64x64?text=用户',
      content: '通过逍遥人才网，我们成功入驻了理想的科技园区，享受到了优质的政策支持。'
    },
    {
      name: '李工程师',
      role: '高级工程师',
      avatar: '/api/placeholder/64/64',
      content: '平台提供的职位信息很精准，帮助我找到了心仪的工作机会。'
    },
    {
      name: '王投资人',
      role: '投资经理',
      avatar: '/api/placeholder/64/64',
      content: '这里有很多优质的创业项目，是我们寻找投资标的的重要渠道。'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Title level={1} className="text-white mb-6">
            连接人才与机遇，成就创新未来
          </Title>
          <Paragraph className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            逍遥人才网是专业的人才服务平台，为创业者、人才和企业提供园区入驻、政策咨询、项目孵化和人才招聘等全方位服务
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" className="bg-white text-blue-600 border-white hover:bg-blue-50">
              <Link to="/register">立即注册</Link>
            </Button>
            <Button type="primary" size="large" className="bg-white text-blue-600 border-white hover:bg-blue-50">
              <Link to="/about">了解更多</Link>
            </Button>
          </Space>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="text-center border-0 shadow-sm">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Title level={2}>核心服务</Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们提供全方位的人才服务，助力个人成长和企业发展
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card 
                  className="h-full text-center hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = feature.link}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph className="text-gray-600 mb-4">
                    {feature.description}
                  </Paragraph>
                  <Button type="link" className="p-0">
                    了解更多 <ArrowRightOutlined />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Title level={2}>用户评价</Title>
            <Paragraph className="text-lg text-gray-600">
              听听我们用户的真实反馈
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-full">
                  <div className="flex items-center mb-4">
                    <Avatar src={testimonial.avatar} size={48} className="mr-3" />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-gray-500 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <StarOutlined key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <Paragraph className="text-gray-600">
                    "{testimonial.content}"
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Title level={2} className="text-white mb-6">
            准备开始您的人才之旅？
          </Title>
          <Paragraph className="text-xl text-blue-100 mb-8">
            加入逍遥人才网，发现更多机遇，实现职业梦想
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" className="bg-white text-blue-600 border-white">
              <Link to="/register">免费注册</Link>
            </Button>
            <Button type="primary" size="large" className="bg-white text-blue-600 border-white">
              <Link to="/jobs">浏览职位</Link>
            </Button>
          </Space>
        </div>
      </section>
    </div>
  )
}

export default Home