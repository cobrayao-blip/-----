import React, { useState, useEffect } from 'react'
import { Typography, Card, Row, Col, Space, message, Divider, Spin, Button } from 'antd'
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  WechatOutlined,
  QqOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

interface ContactInfo {
  id: string
  type: 'phone' | 'email' | 'address' | 'hours' | 'department' | 'social' | 'location' | 'transport' | 'nearby'
  title: string
  content: string
  description?: string
  qrCode?: string
  order: number
  enabled: boolean
}

const Contact: React.FC = () => {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContactInfos()
  }, [])

  const fetchContactInfos = async () => {
    try {
      const response = await fetch('/api/content/contacts')
      const data = await response.json()
      console.log('获取到的联系信息数据:', data)
      if (data.success) {
        setContactInfos(data.data)
        console.log('社交媒体联系信息:', data.data.filter(info => info.type === 'social'))
      } else {
        message.error('获取联系信息失败')
      }
    } catch (error) {
      console.error('获取联系信息失败:', error)
      message.error('获取联系信息失败')
    } finally {
      setLoading(false)
    }
  }

  const getIconByType = (type: string) => {
    switch (type) {
      case 'phone':
        return <PhoneOutlined className="text-blue-500" />
      case 'email':
        return <MailOutlined className="text-green-500" />
      case 'address':
        return <EnvironmentOutlined className="text-red-500" />
      case 'hours':
        return <ClockCircleOutlined className="text-orange-500" />
      case 'department':
        return <PhoneOutlined className="text-purple-500" />
      case 'social':
        return <WechatOutlined className="text-green-600" />
      case 'location':
        return <EnvironmentOutlined className="text-blue-600" />
      case 'transport':
        return <EnvironmentOutlined className="text-indigo-500" />
      case 'nearby':
        return <EnvironmentOutlined className="text-teal-500" />
      default:
        return <PhoneOutlined className="text-gray-500" />
    }
  }


  // 按类型分组联系信息
  const getContactInfoByType = (type: string) => {
    return contactInfos.filter(info => info.type === type && info.enabled)
  }

  // 获取基本联系信息（电话、邮箱、地址、工作时间）
  const basicContactInfo = contactInfos.filter(info => 
    ['phone', 'email', 'address', 'hours'].includes(info.type) && info.enabled
  ).map(info => ({
    icon: getIconByType(info.type),
    title: info.title || '联系方式',
    content: info.content,
    description: info.description || ''
  }))

  // 获取部门联系信息
  const departmentContacts = getContactInfoByType('department')
  
  // 获取社交媒体信息
  const socialContacts = getContactInfoByType('social')
  
  // 获取位置相关信息
  const locationInfo = getContactInfoByType('location')
  const transportInfo = getContactInfoByType('transport')
  const nearbyInfo = getContactInfoByType('nearby')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4">
        {/* 页面标题 - 更紧凑 */}
        <div className="text-center mb-6">
          <Title level={2} className="mb-2">联系我们</Title>
          <Text className="text-gray-600">我们随时为您提供专业的服务支持</Text>
        </div>

        <Row gutter={[16, 16]}>
          {/* 主要联系信息 - 左侧 */}
          <Col xs={24} lg={14}>
            <Card title="联系方式" className="mb-4" bodyStyle={{ padding: '16px' }}>
              {basicContactInfo.length > 0 ? (
                <Row gutter={[12, 12]}>
                  {basicContactInfo.map((info, index) => (
                    <Col xs={12} sm={6} key={index}>
                      <div className="text-center p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="text-2xl mb-2">{info.icon}</div>
                        <Text strong className="block text-sm mb-1">{info.content}</Text>
                        <Text type="secondary" className="text-xs">{info.title}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-4">
                  <Text type="secondary">暂无联系信息</Text>
                </div>
              )}
            </Card>

            {/* 部门联系方式 - 合并到左侧 */}
            {departmentContacts.length > 0 && (
              <Card title="部门联系" bodyStyle={{ padding: '16px' }}>
                <Row gutter={[12, 12]}>
                  {departmentContacts.map((dept, index) => (
                    <Col xs={24} sm={12} key={dept.id}>
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <PhoneOutlined className="mr-2 text-blue-500" />
                          <div>
                            <Text strong className="block text-sm">{dept.title}</Text>
                            <Text className="text-sm">{dept.content}</Text>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}
          </Col>

          {/* 社交媒体和位置信息 - 右侧 */}
          <Col xs={24} lg={10}>
            {/* 社交媒体 */}
            {socialContacts.length > 0 && (
              <Card title="社交媒体" className="mb-4" bodyStyle={{ padding: '16px' }}>
                <Row gutter={[8, 8]}>
                  {socialContacts.map((social, index) => (
                    <Col xs={12} key={social.id}>
                      <div className="text-center p-3 border border-gray-200 rounded-lg">
                        {social.qrCode ? (
                          <div>
                            <img 
                              src={social.qrCode} 
                              alt={`${social.title}二维码`}
                              style={{ 
                                width: 80, 
                                height: 80, 
                                margin: '0 auto',
                                border: '1px solid #f0f0f0',
                                borderRadius: 4,
                                display: 'block'
                              }}
                              onError={(e) => {
                                console.error('图片加载失败:', social.qrCode);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <Text className="text-xs block mt-1">{social.title}</Text>
                          </div>
                        ) : (
                          <div>
                            <div className="text-xl mb-1">
                              {social.title.includes('微信') || social.title.includes('WeChat') ? 
                                <WechatOutlined className="text-green-600" /> : 
                                social.title.includes('QQ') ? 
                                <QqOutlined className="text-blue-600" /> : 
                                getIconByType(social.type)
                              }
                            </div>
                            <Text className="text-xs block">{social.title}</Text>
                            <Text className="text-xs">{social.content}</Text>
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            {/* 位置信息 */}
            <Card title="公司位置" bodyStyle={{ padding: '16px' }}>
              {/* 地址信息 */}
              {locationInfo.length > 0 && (
                <div className="mb-3">
                  {locationInfo.map((location) => (
                    <div key={location.id} className="mb-2">
                      <div className="flex items-start">
                        <EnvironmentOutlined className="mr-2 text-red-500 mt-1" />
                        <div>
                          <Text strong className="block text-sm">{location.title}</Text>
                          <Text className="text-sm">{location.content}</Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 交通指南 */}
              {transportInfo.length > 0 && (
                <div className="mb-3">
                  <Text strong className="block text-sm mb-2">交通指南</Text>
                  <div className="space-y-1">
                    {transportInfo.map((transport) => (
                      <div key={transport.id} className="text-sm">
                        <Text><strong>{transport.title}：</strong>{transport.content}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 周边设施 */}
              {nearbyInfo.length > 0 && (
                <div>
                  <Text strong className="block text-sm mb-2">周边设施</Text>
                  <div className="space-y-1">
                    {nearbyInfo.map((nearby) => (
                      <div key={nearby.id} className="text-sm">
                        <Text>• {nearby.content}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 显示提示信息，如果没有数据 */}
              {locationInfo.length === 0 && transportInfo.length === 0 && nearbyInfo.length === 0 && (
                <div className="text-center py-4">
                  <Text type="secondary" className="text-sm">暂无位置信息</Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Contact