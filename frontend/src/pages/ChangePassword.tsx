import React, { useState } from 'react'
import { Card, Form, Input, Button, Typography, message, Space, Alert } from 'antd'
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store'
import { logout } from '../store/slices/authSlice'

const { Title, Text } = Typography

interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)

  const handleChangePassword = async (values: ChangePasswordForm) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        message.success('密码修改成功！请重新登录')
        
        // 清除登录状态，强制重新登录
        dispatch(logout())
        navigate('/login')
      } else {
        // 显示详细的错误信息
        const errorMessage = data.message || `密码修改失败 (${response.status})`
        message.error(errorMessage)
        console.error('密码修改失败:', data)
      }
    } catch (error) {
      console.error('密码修改请求失败:', error)
      message.error('网络错误，请检查连接后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center">
            <LockOutlined className="text-white text-xl" />
          </div>
          <Title level={2} className="mt-6 text-gray-900">
            修改密码
          </Title>
          <Text className="text-gray-600">为了账户安全，请修改您的初始密码</Text>
        </div>

        <Card className="shadow-lg">
          <Alert
            message="安全提醒"
            description="检测到您正在使用初始密码，为了账户安全，建议您立即修改密码。"
            type="warning"
            showIcon
            className="mb-6"
          />

          <Form
            form={form}
            name="change-password"
            onFinish={handleChangePassword}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="currentPassword"
              label="当前密码"
              rules={[{ required: true, message: '请输入当前密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="请输入当前密码"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度至少6位' },
                { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="请输入新密码（至少6位，包含字母和数字）"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认新密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="请再次输入新密码"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                修改密码
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <Space direction="vertical">
              <Text className="text-gray-500 text-sm">
                密码安全建议：
              </Text>
              <Text className="text-xs text-gray-400">
                • 使用至少6位字符，包含字母和数字<br />
                • 不要使用生日、姓名等容易猜测的信息<br />
                • 定期更换密码，保护账户安全
              </Text>
              
              <Button type="link" onClick={handleSkip} className="text-sm">
                暂时跳过，稍后修改
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ChangePassword