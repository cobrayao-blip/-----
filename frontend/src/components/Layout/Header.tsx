import React from 'react'
import { Layout, Menu, Button, Space, Avatar, Dropdown } from 'antd'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { logout } from '../../store/slices/authSlice'

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const menuItems = [
    { key: '/', label: <Link to="/">首页</Link> },
    { key: '/parks', label: <Link to="/parks">园区</Link> },
    { key: '/policies', label: <Link to="/policies">政策</Link> },
    { key: '/projects', label: <Link to="/projects">项目</Link> },
    { key: '/jobs', label: <Link to="/jobs">职位</Link> },
    { key: '/contact', label: <Link to="/contact">联系我们</Link> },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人中心</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <AntHeader className="bg-white shadow-sm px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 mr-8">
          逍遥人才网
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-none flex-1"
        />
      </div>
      
      <Space>
        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="cursor-pointer">
              <Avatar src={user?.avatar} icon={<UserOutlined />} />
              <span>{user?.name}</span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              注册
            </Button>
          </Space>
        )}
      </Space>
    </AntHeader>
  )
}

export default Header