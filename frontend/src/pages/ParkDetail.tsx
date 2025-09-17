import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Space, 
  Button, 
  Descriptions,
  Image,
  Spin,
  Alert
} from 'antd'
import { 
  ArrowLeftOutlined,
  EnvironmentOutlined, 
  CalendarOutlined,
  TeamOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { useGetParkByIdQuery } from '../services/api'

const { Title, Text, Paragraph } = Typography

const ParkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: parkResponse, isLoading, error } = useGetParkByIdQuery(id!)
  const park = parkResponse?.data

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !park) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Alert
            message="园区信息加载失败"
            description="请检查网络连接或稍后重试"
            type="error"
            showIcon
            action={
              <Button onClick={() => navigate('/parks')}>
                返回园区列表
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'INDUSTRIAL': '工业园区',
      'TECH': '科技园区',
      'ECONOMIC': '经济开发区',
      'HIGH_TECH': '高新技术开发区',
      'BONDED': '保税区',
      'OTHER': '其他'
    }
    return typeMap[type] || type
  }

  const getLevelLabel = (level: string) => {
    const levelMap: Record<string, string> = {
      'NATIONAL': '国家级',
      'PROVINCIAL': '省级',
      'MUNICIPAL': '市级',
      'COUNTY': '县级'
    }
    return levelMap[level] || level
  }

  const getLevelColor = (level: string) => {
    const colorMap: Record<string, string> = {
      'NATIONAL': 'red',
      'PROVINCIAL': 'orange',
      'MUNICIPAL': 'blue',
      'COUNTY': 'green'
    }
    return colorMap[level] || 'default'
  }

  // 解析联系方式JSON
  let contactInfo = null
  try {
    contactInfo = park.contact ? JSON.parse(park.contact) : null
  } catch (e) {
    console.error('解析联系方式失败:', e)
  }

  // 解析政策信息JSON
  let policiesInfo = null
  try {
    policiesInfo = park.policies ? JSON.parse(park.policies) : null
  } catch (e) {
    console.error('解析政策信息失败:', e)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/parks')}
            size="large"
          >
            返回园区列表
          </Button>
        </div>

        {/* 园区基本信息 */}
        <Card className="mb-6">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Space align="start" size="middle">
                    <Title level={2} className="mb-0">
                      {park.name}
                    </Title>
                    <Tag color={getLevelColor(park.level)} className="text-base px-3 py-1">
                      {getLevelLabel(park.level)}
                    </Tag>
                    <Tag className="text-base px-3 py-1">
                      {getTypeLabel(park.type)}
                    </Tag>
                  </Space>
                </div>

                <Space size="large" className="text-gray-600">
                  <span>
                    <EnvironmentOutlined className="mr-1" />
                    {park.province} {park.city} {park.district}
                  </span>
                  {park.establishedYear && (
                    <span>
                      <CalendarOutlined className="mr-1" />
                      成立于 {park.establishedYear}年
                    </span>
                  )}
                  {park.area && (
                    <span>
                      <TeamOutlined className="mr-1" />
                      面积 {park.area}km²
                    </span>
                  )}
                </Space>

                <Paragraph className="text-lg text-gray-700 leading-relaxed">
                  {park.description}
                </Paragraph>

                {/* 主导产业 */}
                {park.industries && (
                  <div>
                    <Title level={4}>主导产业</Title>
                    <Space wrap>
                      {park.industries.split(',').map((industry: string, index: number) => (
                        <Tag key={index} color="blue" className="text-base px-3 py-1">
                          {industry.trim()}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Text className="text-white text-xl font-semibold">
                  {park.name}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* 详细信息 */}
          <Col xs={24} lg={12}>
            <Card title="详细信息" className="h-full">
              <Descriptions column={1} size="middle">
                <Descriptions.Item label="园区名称">
                  {park.name}
                </Descriptions.Item>
                <Descriptions.Item label="园区类型">
                  {getTypeLabel(park.type)}
                </Descriptions.Item>
                <Descriptions.Item label="园区级别">
                  {getLevelLabel(park.level)}
                </Descriptions.Item>
                <Descriptions.Item label="所在地区">
                  {park.province} {park.city} {park.district}
                </Descriptions.Item>
                {park.address && (
                  <Descriptions.Item label="详细地址">
                    {park.address}
                  </Descriptions.Item>
                )}
                {park.establishedYear && (
                  <Descriptions.Item label="成立时间">
                    {park.establishedYear}年
                  </Descriptions.Item>
                )}
                {park.area && (
                  <Descriptions.Item label="园区面积">
                    {park.area} 平方公里
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>

          {/* 联系方式 */}
          <Col xs={24} lg={12}>
            <Card title="联系方式" className="h-full">
              {contactInfo ? (
                <Descriptions column={1} size="middle">
                  {contactInfo.phone && (
                    <Descriptions.Item label={<><PhoneOutlined /> 联系电话</>}>
                      <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                    </Descriptions.Item>
                  )}
                  {contactInfo.email && (
                    <Descriptions.Item label={<><MailOutlined /> 邮箱地址</>}>
                      <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                    </Descriptions.Item>
                  )}
                  {contactInfo.website && (
                    <Descriptions.Item label={<><GlobalOutlined /> 官方网站</>}>
                      <a href={contactInfo.website} target="_blank" rel="noopener noreferrer">
                        {contactInfo.website}
                      </a>
                    </Descriptions.Item>
                  )}
                  {contactInfo.address && (
                    <Descriptions.Item label={<><EnvironmentOutlined /> 联系地址</>}>
                      {contactInfo.address}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              ) : (
                <Text type="secondary">暂无联系方式信息</Text>
              )}
            </Card>
          </Col>

          {/* 优惠政策 */}
          {policiesInfo && (
            <Col xs={24}>
              <Card title="优惠政策">
                <Row gutter={[16, 16]}>
                  {Object.entries(policiesInfo).map(([key, value]) => (
                    <Col xs={24} sm={12} md={8} key={key}>
                      <Card size="small" className="h-full">
                        <Space direction="vertical" size="small">
                          <Text strong className="text-blue-600">
                            {key === 'tax' && '税收优惠'}
                            {key === 'talent' && '人才政策'}
                            {key === 'startup' && '创业扶持'}
                            {key === 'funding' && '资金支持'}
                            {key === 'housing' && '住房保障'}
                            {key === 'education' && '教育配套'}
                            {key === 'innovation' && '创新支持'}
                            {key === 'certification' && '认证服务'}
                            {!['tax', 'talent', 'startup', 'funding', 'housing', 'education', 'innovation', 'certification'].includes(key) && key}
                          </Text>
                          <Text>{value as string}</Text>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          )}
        </Row>

        {/* 操作按钮 */}
        <div className="text-center mt-8">
          <Space size="large">
            <Button type="primary" size="large">
              申请入驻
            </Button>
            <Button size="large">
              收藏园区
            </Button>
            <Button size="large">
              分享园区
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default ParkDetail