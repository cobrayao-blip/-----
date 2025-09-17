import React from 'react'
import { Layout, Row, Col, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Footer: AntFooter } = Layout
const { Text, Link } = Typography

const Footer: React.FC = () => {
  const navigate = useNavigate()

  return (
    <AntFooter className="bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <Row gutter={[32, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-4">
              <Text strong className="text-lg">逍遥人才网</Text>
            </div>
            <Space direction="vertical" size="small">
              <Text type="secondary">专业的人才服务平台</Text>
              <Text type="secondary">连接人才与机遇</Text>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="mb-4">
              <Text strong>服务</Text>
            </div>
            <Space direction="vertical" size="small">
              <Link href="/parks">园区服务</Link>
              <Link href="/policies">政策咨询</Link>
              <Link href="/projects">项目孵化</Link>
              <Link href="/jobs">人才招聘</Link>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="mb-4">
              <Text strong>帮助</Text>
            </div>
            <Space direction="vertical" size="small">
              <Link onClick={() => navigate('/guide')} style={{ cursor: 'pointer' }}>使用指南</Link>
              <Link onClick={() => navigate('/faq')} style={{ cursor: 'pointer' }}>常见问题</Link>
              <Link onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>联系我们</Link>
              <Link onClick={() => navigate('/feedback')} style={{ cursor: 'pointer' }}>意见反馈</Link>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="mb-4">
              <Text strong>联系方式</Text>
            </div>
            <Space direction="vertical" size="small">
              <Text type="secondary">电话: 400-888-8888</Text>
              <Text type="secondary">邮箱: contact@xiaoyao.com</Text>
              <Text type="secondary">地址: 北京市海淀区中关村</Text>
            </Space>
          </Col>
        </Row>
        
        <div className="border-t border-gray-200 mt-8 pt-4 text-center">
          <Text type="secondary">
            © 2024 逍遥人才网. All rights reserved.
          </Text>
        </div>
      </div>
    </AntFooter>
  )
}

export default Footer