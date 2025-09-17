import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './Header'
import Footer from './Footer'

const { Content } = Layout

const MainLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="flex-1">
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}

export default MainLayout