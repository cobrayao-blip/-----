import React, { useEffect } from 'react'
import { Form, Input, Button, Card, Typography, message, Divider, Space } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../services/api'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials } from '../store/slices/authSlice'

const { Title, Text } = Typography

interface LoginForm {
  email: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    // 移除自动跳转逻辑，让登录后的跳转由onFinish处理
  }, [])

  const onFinish = async (values: LoginForm) => {
    try {
      const result = await login(values).unwrap()
      
      if (result.data?.user && result.data?.token) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token
        }))
        
        message.success('登录成功！')
        
        // 检查是否使用初始密码
        const { password } = values
        const isInitialPassword = password === 'admin123' || password === '123456' || password === 'password'
        
        if (isInitialPassword) {
          message.warning('检测到您正在使用初始密码，为了账户安全，请先修改密码')
          navigate('/change-password')
          return
        }
        
        // 根据用户角色跳转到不同页面
        if (result.data.user.role === 'ADMIN' || result.data.user.role === 'SUPER_ADMIN') {
          navigate('/admin/dashboard')
        } else {
          navigate('/')
        }
      }
    } catch (error: any) {
      message.error(error?.data?.message || '登录失败，请检查邮箱和密码')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <Title level={2} className="mb-2">
            欢迎回来
          </Title>
          <Text type="secondary">
            登录您的逍遥人才网账户
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
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
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isLoading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">其他选项</Text>
        </Divider>

        <Space direction="vertical" className="w-full" size="middle">
          <div className="text-center">
            <Text type="secondary">
              还没有账户？{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800">
                立即注册
              </Link>
            </Text>
          </div>
          
          <div className="text-center">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
              忘记密码？
            </Link>
          </div>
        </Space>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <Text type="secondary" className="text-sm">
              登录即表示您同意我们的{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                服务条款
              </Link>
              {' '}和{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                隐私政策
              </Link>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Login