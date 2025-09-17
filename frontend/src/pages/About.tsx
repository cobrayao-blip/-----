import React from 'react'
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Timeline,
  Statistic,
  Avatar,
  Space,
  Divider
} from 'antd'
import { 
  RocketOutlined,
  TeamOutlined,
  TrophyOutlined,
  HeartOutlined,
  BulbOutlined,
  SafetyOutlined
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const About: React.FC = () => {
  const values = [
    {
      icon: <BulbOutlined className="text-4xl text-blue-500" />,
      title: '创新驱动',
      description: '持续创新技术和服务模式，为用户提供最优质的体验'
    },
    {
      icon: <HeartOutlined className="text-4xl text-red-500" />,
      title: '用户至上',
      description: '以用户需求为中心，提供贴心、专业的人才服务'
    },
    {
      icon: <SafetyOutlined className="text-4xl text-green-500" />,
      title: '诚信可靠',
      description: '建立透明、公正的平台环境，保障用户权益'
    },
    {
      icon: <TeamOutlined className="text-4xl text-purple-500" />,
      title: '合作共赢',
      description: '促进人才、企业、园区多方合作，实现共同发展'
    }
  ]

  const milestones = [
    {
      year: '2024年1月',
      title: '平台正式上线',
      description: '逍遥人才网正式发布，开始为用户提供人才服务'
    },
    {
      year: '2024年3月',
      title: '园区合作启动',
      description: '与首批50家产业园区建立合作关系'
    },
    {
      year: '2024年6月',
      title: '政策服务上线',
      description: '推出政策咨询和申报服务，覆盖全国主要城市'
    },
    {
      year: '2024年9月',
      title: '用户突破5万',
      description: '注册用户数量突破5万，服务覆盖全国各地'
    }
  ]

  const team = [
    {
      name: '张总',
      role: '创始人 & CEO',
      avatar: '/api/placeholder/80/80',
      description: '10年人力资源行业经验，致力于打造最专业的人才服务平台'
    },
    {
      name: '李总',
      role: '技术总监',
      avatar: '/api/placeholder/80/80',
      description: '资深技术专家，负责平台技术架构和产品研发'
    },
    {
      name: '王总',
      role: '运营总监',
      avatar: '/api/placeholder/80/80',
      description: '丰富的运营管理经验，专注于用户体验和业务增长'
    }
  ]

  const stats = [
    { title: '注册用户', value: 50000, suffix: '+' },
    { title: '合作园区', value: 200, suffix: '+' },
    { title: '成功案例', value: 1000, suffix: '+' },
    { title: '服务城市', value: 100, suffix: '+' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Title level={1} className="text-white mb-6">
            关于逍遥人才网
          </Title>
          <Paragraph className="text-xl text-blue-100 max-w-3xl mx-auto">
            我们致力于成为中国领先的人才服务平台，连接人才与机遇，助力个人成长和企业发展
          </Paragraph>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Title level={2}>我们的使命</Title>
              <Paragraph className="text-lg text-gray-600 mb-6">
                逍遥人才网成立于2024年，是一家专注于人才服务的创新型企业。我们通过整合园区资源、政策信息、项目孵化和人才招聘等服务，为用户提供一站式的人才发展解决方案。
              </Paragraph>
              <Paragraph className="text-lg text-gray-600 mb-6">
                我们相信，每个人都有无限的潜能，每个企业都有成长的机会。通过我们的平台，人才可以找到最适合的发展机会，企业可以发现最优秀的人才，园区可以吸引最有潜力的项目。
              </Paragraph>
              <Paragraph className="text-lg text-gray-600">
                我们的愿景是成为中国最受信赖的人才服务平台，让人才流动更加高效，让创新创业更加便利。
              </Paragraph>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="shadow-lg">
                <Row gutter={[16, 16]}>
                  {stats.map((stat, index) => (
                    <Col xs={12} key={index}>
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{ color: '#1890ff', fontSize: '1.5rem', fontWeight: 'bold' }}
                      />
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Title level={2}>核心价值观</Title>
            <Paragraph className="text-lg text-gray-600">
              我们的价值观指导着我们的每一个决策和行动
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <div className="mb-4">{value.icon}</div>
                  <Title level={4}>{value.title}</Title>
                  <Paragraph className="text-gray-600">
                    {value.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Title level={2}>发展历程</Title>
            <Paragraph className="text-lg text-gray-600">
              见证我们的成长足迹
            </Paragraph>
          </div>
          
          <Row justify="center">
            <Col xs={24} lg={16}>
              <Timeline mode="left">
                {milestones.map((milestone, index) => (
                  <Timeline.Item 
                    key={index}
                    dot={<TrophyOutlined className="text-blue-500" />}
                  >
                    <div className="ml-4">
                      <Title level={4} className="mb-2">{milestone.title}</Title>
                      <div className="text-gray-500 mb-2">{milestone.year}</div>
                      <Paragraph className="text-gray-600">
                        {milestone.description}
                      </Paragraph>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Col>
          </Row>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Title level={2}>核心团队</Title>
            <Paragraph className="text-lg text-gray-600">
              专业的团队，专注的服务
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} justify="center">
            {team.map((member, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <Avatar src={member.avatar} size={80} className="mb-4" />
                  <Title level={4}>{member.name}</Title>
                  <div className="text-blue-500 mb-3">{member.role}</div>
                  <Paragraph className="text-gray-600">
                    {member.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Title level={2} className="text-white mb-6">
            联系我们
          </Title>
          <Paragraph className="text-xl text-blue-100 mb-8">
            如果您有任何问题或建议，欢迎随时与我们联系
          </Paragraph>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8}>
              <div>
                <Title level={4} className="text-white">客服热线</Title>
                <div className="text-blue-100">400-888-8888</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div>
                <Title level={4} className="text-white">邮箱地址</Title>
                <div className="text-blue-100">contact@xiaoyao.com</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div>
                <Title level={4} className="text-white">工作时间</Title>
                <div className="text-blue-100">周一至周五 9:00-18:00</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  )
}

export default About