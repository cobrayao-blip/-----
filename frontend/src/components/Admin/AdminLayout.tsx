import React from 'react'
import { Layout, Menu } from 'antd'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  UserOutlined,
  BankOutlined,
  FileTextOutlined,
  ProjectOutlined,
  TeamOutlined
} from '@ant-design/icons'

const { Sider, Content } = Layout

const AdminLayout: React.FC = () => {
  const location = useLocation()

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">仪表板</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">用户管理</Link>,
    },
    {
      key: '/admin/parks',
      icon: <BankOutlined />,
      label: <Link to="/admin/parks">园区管理</Link>,
    },
    {
      key: '/admin/policies',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/policies">政策管理</Link>,
    },
    {
      key: '/admin/projects',
      icon: <ProjectOutlined />,
      label: <Link to="/admin/projects">项目管理</Link>,
    },
    {
      key: '/admin/jobs',
      icon: <TeamOutlined />,
      label: <Link to="/admin/jobs">职位管理</Link>,
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Sider width={200} className="bg-white shadow-sm">
        <div className="p-4 border-b">
          <Link to="/" className="text-lg font-bold text-blue-600">
            逍遥人才网
          </Link>
          <div className="text-sm text-gray-500 mt-1">管理后台</div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-none"
        />
      </Sider>
      
      <Layout>
        <Content className="p-6 bg-gray-50">
          <Routes>
            <Route index element={<div>管理仪表板</div>} />
            <Route path="users" element={<div>用户管理</div>} />
            <Route path="parks" element={<div>园区管理</div>} />
            <Route path="policies" element={<div>政策管理</div>} />
            <Route path="projects" element={<div>项目管理</div>} />
            <Route path="jobs" element={<div>职位管理</div>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout