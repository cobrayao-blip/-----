import React from 'react'
import { Typography, Card, Steps, Collapse, Row, Col, Button, Space } from 'antd'
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

const Guide: React.FC = () => {
  const navigate = useNavigate()

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

  const guideContent = [
    {
      title: '新用户注册指南',
      content: [
        '1. 点击页面右上角"立即注册"按钮',
        '2. 填写手机号码并获取验证码',
        '3. 设置登录密码（8-20位，包含字母和数字）',
        '4. 完善个人基本信息',
        '5. 上传身份证明文件（可选）',
        '6. 提交注册申请，等待审核'
      ]
    },
    {
      title: '园区服务使用指南',
      content: [
        '1. 登录后进入"园区服务"页面',
        '2. 浏览各园区的详细信息和优惠政策',
        '3. 根据行业类型和地理位置筛选合适园区',
        '4. 点击"申请入驻"提交入驻申请',
        '5. 上传企业相关资质文件',
        '6. 等待园区方审核并安排实地考察'
      ]
    },
    {
      title: '政策咨询指南',
      content: [
        '1. 访问"政策咨询"页面查看最新政策',
        '2. 使用搜索功能查找特定政策类型',
        '3. 点击政策标题查看详细内容',
        '4. 如有疑问可点击"在线咨询"',
        '5. 填写咨询表单并提交',
        '6. 专业顾问将在24小时内回复'
      ]
    },
    {
      title: '项目申报指南',
      content: [
        '1. 进入"项目孵化"页面浏览项目信息',
        '2. 选择符合条件的项目类型',
        '3. 仔细阅读项目申报要求',
        '4. 准备相关申报材料',
        '5. 在线填写申报表单',
        '6. 上传支撑材料并提交申请'
      ]
    }
  ]

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
                {guideContent.map((guide, index) => (
                  <Panel header={guide.title} key={index}>
                    <div className="space-y-2">
                      {guide.content.map((step, stepIndex) => (
                        <Paragraph key={stepIndex} className="mb-2">
                          {step}
                        </Paragraph>
                      ))}
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