import React, { useState } from 'react'
import { Card, Form, Input, Button, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../services/api'
import { useAppDispatch } from '../store'
import { setCredentials } from '../store/slices/authSlice'

const { Title, Text } = Typography

const AdminLogin: React.FC = () => {
  const [form] = Form.useForm()
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const result = await login(values).unwrap()
      
      if (result.data?.user && result.data?.token) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token
        }))
        
        if (result.data.user.role === 'ADMIN') {
          message.success('管理员登录成功！')
          navigate('/admin/dashboard')
        } else {
          message.error('您没有管理员权限')
        }
      }
    } catch (error: any) {
      message.error(error?.data?.message || '登录失败')
    }
  }

  const handleQuickLogin = async () => {
    try {
      const result = await login({
        email: 'admin@xiaoyao.com',
        password: 'admin123456'
      }).unwrap()
      
      if (result.data?.user && result.data?.token) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token
        }))
        message.success('管理员登录成功！')
        navigate('/admin/dashboard')
      }
    } catch (error: any) {
      message.error(error?.data?.message || '登录失败')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">逍</span>
          </div>
          <Title level={2} className="mt-6 text-gray-900">
            逍遥人才网
          </Title>
          <Text className="text-gray-600">管理后台登录</Text>
        </div>

        <Card className="shadow-lg">
          <Form
            form={form}
            name="admin-login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
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
                prefix={<UserOutlined />} 
                placeholder="请输入邮箱地址"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
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
                loading={isLoading}
                block
                size="large"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-gray-500 text-sm block mb-2">
              快速登录（测试用）：
            </Text>
            <Button 
              onClick={handleQuickLogin}
              loading={isLoading}
              block
              size="large"
            >
              使用管理员账户登录
            </Button>
            <Text className="text-xs text-gray-400 mt-2 block text-center">
              admin@xiaoyao.com / admin123456
            </Text>
          </div>
        </Card>

        <div className="text-center">
          <Space>
            <Button type="link" onClick={() => navigate('/')}>
              返回首页
            </Button>
            <Button type="link" onClick={() => navigate('/test-login')}>
              测试页面
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin