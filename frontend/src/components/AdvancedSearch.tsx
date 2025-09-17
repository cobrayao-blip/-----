import React, { useState } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Collapse, 
  Slider, 
  DatePicker, 
  Checkbox,
  Tag,
  Divider,
  Typography
} from 'antd'
import { 
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons'

const { Option } = Select
const { RangePicker } = DatePicker
const { Panel } = Collapse
const { Text } = Typography

interface SearchFilters {
  keyword?: string
  type?: string
  location?: string
  industry?: string[]
  budget?: [number, number]
  dateRange?: [string, string]
  status?: string
  tags?: string[]
}

interface AdvancedSearchProps {
  searchType: 'parks' | 'policies' | 'projects' | 'jobs'
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ 
  searchType, 
  onSearch, 
  onReset 
}) => {
  const [form] = Form.useForm()
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 根据搜索类型定义不同的选项
  const getSearchOptions = () => {
    switch (searchType) {
      case 'parks':
        return {
          industries: [
            '人工智能', '生物医药', '新能源', '新材料', 
            '电子信息', '高端装备', '节能环保', '数字经济'
          ],
          locations: [
            '北京市', '上海市', '深圳市', '杭州市', 
            '成都市', '西安市', '武汉市', '南京市'
          ],
          budgetRange: [0, 1000], // 面积范围
          budgetLabel: '园区面积(平方公里)'
        }
      case 'policies':
        return {
          industries: [
            '人才引进', '创业扶持', '税收优惠', '资金补贴',
            '住房保障', '子女教育', '医疗保障', '科研支持'
          ],
          locations: [
            '国家级', '省级', '市级', '区县级'
          ],
          budgetRange: [0, 1000], // 补贴金额范围
          budgetLabel: '补贴金额(万元)'
        }
      case 'projects':
        return {
          industries: [
            '人工智能', '生物医药', '新能源', '新材料',
            '电子信息', '高端装备', '现代农业', '数字经济'
          ],
          locations: [
            '北京市', '上海市', '深圳市', '杭州市',
            '成都市', '西安市', '武汉市', '南京市'
          ],
          budgetRange: [0, 5000], // 项目预算范围
          budgetLabel: '项目预算(万元)'
        }
      case 'jobs':
        return {
          industries: [
            '技术研发', '产品管理', '市场营销', '人力资源',
            '财务会计', '运营管理', '设计创意', '销售业务'
          ],
          locations: [
            '北京市', '上海市', '深圳市', '杭州市',
            '成都市', '西安市', '武汉市', '南京市'
          ],
          budgetRange: [5, 100], // 薪资范围
          budgetLabel: '薪资范围(K)'
        }
      default:
        return {
          industries: [],
          locations: [],
          budgetRange: [0, 100],
          budgetLabel: '范围'
        }
    }
  }

  const options = getSearchOptions()

  const handleSearch = () => {
    const values = form.getFieldsValue()
    const filters: SearchFilters = {
      ...values,
      tags: selectedTags
    }
    onSearch(filters)
  }

  const handleReset = () => {
    form.resetFields()
    setSelectedTags([])
    onReset()
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked 
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag)
    setSelectedTags(newTags)
  }

  const renderBasicSearch = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Form.Item name="keyword" className="mb-0">
        <Input 
          placeholder={`搜索${searchType === 'parks' ? '园区' : searchType === 'policies' ? '政策' : searchType === 'projects' ? '项目' : '职位'}名称`}
          prefix={<SearchOutlined />}
        />
      </Form.Item>
      
      <Form.Item name="location" className="mb-0">
        <Select placeholder="选择地区" allowClear>
          {options.locations.map(location => (
            <Option key={location} value={location}>{location}</Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item name="industry" className="mb-0">
        <Select 
          placeholder={`选择${searchType === 'parks' ? '产业' : searchType === 'policies' ? '类型' : searchType === 'projects' ? '领域' : '职能'}`}
          mode="multiple"
          allowClear
        >
          {options.industries.map(industry => (
            <Option key={industry} value={industry}>{industry}</Option>
          ))}
        </Select>
      </Form.Item>
      
      <div className="flex space-x-2">
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
        <Button icon={<ClearOutlined />} onClick={handleReset}>
          重置
        </Button>
        <Button 
          type="text" 
          icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '收起' : '展开'}
        </Button>
      </div>
    </div>
  )

  const renderAdvancedSearch = () => (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 预算/薪资范围 */}
        <div>
          <Text strong className="block mb-2">{options.budgetLabel}</Text>
          <Form.Item name="budget" className="mb-0">
            <Slider
              range
              min={options.budgetRange[0]}
              max={options.budgetRange[1]}
              marks={{
                [options.budgetRange[0]]: options.budgetRange[0],
                [options.budgetRange[1]]: options.budgetRange[1]
              }}
            />
          </Form.Item>
        </div>

        {/* 时间范围 */}
        <div>
          <Text strong className="block mb-2">时间范围</Text>
          <Form.Item name="dateRange" className="mb-0">
            <RangePicker className="w-full" />
          </Form.Item>
        </div>

        {/* 状态筛选 */}
        {(searchType === 'projects' || searchType === 'jobs') && (
          <div>
            <Text strong className="block mb-2">状态</Text>
            <Form.Item name="status" className="mb-0">
              <Select placeholder="选择状态" allowClear>
                {searchType === 'projects' ? (
                  <>
                    <Option value="PUBLISHED">已发布</Option>
                    <Option value="RECRUITING">招募中</Option>
                    <Option value="CLOSED">已结束</Option>
                  </>
                ) : (
                  <>
                    <Option value="ACTIVE">招聘中</Option>
                    <Option value="URGENT">急招</Option>
                    <Option value="CLOSED">已结束</Option>
                  </>
                )}
              </Select>
            </Form.Item>
          </div>
        )}
      </div>

      {/* 标签筛选 */}
      <div className="mt-4">
        <Text strong className="block mb-2">热门标签</Text>
        <div className="flex flex-wrap gap-2">
          {options.industries.slice(0, 8).map(tag => (
            <Checkbox
              key={tag}
              checked={selectedTags.includes(tag)}
              onChange={(e) => handleTagChange(tag, e.target.checked)}
            >
              {tag}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* 已选标签 */}
      {selectedTags.length > 0 && (
        <div className="mt-4">
          <Text strong className="block mb-2">已选标签</Text>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Tag
                key={tag}
                closable
                onClose={() => handleTagChange(tag, false)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <Card className="mb-6">
      <Form form={form} layout="vertical">
        {renderBasicSearch()}
        {isExpanded && renderAdvancedSearch()}
      </Form>
    </Card>
  )
}

export default AdvancedSearch