import React from 'react'
import { Card, Typography, Button, Space, Descriptions, Alert } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store'

const { Title, Text } = Typography

const AdminTest: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth)

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Title level={2}>🔐 管理员权限测试</Title>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 当前用户状态 */}
        <Card title="当前用户状态">
          {isAuthenticated && user ? (
            <>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="登录状态">
                  <Text type="success">✅ 已登录</Text>
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
                  <Text strong style={{ 
                    color: user.role === 'ADMIN' ? '#f5222d' : '#1890ff' 
                  }}>
                    {getRoleLabel(user.role)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  {getStatusLabel(user.status)}
                </Descriptions.Item>
              </Descriptions>
              
              {user.role === 'ADMIN' ? (
                <Alert
                  message="管理员权限确认"
                  description="您拥有管理员权限，可以访问管理后台"
                  type="success"
                  showIcon
                  className="mt-4"
                />
              ) : (
                <Alert
                  message="权限不足"
                  description="您不是管理员，无法访问管理后台"
                  type="warning"
                  showIcon
                  className="mt-4"
                />
              )}
            </>
          ) : (
            <Alert
              message="未登录"
              description="请先登录以查看用户信息"
              type="info"
              showIcon
            />
          )}
        </Card>

        {/* 管理后台访问测试 */}
        <Card title="管理后台访问测试">
          <Space direction="vertical" className="w-full">
            <Button 
              type="primary" 
              onClick={() => navigate('/admin')}
              disabled={!isAuthenticated || user?.role !== 'ADMIN'}
              block
            >
              访问管理后台首页
            </Button>
            
            <Button 
              onClick={() => navigate('/admin/dashboard')}
              disabled={!isAuthenticated || user?.role !== 'ADMIN'}
              block
            >
              访问管理仪表盘
            </Button>
            
            <Button 
              onClick={() => navigate('/admin/users')}
              disabled={!isAuthenticated || user?.role !== 'ADMIN'}
              block
            >
              访问用户管理
            </Button>
            
            <Button 
              onClick={() => navigate('/login')}
              block
            >
              重新登录
            </Button>
          </Space>
        </Card>
      </div>

      {/* Token信息 */}
      {token && (
        <Card title="Token信息" className="mt-6">
          <div className="mb-4">
            <Text strong>Token (前50字符): </Text>
            <Text code>{token.substring(0, 50)}...</Text>
          </div>
          
          <div className="mb-4">
            <Text strong>Token解析: </Text>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {(() => {
                try {
                  const payload = JSON.parse(atob(token.split('.')[1]))
                  return JSON.stringify(payload, null, 2)
                } catch (error) {
                  return '解析失败: ' + error
                }
              })()}
            </pre>
          </div>
        </Card>
      )}

      {/* 调试信息 */}
      <Card title="调试信息" className="mt-6">
        <div className="space-y-2">
          <div>
            <Text strong>localStorage token: </Text>
            <Text code>{localStorage.getItem('token')?.substring(0, 50)}...</Text>
          </div>
          
          <div>
            <Text strong>Redux isAuthenticated: </Text>
            <Text code>{String(isAuthenticated)}</Text>
          </div>
          
          <div>
            <Text strong>Redux user: </Text>
            <pre className="bg-gray-100 p-2 rounded text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminTest