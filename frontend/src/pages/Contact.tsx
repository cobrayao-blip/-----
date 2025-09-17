import React from 'react'
import { Typography, Card, Row, Col, Form, Input, Button, Space, message, Divider } from 'antd'
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  WechatOutlined,
  QqOutlined,
  SendOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const Contact: React.FC = () => {
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    try {
      // 这里应该调用API提交联系表单
      console.log('Contact form submitted:', values)
      message.success('您的消息已发送，我们会尽快回复！')
      form.resetFields()
    } catch (error) {
      message.error('发送失败，请稍后重试')
    }
  }

  const contactInfo = [
    {
      icon: <PhoneOutlined className="text-blue-500" />,
      title: '客服热线',
      content: '400-888-8888',
      description: '7×24小时服务热线'
    },
    {
      icon: <MailOutlined className="text-green-500" />,
      title: '邮箱地址',
      content: 'contact@xiaoyao.com',
      description: '商务合作与意见建议'
    },
    {
      icon: <EnvironmentOutlined className="text-red-500" />,
      title: '公司地址',
      content: '北京市海淀区中关村科技园',
      description: '欢迎预约实地参观'
    },
    {
      icon: <ClockCircleOutlined className="text-orange-500" />,
      title: '工作时间',
      content: '周一至周五 9:00-18:00',
      description: '节假日客服在线'
    }
  ]

  const socialContacts = [
    {
      icon: <WechatOutlined className="text-green-600" />,
      title: '微信客服',
      content: 'xiaoyao_service',
      qr: '/images/wechat-qr.png'
    },
    {
      icon: <QqOutlined className="text-blue-600" />,
      title: 'QQ交流群',
      content: '123456789',
      qr: '/images/qq-qr.png'
    }
  ]

  const departments = [
    {
      name: '客户服务部',
      phone: '400-888-8888 转 1',
      email: 'service@xiaoyao.com',
      description: '账户问题、使用咨询、技术支持'
    },
    {
      name: '商务合作部',
      phone: '400-888-8888 转 2',
      email: 'business@xiaoyao.com',
      description: '园区合作、政策对接、项目孵化'
    },
    {
      name: '市场推广部',
      phone: '400-888-8888 转 3',
      email: 'marketing@xiaoyao.com',
      description: '媒体合作、活动策划、品牌推广'
    },
    {
      name: '技术支持部',
      phone: '400-888-8888 转 4',
      email: 'tech@xiaoyao.com',
      description: '系统故障、功能建议、技术咨询'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <Title level={1}>联系我们</Title>
          <Paragraph className="text-lg text-gray-600">
            我们随时为您提供专业的服务支持
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* 联系方式 */}
          <Col xs={24} lg={12}>
            <Card title="联系方式" className="h-full">
              <Row gutter={[16, 24]}>
                {contactInfo.map((info, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-3xl mb-3">{info.icon}</div>
                      <Title level={5} className="mb-2">{info.title}</Title>
                      <Text strong className="block mb-1">{info.content}</Text>
                      <Text type="secondary" className="text-sm">{info.description}</Text>
                    </div>
                  </Col>
                ))}
              </Row>

              <Divider />

              {/* 社交联系方式 */}
              <Title level={4} className="mb-4">社交媒体</Title>
              <Row gutter={[16, 16]}>
                {socialContacts.map((social, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <div className="text-2xl mb-2">{social.icon}</div>
                      <Text strong className="block">{social.title}</Text>
                      <Text className="block">{social.content}</Text>
                      <Button type="link" size="small">扫码添加</Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* 在线留言 */}
          <Col xs={24} lg={12}>
            <Card title="在线留言" className="h-full">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入您的姓名' }]}
                >
                  <Input placeholder="请输入您的姓名" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="联系电话"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                  ]}
                >
                  <Input placeholder="请输入您的联系电话" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="邮箱地址"
                  rules={[
                    { type: 'email', message: '请输入正确的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入您的邮箱地址（可选）" />
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="咨询主题"
                  rules={[{ required: true, message: '请输入咨询主题' }]}
                >
                  <Input placeholder="请简要描述您的咨询主题" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="详细内容"
                  rules={[{ required: true, message: '请输入详细内容' }]}
                >
                  <TextArea 
                    rows={6} 
                    placeholder="请详细描述您的问题或需求，我们会尽快回复您"
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />}
                    size="large"
                    block
                  >
                    发送消息
                  </Button>
                </Form.Item>
              </Form>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <Text type="secondary" className="text-sm">
                  <strong>温馨提示：</strong>
                  我们会在收到您的消息后24小时内回复。如需紧急处理，请直接拨打客服热线。
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 部门联系方式 */}
        <Card title="部门联系方式" className="mt-6">
          <Row gutter={[24, 16]}>
            {departments.map((dept, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <div className="p-4 border border-gray-200 rounded-lg h-full">
                  <Title level={5} className="mb-3 text-center">{dept.name}</Title>
                  <Space direction="vertical" size="small" className="w-full">
                    <div className="flex items-center">
                      <PhoneOutlined className="mr-2 text-blue-500" />
                      <Text>{dept.phone}</Text>
                    </div>
                    <div className="flex items-center">
                      <MailOutlined className="mr-2 text-green-500" />
                      <Text>{dept.email}</Text>
                    </div>
                    <Text type="secondary" className="text-sm mt-2 block">
                      {dept.description}
                    </Text>
                  </Space>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 地图位置 */}
        <Card title="公司位置" className="mt-6">
          <Row gutter={[24, 16]}>
            <Col xs={24} lg={16}>
              <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
                <Text type="secondary">地图位置（此处可集成百度地图或高德地图）</Text>
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Title level={5}>交通指南</Title>
                  <Space direction="vertical" size="small">
                    <Text><strong>地铁：</strong>4号线中关村站A出口</Text>
                    <Text><strong>公交：</strong>302、307、320路中关村站</Text>
                    <Text><strong>自驾：</strong>中关村大街与北四环交叉口</Text>
                  </Space>
                </div>
                <div>
                  <Title level={5}>周边设施</Title>
                  <Space direction="vertical" size="small">
                    <Text>• 中关村创业大街</Text>
                    <Text>• 清华大学</Text>
                    <Text>• 北京大学</Text>
                    <Text>• 中科院</Text>
                  </Space>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  )
}

export default Contact