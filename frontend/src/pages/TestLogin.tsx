import React, { useState } from 'react'
import { Card, Button, Typography, Space, message, Descriptions } from 'antd'
import { useLoginMutation } from '../services/api'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials } from '../store/slices/authSlice'

const { Title, Text } = Typography

const TestLogin: React.FC = () => {
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [testResult, setTestResult] = useState<any>(null)

  // 角色翻译函数
  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': '超级管理员',
      'ADMIN': '管理员',
      'VIP': 'VIP用户',
      'USER': '普通用户'
    }
    return roleMap[role] || role
  }

  // 状态翻译函数
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': '活跃',
      'INACTIVE': '非活跃',
      'SUSPENDED': '已暂停',
      'BANNED': '已封禁'
    }
    return statusMap[status] || status
  }

  const testAdminLogin = async () => {
    try {
      console.log('🔍 开始测试管理员登录...')
      
      const result = await login({
        email: 'admin@xiaoyao.com',
        password: 'admin123456'
      }).unwrap()

      console.log('✅ 登录API响应:', result)
      setTestResult(result)

      if (result.data?.user && result.data?.token) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token
        }))
        message.success('管理员登录成功！')
      }
    } catch (error: any) {
      console.error('❌ 登录失败:', error)
      message.error(`登录失败: ${error?.data?.message || error.message}`)
      setTestResult({ error: error?.data || error })
    }
  }

  const testUserLogin = async () => {
    try {
      const result = await login({
        email: 'test@example.com',
        password: 'test123456'
      }).unwrap()

      console.log('普通用户登录结果:', result)
      setTestResult(result)

      if (result.data?.user && result.data?.token) {
        dispatch(setCredentials({
          user: result.data.user,
          token: result.data.token
        }))
        message.success('普通用户登录成功！')
      }
    } catch (error: any) {
      console.error('普通用户登录失败:', error)
      message.error(`登录失败: ${error?.data?.message || error.message}`)
      setTestResult({ error: error?.data || error })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Title level={2}>登录功能测试</Title>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 测试按钮 */}
        <Card title="测试登录">
          <Space direction="vertical" className="w-full">
            <Button 
              type="primary" 
              onClick={testAdminLogin}
              loading={isLoading}
              block
            >
              测试管理员登录
            </Button>
            <Text type="secondary">
              邮箱: admin@xiaoyao.com<br />
              密码: admin123456
            </Text>
            
            <Button 
              onClick={testUserLogin}
              loading={isLoading}
              block
            >
              测试普通用户登录
            </Button>
            <Text type="secondary">
              邮箱: test@example.com<br />
              密码: test123456
            </Text>
          </Space>
        </Card>

        {/* 当前用户状态 */}
        <Card title="当前用户状态">
          {isAuthenticated && user ? (
            <Descriptions column={1} size="small">
              <Descriptions.Item label="登录状态">
                <Text type="success">已登录</Text>
              </Descriptions.Item>
              <Descriptions.Item label="用户ID">
                {user.id}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label="姓名">
                {user.name}
              </Descriptions.Item>
              <Descriptions.Item label="角色">
                <Text strong color={user.role === 'ADMIN' ? 'red' : 'blue'}>
                  {getRoleLabel(user.role)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusLabel(user.status)}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Text type="secondary">未登录</Text>
          )}
        </Card>
      </div>

      {/* 测试结果 */}
      {testResult && (
        <Card title="最新测试结果" className="mt-6">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </Card>
      )}

      {/* 快速链接 */}
      {isAuthenticated && user?.role === 'ADMIN' && (
        <Card title="管理员快速链接" className="mt-6">
          <Space>
            <Button type="link" href="/admin">
              进入管理后台
            </Button>
            <Button type="link" href="/admin/dashboard">
              管理仪表盘
            </Button>
            <Button type="link" href="/admin/users">
              用户管理
            </Button>
          </Space>
        </Card>
      )}
    </div>
  )
}

export default TestLogin