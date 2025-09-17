import React, { useState } from 'react'
import { 
  Card, 
  List, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Select, 
  Pagination,
  Empty,
  Spin,
  Avatar,
  Rate,
  Tooltip
} from 'antd'
import { 
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  StarOutlined,
  HeartFilled
} from '@ant-design/icons'

const { Text, Title } = Typography
const { Option } = Select

interface SearchResultItem {
  id: string
  title: string
  description: string
  type: string
  location?: string
  tags: string[]
  createdAt: string
  author?: string
  views?: number
  rating?: number
  isFavorited?: boolean
  budget?: string
  status?: string
  company?: string
  salary?: string
}

interface SearchResultsProps {
  data: SearchResultItem[]
  loading: boolean
  total: number
  current: number
  pageSize: number
  searchType: 'parks' | 'policies' | 'projects' | 'jobs'
  onPageChange: (page: number, size: number) => void
  onSortChange: (sortBy: string) => void
  onItemClick: (item: SearchResultItem) => void
  onFavorite: (itemId: string) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({
  data,
  loading,
  total,
  current,
  pageSize,
  searchType,
  onPageChange,
  onSortChange,
  onItemClick,
  onFavorite
}) => {
  const [sortBy, setSortBy] = useState('relevance')

  const handleSortChange = (value: string) => {
    setSortBy(value)
    onSortChange(value)
  }

  const getSortOptions = () => {
    const commonOptions = [
      { value: 'relevance', label: '相关度' },
      { value: 'date', label: '发布时间' },
      { value: 'views', label: '浏览量' }
    ]

    switch (searchType) {
      case 'parks':
        return [
          ...commonOptions,
          { value: 'area', label: '园区面积' },
          { value: 'rating', label: '评分' }
        ]
      case 'policies':
        return [
          ...commonOptions,
          { value: 'amount', label: '补贴金额' },
          { value: 'deadline', label: '截止时间' }
        ]
      case 'projects':
        return [
          ...commonOptions,
          { value: 'budget', label: '项目预算' },
          { value: 'deadline', label: '申报截止' }
        ]
      case 'jobs':
        return [
          ...commonOptions,
          { value: 'salary', label: '薪资' },
          { value: 'company', label: '公司规模' }
        ]
      default:
        return commonOptions
    }
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'ACTIVE': 'success',
      'RECRUITING': 'processing',
      'URGENT': 'error',
      'CLOSED': 'default',
      'PUBLISHED': 'blue',
      'DRAFT': 'orange'
    }
    return colorMap[status] || 'default'
  }

  const getStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      'ACTIVE': '招聘中',
      'RECRUITING': '招募中',
      'URGENT': '急招',
      'CLOSED': '已结束',
      'PUBLISHED': '已发布',
      'DRAFT': '草稿'
    }
    return labelMap[status] || status
  }

  const renderItemContent = (item: SearchResultItem) => {
    switch (searchType) {
      case 'parks':
        return (
          <div>
            <div className="flex justify-between items-start mb-2">
              <Title level={4} className="mb-0 cursor-pointer hover:text-blue-600" onClick={() => onItemClick(item)}>
                {item.title}
              </Title>
              <Space>
                {item.rating && (
                  <div className="flex items-center">
                    <Rate disabled defaultValue={item.rating} className="text-sm" />
                    <Text className="ml-1 text-sm">({item.rating})</Text>
                  </div>
                )}
                <Button 
                  type="text" 
                  icon={item.isFavorited ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                  onClick={() => onFavorite(item.id)}
                />
              </Space>
            </div>
            <Text type="secondary" className="block mb-2">{item.description}</Text>
            <div className="flex items-center space-x-4 mb-2">
              {item.location && (
                <Space size="small">
                  <EnvironmentOutlined />
                  <Text>{item.location}</Text>
                </Space>
              )}
              {item.budget && (
                <Text>面积: {item.budget}</Text>
              )}
              {item.views && (
                <Space size="small">
                  <EyeOutlined />
                  <Text>{item.views}</Text>
                </Space>
              )}
            </div>
          </div>
        )

      case 'policies':
        return (
          <div>
            <div className="flex justify-between items-start mb-2">
              <Title level={4} className="mb-0 cursor-pointer hover:text-blue-600" onClick={() => onItemClick(item)}>
                {item.title}
              </Title>
              <Space>
                {item.status && (
                  <Tag color={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Tag>
                )}
                <Button 
                  type="text" 
                  icon={item.isFavorited ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                  onClick={() => onFavorite(item.id)}
                />
              </Space>
            </div>
            <Text type="secondary" className="block mb-2">{item.description}</Text>
            <div className="flex items-center space-x-4 mb-2">
              <Space size="small">
                <CalendarOutlined />
                <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </Space>
              {item.budget && (
                <Text>补贴: {item.budget}</Text>
              )}
              {item.views && (
                <Space size="small">
                  <EyeOutlined />
                  <Text>{item.views}</Text>
                </Space>
              )}
            </div>
          </div>
        )

      case 'projects':
        return (
          <div>
            <div className="flex justify-between items-start mb-2">
              <Title level={4} className="mb-0 cursor-pointer hover:text-blue-600" onClick={() => onItemClick(item)}>
                {item.title}
              </Title>
              <Space>
                {item.status && (
                  <Tag color={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Tag>
                )}
                <Button 
                  type="text" 
                  icon={item.isFavorited ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                  onClick={() => onFavorite(item.id)}
                />
              </Space>
            </div>
            <Text type="secondary" className="block mb-2">{item.description}</Text>
            <div className="flex items-center space-x-4 mb-2">
              {item.location && (
                <Space size="small">
                  <EnvironmentOutlined />
                  <Text>{item.location}</Text>
                </Space>
              )}
              {item.budget && (
                <Text>预算: {item.budget}</Text>
              )}
              <Space size="small">
                <CalendarOutlined />
                <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </Space>
              {item.views && (
                <Space size="small">
                  <EyeOutlined />
                  <Text>{item.views}</Text>
                </Space>
              )}
            </div>
          </div>
        )

      case 'jobs':
        return (
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <Title level={4} className="mb-0 cursor-pointer hover:text-blue-600" onClick={() => onItemClick(item)}>
                  {item.title}
                </Title>
                {item.company && (
                  <Text type="secondary" className="block">{item.company}</Text>
                )}
              </div>
              <Space>
                {item.salary && (
                  <Text strong className="text-red-500">{item.salary}</Text>
                )}
                {item.status && (
                  <Tag color={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Tag>
                )}
                <Button 
                  type="text" 
                  icon={item.isFavorited ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                  onClick={() => onFavorite(item.id)}
                />
              </Space>
            </div>
            <Text type="secondary" className="block mb-2">{item.description}</Text>
            <div className="flex items-center space-x-4 mb-2">
              {item.location && (
                <Space size="small">
                  <EnvironmentOutlined />
                  <Text>{item.location}</Text>
                </Space>
              )}
              <Space size="small">
                <CalendarOutlined />
                <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </Space>
              {item.views && (
                <Space size="small">
                  <EyeOutlined />
                  <Text>{item.views}</Text>
                </Space>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <Spin size="large" />
          <div className="mt-4">
            <Text>正在搜索中...</Text>
          </div>
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <Empty
          description="暂无搜索结果"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    )
  }

  return (
    <div>
      {/* 搜索结果头部 */}
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <Text>共找到 <Text strong>{total}</Text> 条结果</Text>
          </div>
          <div className="flex items-center space-x-4">
            <Text>排序方式:</Text>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              style={{ width: 120 }}
            >
              {getSortOptions().map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* 搜索结果列表 */}
      <Card>
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="hover:bg-gray-50 p-4 rounded-lg transition-colors"
              actions={[
                <Button type="text" icon={<EyeOutlined />} onClick={() => onItemClick(item)}>
                  查看详情
                </Button>,
                <Button type="text" icon={<ShareAltOutlined />}>
                  分享
                </Button>
              ]}
            >
              {renderItemContent(item)}
              
              {/* 标签 */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-2">
                  <Space wrap>
                    {item.tags.map(tag => (
                      <Tag key={tag} color="blue">{tag}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </List.Item>
          )}
        />

        {/* 分页 */}
        <div className="mt-6 text-center">
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
            onChange={onPageChange}
          />
        </div>
      </Card>
    </div>
  )
}

export default SearchResults