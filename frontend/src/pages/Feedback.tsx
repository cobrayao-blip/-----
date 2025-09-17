import React, { useState } from 'react'
import { Typography, Card, Row, Col, Form, Input, Button, Select, Rate, Upload, message, Space, Tag } from 'antd'
import { 
  SendOutlined, 
  UploadOutlined, 
  BugOutlined, 
  BulbOutlined, 
  HeartOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const Feedback: React.FC = () => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const feedbackTypes = [
    { value: 'bug', label: '问题反馈', icon: <BugOutlined />, color: 'red' },
    { value: 'suggestion', label: '功能建议', icon: <BulbOutlined />, color: 'blue' },
    { value: 'praise', label: '表扬建议', icon: <HeartOutlined />, color: 'green' },
    { value: 'complaint', label: '投诉建议', icon: <WarningOutlined />, color: 'orange' },
    { value: 'other', label: '其他反馈', icon: <CheckCircleOutlined />, color: 'purple' }
  ]

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    try {
      // 这里应该调用API提交反馈
      console.log('Feedback submitted:', values)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
      message.success('感谢您的反馈！我们会认真处理您的建议。')
      form.resetFields()
    } catch (error) {
      message.error('提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const recentFeedback = [
    {
      type: 'suggestion',
      title: '希望增加移动端APP',
      status: '处理中',
      date: '2024-01-15',
      response: '感谢建议，移动端APP正在开发中，预计3月上线。'
    },
    {
      type: 'bug',
      title: '搜索功能偶尔无响应',
      status: '已修复',
      date: '2024-01-12',
      response: '问题已定位并修复，感谢您的反馈。'
    },
    {
      type: 'praise',
      title: '客服态度很好',
      status: '已回复',
      date: '2024-01-10',
      response: '谢谢您的认可，我们会继续努力提供优质服务。'
    }
  ]

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '处理中': 'processing',
      '已修复': 'success',
      '已回复': 'success',
      '待处理': 'default'
    }
    return colorMap[status] || 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <Title level={1}>意见反馈</Title>
          <Paragraph className="text-lg text-gray-600">
            您的每一个建议都是我们前进的动力
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* 反馈表单 */}
          <Col xs={24} lg={14}>
            <Card title="提交反馈" className="mb-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  rating: 5,
                  type: 'suggestion'
                }}
              >
                <Form.Item
                  name="type"
                  label="反馈类型"
                  rules={[{ required: true, message: '请选择反馈类型' }]}
                >
                  <Select placeholder="请选择反馈类型">
                    {feedbackTypes.map(type => (
                      <Option key={type.value} value={type.value}>
                        <Space>
                          {type.icon}
                          {type.label}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="title"
                  label="反馈标题"
                  rules={[{ required: true, message: '请输入反馈标题' }]}
                >
                  <Input placeholder="请简要描述您的反馈内容" />
                </Form.Item>

                <Form.Item
                  name="content"
                  label="详细描述"
                  rules={[{ required: true, message: '请输入详细描述' }]}
                >
                  <TextArea 
                    rows={6} 
                    placeholder="请详细描述您遇到的问题或建议，包括操作步骤、期望结果等"
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="contact"
                      label="联系方式"
                      rules={[{ required: true, message: '请输入联系方式' }]}
                    >
                      <Input placeholder="手机号或邮箱，便于我们回复" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="rating"
                      label="整体评分"
                    >
                      <Rate allowHalf />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="attachments"
                  label="相关截图"
                >
                  <Upload
                    listType="picture-card"
                    multiple
                    beforeUpload={() => false}
                    maxCount={5}
                  >
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>上传截图</div>
                    </div>
                  </Upload>
                  <Text type="secondary" className="text-sm">
                    支持 JPG、PNG 格式，最多5张，每张不超过5MB
                  </Text>
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />}
                    size="large"
                    loading={submitting}
                    block
                  >
                    提交反馈
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* 反馈须知 */}
            <Card title="反馈须知" size="small">
              <Space direction="vertical" size="small">
                <Text>• 我们会在24小时内回复您的反馈</Text>
                <Text>• 请提供详细的问题描述，有助于我们快速定位问题</Text>
                <Text>• 如有截图或录屏，请一并上传</Text>
                <Text>• 对于紧急问题，建议直接联系客服热线：400-888-8888</Text>
                <Text>• 我们承诺保护您的隐私信息安全</Text>
              </Space>
            </Card>
          </Col>

          {/* 侧边栏 */}
          <Col xs={24} lg={10}>
            <Space direction="vertical" size="large" className="w-full">
              {/* 反馈类型说明 */}
              <Card title="反馈类型说明" size="small">
                <Space direction="vertical" size="middle" className="w-full">
                  {feedbackTypes.map(type => (
                    <div key={type.value} className="flex items-start space-x-3">
                      <Tag color={type.color} className="mt-1">
                        {type.icon}
                      </Tag>
                      <div>
                        <Text strong>{type.label}</Text>
                        <br />
                        <Text type="secondary" className="text-sm">
                          {type.value === 'bug' && '系统错误、功能异常、页面问题等'}
                          {type.value === 'suggestion' && '新功能建议、体验优化建议等'}
                          {type.value === 'praise' && '服务表扬、产品认可等'}
                          {type.value === 'complaint' && '服务投诉、处理不当等'}
                          {type.value === 'other' && '其他类型的意见或建议'}
                        </Text>
                      </div>
                    </div>
                  ))}
                </Space>
              </Card>

              {/* 最近反馈 */}
              <Card title="最近反馈处理" size="small">
                <Space direction="vertical" size="middle" className="w-full">
                  {recentFeedback.map((feedback, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <Text strong className="text-sm">{feedback.title}</Text>
                        <Tag color={getStatusColor(feedback.status)} size="small">
                          {feedback.status}
                        </Tag>
                      </div>
                      <Text type="secondary" className="text-xs block mb-1">
                        {feedback.date}
                      </Text>
                      <Text className="text-xs text-gray-600">
                        {feedback.response}
                      </Text>
                    </div>
                  ))}
                </Space>
              </Card>

              {/* 联系方式 */}
              <Card title="其他联系方式" size="small">
                <Space direction="vertical" size="small">
                  <div>
                    <Text strong>客服热线：</Text>
                    <Text>400-888-8888</Text>
                  </div>
                  <div>
                    <Text strong>邮箱：</Text>
                    <Text>feedback@xiaoyao.com</Text>
                  </div>
                  <div>
                    <Text strong>工作时间：</Text>
                    <Text>周一至周五 9:00-18:00</Text>
                  </div>
                  <div>
                    <Text strong>QQ群：</Text>
                    <Text>123456789</Text>
                  </div>
                </Space>
              </Card>

              {/* 统计信息 */}
              <Card title="反馈统计" size="small">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">1,234</div>
                      <div className="text-sm text-gray-500">总反馈数</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">98%</div>
                      <div className="text-sm text-gray-500">处理率</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">2.5h</div>
                      <div className="text-sm text-gray-500">平均响应</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">4.8</div>
                      <div className="text-sm text-gray-500">满意度</div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Feedback