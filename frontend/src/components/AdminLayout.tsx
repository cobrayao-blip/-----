import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Button } from 'antd'
import { 
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  BankOutlined,
  ProjectOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store'
import { logout } from '../store/slices/authSlice'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  // 获取管理员角色显示名称
  const getAdminRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return '超级管理员'
      case 'ADMIN': return '普通管理员'
      default: return '管理员'
    }
  }

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        navigate('/profile')
        break
      case 'logout':
        handleLogout()
        break
    }
  }

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: '用户管理'
    },
    {
      key: '/admin/applications',
      icon: <FileTextOutlined />,
      label: '申报管理'
    },
    {
      key: '/admin/content',
      icon: <BankOutlined />,
      label: '内容管理'
    },
    {
      key: '/admin/page-content',
      icon: <FileTextOutlined />,
      label: '页面管理'
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: '系统设置'
    }
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心'
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="bg-white shadow-md"
        width={250}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">逍</span>
            </div>
            {!collapsed && (
              <div>
                <Title level={5} className="m-0 text-gray-800">
                  逍遥人才网
                </Title>
                <div className="text-xs text-gray-500">管理后台</div>
              </div>
            )}
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0"
        />
      </Sider>
      
      <Layout>
        <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
            
            <div className="text-gray-600">
              {menuItems.find(item => item.key === location.pathname)?.label || '管理后台'}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button type="text" icon={<BellOutlined />} />
            
            <Dropdown
              menu={{ 
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
              arrow
            >
              <Space className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                <Avatar icon={<UserOutlined />} />
                <span className="text-gray-700">
                  {user ? getAdminRoleLabel(user.role) : '管理员'}
                </span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="bg-gray-50 overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout