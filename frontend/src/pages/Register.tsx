import React from 'react'
import { Form, Input, Button, Card, Typography, message, Divider, Checkbox } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../store/api/authApi'

const { Title, Text } = Typography

interface RegisterForm {
  name: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  agreement: boolean
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()
  const [form] = Form.useForm()

  const onFinish = async (values: RegisterForm) => {
    try {
      const { confirmPassword, agreement, ...registerData } = values
      await register(registerData).unwrap()
      
      message.success('注册成功！请登录您的账户')
      navigate('/login')
    } catch (error: any) {
      message.error(error?.data?.message || '注册失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <Title level={2} className="mb-2">
            创建账户
          </Title>
          <Text type="secondary">
            加入逍遥人才网，开启职业新篇章
          </Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              { min: 2, message: '姓名至少2个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入您的姓名"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱地址"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号码（可选）"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="请输入手机号码"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少6位' },
              { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款'))
              }
            ]}
          >
            <Checkbox>
              我已阅读并同意{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                服务条款
              </Link>
              {' '}和{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                隐私政策
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isLoading}
            >
              注册账户
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">已有账户？</Text>
        </Divider>

        <div className="text-center">
          <Link to="/login">
            <Button type="link" className="p-0 text-blue-600 hover:text-blue-800">
              立即登录
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <Text type="secondary" className="text-sm">
              注册即表示您同意接收我们的服务通知
            </Text>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Register