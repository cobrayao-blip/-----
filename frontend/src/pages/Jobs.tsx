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
  Avatar,
  Tooltip,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Checkbox,
  Upload,
  message
} from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  TeamOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { useGetJobsQuery } from '../services/api'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select
const { TextArea } = Input

const Jobs: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [selectedJobType, setSelectedJobType] = useState<string>('')
  const [selectedExperience, setSelectedExperience] = useState<string>('')
  const [selectedLocation] = useState<string>('')
  const [salaryRange, setSalaryRange] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const pageSize = 8

  // 解析薪资范围
  const [salaryMin, salaryMax] = salaryRange ? salaryRange.split('-').map(Number) : [undefined, undefined]

  // 使用API获取职位数据
  const { data: jobsResponse, isLoading } = useGetJobsQuery({
    search: searchText,
    location: selectedLocation,
    salaryMin,
    salaryMax,
    experience: selectedExperience,
    type: selectedJobType
  })

  const jobs = jobsResponse?.data || []
  
  // 过滤职位数据
  const filteredJobs = jobs.filter((job: any) => {
    const matchesIndustry = !selectedIndustry || job.industry === selectedIndustry
    return matchesIndustry
  })

  const startIndex = (currentPage - 1) * pageSize
  const currentJobs = filteredJobs.slice(startIndex, startIndex + pageSize)

  const handleSearch = (value: string) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  const handleApply = async () => {
    try {
      message.success('申请提交成功！')
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('申请失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <Title level={2}>招聘求职</Title>
          <Paragraph className="text-gray-600 text-lg">
            发现理想工作机会，寻找优秀人才
          </Paragraph>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索职位、公司或技能"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="行业"
                allowClear
                style={{ width: '100%' }}
                value={selectedIndustry}
                onChange={setSelectedIndustry}
              >
                <Option value="TECH">科技</Option>
                <Option value="FINANCE">金融</Option>
                <Option value="EDUCATION">教育</Option>
                <Option value="HEALTHCARE">医疗</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="工作类型"
                allowClear
                style={{ width: '100%' }}
                value={selectedJobType}
                onChange={setSelectedJobType}
              >
                <Option value="FULL_TIME">全职</Option>
                <Option value="PART_TIME">兼职</Option>
                <Option value="CONTRACT">合同</Option>
                <Option value="INTERNSHIP">实习</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="经验要求"
                allowClear
                style={{ width: '100%' }}
                value={selectedExperience}
                onChange={setSelectedExperience}
              >
                <Option value="ENTRY">应届生</Option>
                <Option value="JUNIOR">1-3年</Option>
                <Option value="MID">3-5年</Option>
                <Option value="SENIOR">5年以上</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="薪资范围"
                allowClear
                style={{ width: '100%' }}
                value={salaryRange}
                onChange={setSalaryRange}
              >
                <Option value="5000-10000">5K-10K</Option>
                <Option value="10000-20000">10K-20K</Option>
                <Option value="20000-30000">20K-30K</Option>
                <Option value="30000-50000">30K-50K</Option>
                <Option value="50000-100000">50K以上</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* 职位列表 */}
        <Spin spinning={isLoading}>
          {currentJobs.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {currentJobs.map((job: any) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={job.id}>
                    <Card
                      hoverable
                      className="h-full"
                      actions={[
                        <Tooltip title="查看详情">
                          <EyeOutlined key="view" />
                        </Tooltip>,
                        <Tooltip title="收藏">
                          <HeartOutlined key="favorite" />
                        </Tooltip>,
                        <Tooltip title="分享">
                          <ShareAltOutlined key="share" />
                        </Tooltip>,
                      ]}
                    >
                      <div className="flex items-start mb-3">
                        <Avatar 
                          src={job.companyLogo} 
                          size={48} 
                          className="mr-3 flex-shrink-0"
                        >
                          {job.company?.[0]}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <Title level={5} className="mb-1 truncate">
                            {job.title}
                          </Title>
                          <Text type="secondary" className="text-sm">
                            {job.company}
                          </Text>
                        </div>
                      </div>

                      <Space direction="vertical" size="small" className="w-full">
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvironmentOutlined className="mr-1" />
                          <span>{job.location}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarOutlined className="mr-1" />
                          <span className="font-medium text-red-500">
                            {job.salaryMin && job.salaryMax 
                              ? `${job.salaryMin/1000}K-${job.salaryMax/1000}K`
                              : '面议'
                            }
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <TeamOutlined className="mr-1" />
                          <span>{job.experience}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.skills?.slice(0, 3).map((skill: string, index: number) => (
                            <Tag key={index} className="text-xs">
                              {skill}
                            </Tag>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                          <span className="flex items-center">
                            <CalendarOutlined className="mr-1" />
                            {job.publishDate}
                          </span>
                          <span className="flex items-center">
                            <EyeOutlined className="mr-1" />
                            {job.viewCount || 0}
                          </span>
                        </div>
                      </Space>

                      <Button 
                        type="primary" 
                        block 
                        className="mt-4"
                        onClick={() => setIsModalVisible(true)}
                      >
                        立即申请
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* 分页 */}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={filteredJobs.length}
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
              description="暂无职位信息"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Spin>

        {/* 申请职位模态框 */}
        <Modal
          title="申请职位"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleApply}
          >
            <Form.Item
              name="coverLetter"
              label="求职信"
              rules={[{ required: true, message: '请填写求职信' }]}
            >
              <TextArea
                rows={6}
                placeholder="请简要介绍您的背景和为什么适合这个职位..."
              />
            </Form.Item>

            <Form.Item
              name="expectedSalary"
              label="期望薪资 (元/月)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入期望薪资"
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>

            <Form.Item
              name="availableDate"
              label="可入职时间"
            >
              <DatePicker 
                style={{ width: '100%' }}
                placeholder="请选择可入职时间"
              />
            </Form.Item>

            <Form.Item name="includeResume" valuePropName="checked">
              <Checkbox>
                包含我的简历信息
              </Checkbox>
              <div className="text-sm text-gray-500 mt-1">
                勾选后将自动附上您的完整简历信息
              </div>
            </Form.Item>

            <Form.Item
              name="attachments"
              label="附加文件"
            >
              <Upload
                multiple
                beforeUpload={() => false}
                onChange={(info) => {
                  const fileList = info.fileList.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                  }))
                  form.setFieldsValue({ attachments: fileList })
                }}
              >
                <Button icon={<UploadOutlined />}>
                  上传附件
                </Button>
              </Upload>
              <div className="text-sm text-gray-500 mt-1">
                支持上传简历、作品集、证书等文件，单个文件不超过10MB
              </div>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  提交申请
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default Jobs