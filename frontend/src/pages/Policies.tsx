import React, { useState } from 'react'
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
  Spin,
  DatePicker,
  Tooltip,
  Modal,
  Divider
} from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BankOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useGetPoliciesQuery } from '../services/api'

// 定义政策接口类型
interface Policy {
  id: string
  title: string
  summary: string
  content: string
  type: string
  level: string
  department: string
  publishDate: string
  effectiveDate: string
  expiryDate?: string
  tags?: string
  viewCount?: number
  status: 'PUBLISHED' | 'DRAFT'
}

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const Policies: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  // 移除未使用的变量
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const pageSize = 6

  // 使用API获取政策数据
  const queryParams: any = {
    search: searchText,
    type: selectedType,
    level: selectedLevel
  }
  
  if (dateRange?.[0]) {
    queryParams.startDate = dateRange[0].format('YYYY-MM-DD')
  }
  if (dateRange?.[1]) {
    queryParams.endDate = dateRange[1].format('YYYY-MM-DD')
  }
  
  const { data: policiesResponse, isLoading, error } = useGetPoliciesQuery(queryParams)

  const policies = policiesResponse?.data || []
  
  // 如果有API错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Title level={2}>政策资讯</Title>
            <Empty 
              description="加载政策信息失败，请稍后重试"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        </div>
      </div>
    )
  }
  
  // 过滤政策数据（这里可以添加客户端过滤逻辑）
  const filteredPolicies = policies

  const startIndex = (currentPage - 1) * pageSize
  const currentPolicies = filteredPolicies.slice(startIndex, startIndex + pageSize)

  const handleSearch = (value: string) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy)
    setIsModalVisible(true)
  }

  const getPolicyTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'TALENT': '人才政策',
      'STARTUP': '创业政策',
      'INNOVATION': '创新政策',
      'FUNDING': '资金政策',
      'TAX': '税收政策',
      'HOUSING': '住房政策',
      'EDUCATION': '教育政策',
      'HEALTHCARE': '医疗政策',
      'OTHER': '其他'
    }
    return typeMap[type] || type
  }

  const getPolicyLevelLabel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'NATIONAL': '国家级',
      'PROVINCIAL': '省级',
      'MUNICIPAL': '市级',
      'DISTRICT': '区级'
    }
    return levelMap[level] || level
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <Title level={2}>政策资讯</Title>
          <Paragraph className="text-gray-600 text-lg">
            及时了解最新人才政策，把握政策机遇
          </Paragraph>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="搜索政策标题或关键词"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="政策类型"
                allowClear
                style={{ width: '100%' }}
                value={selectedType}
                onChange={setSelectedType}
              >
                <Option value="TALENT">人才政策</Option>
                <Option value="STARTUP">创业政策</Option>
                <Option value="INNOVATION">创新政策</Option>
                <Option value="FUNDING">资金政策</Option>
                <Option value="TAX">税收政策</Option>
                <Option value="HOUSING">住房政策</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="政策级别"
                allowClear
                style={{ width: '100%' }}
                value={selectedLevel}
                onChange={setSelectedLevel}
              >
                <Option value="NATIONAL">国家级</Option>
                <Option value="PROVINCIAL">省级</Option>
                <Option value="MUNICIPAL">市级</Option>
                <Option value="DISTRICT">区级</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['开始日期', '结束日期']}
                value={dateRange}
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              />
            </Col>
          </Row>
        </Card>

        {/* 政策列表 */}
        <Spin spinning={isLoading}>
          {currentPolicies.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {currentPolicies.map((policy: Policy) => (
                  <Col xs={24} sm={12} lg={8} key={policy.id}>
                    <Card
                      hoverable
                      className="h-full"
                      actions={[
                        <Tooltip title="查看详情">
                          <EyeOutlined 
                            key="view" 
                            onClick={() => handleViewPolicy(policy)}
                          />
                        </Tooltip>,
                        <Tooltip title="收藏">
                          <HeartOutlined key="favorite" />
                        </Tooltip>,
                        <Tooltip title="分享">
                          <ShareAltOutlined key="share" />
                        </Tooltip>,
                      ]}
                    >
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Tag color="blue">
                            {getPolicyTypeLabel(policy.type)}
                          </Tag>
                          <Tag color="green">
                            {getPolicyLevelLabel(policy.level)}
                          </Tag>
                        </div>
                        
                        <Title level={5} className="mb-3 line-clamp-2">
                          {policy.title}
                        </Title>
                      </div>

                      <Space direction="vertical" size="small" className="w-full">
                        <div className="flex items-center text-sm text-gray-600">
                          <BankOutlined className="mr-1" />
                          <span className="truncate">{policy.department}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarOutlined className="mr-1" />
                          <span>发布: {policy.publishDate}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <FileTextOutlined className="mr-1" />
                          <span>生效: {policy.effectiveDate}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {policy.tags?.split(',').map((tag: string, index: number) => (
                            <Tag key={index} className="mb-1">
                              {tag.trim()}
                            </Tag>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                          <span className="flex items-center">
                            <EyeOutlined className="mr-1" />
                            {policy.viewCount || 0} 次浏览
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            policy.status === 'PUBLISHED' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {policy.status === 'PUBLISHED' ? '已发布' : '草稿'}
                          </span>
                        </div>
                      </Space>

                      <Button 
                        type="primary" 
                        block 
                        className="mt-4"
                        onClick={() => handleViewPolicy(policy)}
                      >
                        查看详情
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* 分页 */}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={filteredPolicies.length}
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
            <Empty 
              description="暂无政策信息"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Spin>

        {/* 政策详情模态框 */}
        <Modal
          title={selectedPolicy?.title}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              关闭
            </Button>
          ]}
          width={800}
        >
          {selectedPolicy && (
            <div>
              <Space className="mb-4">
                <Tag color="blue">
                  {getPolicyTypeLabel(selectedPolicy.type)}
                </Tag>
                <Tag color="green">
                  {getPolicyLevelLabel(selectedPolicy.level)}
                </Tag>
              </Space>
              
              <Divider />
              
              <div className="mb-4">
                <Text strong>发布部门：</Text>
                <Text>{selectedPolicy.department}</Text>
              </div>
              
              <div className="mb-4">
                <Text strong>发布日期：</Text>
                <Text>{selectedPolicy.publishDate}</Text>
              </div>
              
              <div className="mb-4">
                <Text strong>生效日期：</Text>
                <Text>{selectedPolicy.effectiveDate}</Text>
              </div>
              
              {selectedPolicy.expiryDate && (
                <div className="mb-4">
                  <Text strong>截止日期：</Text>
                  <Text>{selectedPolicy.expiryDate}</Text>
                </div>
              )}
              
              <Divider />
              
              <div className="mb-4">
                <Text strong>政策摘要：</Text>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {selectedPolicy.summary}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <Text strong>政策内容：</Text>
                <div className="mt-2 p-4 bg-white border rounded">
                  <div 
                    style={{ 
                      whiteSpace: 'pre-wrap', 
                      lineHeight: '1.8',
                      fontSize: '14px',
                      color: '#333'
                    }}
                    className="policy-content"
                  >
                    {selectedPolicy.content}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                <Text strong>标签：</Text>
                {selectedPolicy.tags?.split(',').map((tag: string, index: number) => (
                  <Tag key={index}>{tag.trim()}</Tag>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default Policies