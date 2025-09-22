import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Space, 
  Pagination,
  Empty,
  Spin
} from 'antd'
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { useGetParksQuery } from '../services/api'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select

// 模拟园区数据 - 暂时保留作为备用
/*
const mockParks = [
  {
    id: '1',
    name: '中关村科技园',
    type: 'TECH',
    level: 'NATIONAL',
    province: '北京市',
    city: '北京市',
    district: '海淀区',
    description: '中关村科技园是中国第一个国家级高新技术产业开发区，被誉为"中国硅谷"。园区聚集了众多高科技企业和科研院所，是创新创业的热土。',
    establishedYear: 1988,
    area: 488,
    industries: ['信息技术', '生物医药', '新材料', '新能源'],
    images: ['https://via.placeholder.com/400x300?text=园区图片'],
    contact: {
      phone: '010-88888888',
      email: 'contact@zgc.gov.cn',
      address: '北京市海淀区中关村大街1号'
    }
  },
  {
    id: '2',
    name: '张江高科技园区',
    type: 'HIGH_TECH',
    level: 'NATIONAL',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    description: '张江高科技园区是上海建设具有全球影响力的科技创新中心的核心承载区，重点发展集成电路、生物医药、人工智能等战略性新兴产业。',
    establishedYear: 1992,
    area: 25.65,
    industries: ['集成电路', '生物医药', '人工智能', '软件信息'],
    images: ['https://via.placeholder.com/400x300?text=张江高科技园区'],
    contact: {
      phone: '021-50278888',
      email: 'info@zjpark.com',
      address: '上海市浦东新区张江路239号'
    }
  },
  {
    id: '3',
    name: '深圳高新技术产业园区',
    type: 'HIGH_TECH',
    level: 'NATIONAL',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    description: '深圳高新区是中国首批国家级高新技术产业开发区之一，以电子信息产业为主导，是华为、腾讯等知名企业的发源地。',
    establishedYear: 1996,
    area: 11.5,
    industries: ['电子信息', '互联网', '新材料', '生物技术'],
    images: ['https://via.placeholder.com/400x300?text=深圳高新区'],
    contact: {
      phone: '0755-26551234',
      email: 'service@szhitech.gov.cn',
      address: '深圳市南山区高新中一道9号'
    }
  }
]
*/

const Parks: React.FC = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 6

  // 使用API获取园区数据
  const { data: parksResponse, isLoading } = useGetParksQuery({
    search: searchText,
    type: selectedType,
    province: selectedProvince
  })

  const parks = parksResponse?.data || []
  
  // 过滤园区数据
  const filteredParks = parks.filter((park: any) => {
    const matchesLevel = !selectedLevel || park.level === selectedLevel
    return matchesLevel
  })

  const startIndex = (currentPage - 1) * pageSize
  const currentParks = filteredParks.slice(startIndex, startIndex + pageSize)

  const handleSearch = (value: string) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'HIGH_TECH': '高新技术园区',
      'INDUSTRIAL': '工业园区',
      'ECONOMIC': '经济开发区',
      'SCIENCE': '科技园区',
      'CULTURAL': '文化创意园区',
      'LOGISTICS': '物流园区',
      'AGRICULTURAL': '农业园区',
      'TECH': '科技园区',
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
      'DISTRICT': '区级',
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <Title level={2}>产业园区</Title>
          <Paragraph className="text-gray-600 text-lg">
            发现全国优质产业园区，寻找最适合的发展平台
          </Paragraph>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索园区名称或描述"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="园区类型"
                allowClear
                size="large"
                className="w-full"
                value={selectedType}
                onChange={(value) => {
                  setSelectedType(value)
                  handleFilterChange()
                }}
              >
                <Option value="TECH">科技园区</Option>
                <Option value="HIGH_TECH">高新技术开发区</Option>
                <Option value="INDUSTRIAL">工业园区</Option>
                <Option value="ECONOMIC">经济开发区</Option>
                <Option value="BONDED">保税区</Option>
                <Option value="OTHER">其他</Option>
              </Select>
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="园区级别"
                allowClear
                size="large"
                className="w-full"
                value={selectedLevel}
                onChange={(value) => {
                  setSelectedLevel(value)
                  handleFilterChange()
                }}
              >
                <Option value="NATIONAL">国家级</Option>
                <Option value="PROVINCIAL">省级</Option>
                <Option value="MUNICIPAL">市级</Option>
                <Option value="COUNTY">县级</Option>
              </Select>
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="所在省份"
                allowClear
                size="large"
                className="w-full"
                value={selectedProvince}
                onChange={(value) => {
                  setSelectedProvince(value)
                  handleFilterChange()
                }}
              >
                <Option value="北京市">北京市</Option>
                <Option value="上海市">上海市</Option>
                <Option value="广东省">广东省</Option>
                <Option value="江苏省">江苏省</Option>
                <Option value="浙江省">浙江省</Option>
              </Select>
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Button 
                size="large" 
                onClick={() => {
                  setSearchText('')
                  setSelectedType('')
                  setSelectedLevel('')
                  setSelectedProvince('')
                  setCurrentPage(1)
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 园区列表 */}
        <Spin spinning={isLoading}>
          {currentParks.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {currentParks.map((park) => (
                  <Col xs={24} md={12} lg={8} key={park.id}>
                    <Card
                      hoverable
                      className="h-full"
                      cover={
                        <div className="h-16 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center p-2">
                          <Text 
                            className="text-white text-lg font-semibold text-center leading-tight"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                              margin: 0,
                              padding: 0
                            }}
                          >
                            {park.name}
                          </Text>
                        </div>
                      }
                      actions={[
                        <Button 
                          type="link" 
                          key="detail"
                          onClick={() => navigate(`/parks/${park.id}`)}
                        >
                          查看详情
                        </Button>,
                        <Button type="link" key="contact">
                          联系咨询
                        </Button>
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Space direction="vertical" size="small" className="w-full">
                            <div className="flex justify-between items-start">
                              <Text strong className="text-lg">
                                {park.name}
                              </Text>
                              <Tag color={getLevelColor(park.level)}>
                                {getLevelLabel(park.level)}
                              </Tag>
                            </div>
                            <Space size="small">
                              <Tag>{getTypeLabel(park.type)}</Tag>
                              <Text type="secondary" className="text-sm">
                                <EnvironmentOutlined /> {park.province} {park.city}
                              </Text>
                            </Space>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size="small" className="w-full">
                            <Paragraph 
                              ellipsis={{ rows: 3 }} 
                              className="text-gray-600 mb-2"
                            >
                              {park.description}
                            </Paragraph>
                            
                            <div>
                              <Text strong className="text-sm">主导产业：</Text>
                              <div className="mt-1">
                                {park.industries?.split(',').map((industry: string, index: number) => (
                                  <Tag key={index} className="mb-1">
                                    {industry.trim()}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                            
                            <Space className="text-sm text-gray-500">
                              <span>
                                <CalendarOutlined /> 成立于 {park.establishedYear}年
                              </span>
                              <span>
                                <TeamOutlined /> 面积 {park.area}km²
                              </span>
                            </Space>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* 分页 */}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={filteredParks.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Empty
                description="暂无符合条件的园区"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => {
                  setSearchText('')
                  setSelectedType('')
                  setSelectedLevel('')
                  setSelectedProvince('')
                  setCurrentPage(1)
                }}>
                  重置筛选条件
                </Button>
              </Empty>
            </div>
          )}
        </Spin>
      </div>
    </div>
  )
}

export default Parks