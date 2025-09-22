import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Space, 
  Avatar,
  Spin,
  Empty,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Checkbox,
  Upload,
  message
} from 'antd'
import { 
  ArrowLeftOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  BankOutlined,
  UserOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useGetJobByIdQuery, useApplyJobMutation } from '../store/api/jobApi'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [form] = Form.useForm()

  const { data: jobResponse, isLoading, error } = useGetJobByIdQuery(id!)
  const [applyJob, { isLoading: isApplying }] = useApplyJobMutation()

  const job = jobResponse?.data

  const handleApply = async (values: any) => {
    if (!job) {
      message.error('职位信息不存在')
      return
    }

    try {
      const applyData = {
        jobId: job.id,
        coverLetter: values.coverLetter,
        expectedSalary: values.expectedSalary?.toString(),
        availableDate: values.availableDate?.format('YYYY-MM-DD'),
        includeResume: values.includeResume,
        additionalDocs: values.attachments || []
      }

      await applyJob(applyData).unwrap()
      message.success('申请提交成功！')
      setIsModalVisible(false)
      form.resetFields()
    } catch (error: any) {
      console.error('申请失败:', error)
      const errorMessage = error?.data?.message || '申请失败，请重试'
      message.error(errorMessage)
    }
  }

  const getJobTypeText = (type: string) => {
    if (!type) return '未知'
    
    // 如果已经是中文，直接返回
    if (type.includes('全职') || type.includes('兼职') || type.includes('合同') || type.includes('实习') || type.includes('远程')) {
      return type
    }
    
    const typeMap: { [key: string]: string } = {
      'FULL_TIME': '全职',
      'PART_TIME': '兼职',
      'CONTRACT': '合同工',
      'INTERNSHIP': '实习',
      'REMOTE': '远程'
    }
    return typeMap[type] || type
  }

  const getLevelText = (level: string) => {
    if (!level) return '未知'
    
    // 如果已经是中文，直接返回
    if (level.includes('级') || level.includes('管') || level.includes('总监') || level.includes('高管')) {
      return level
    }
    
    const levelMap: { [key: string]: string } = {
      'ENTRY': '入门级',
      'JUNIOR': '初级',
      'MID': '中级',
      'SENIOR': '高级',
      'LEAD': '技术负责人',
      'MANAGER': '管理岗',
      'DIRECTOR': '总监',
      'EXECUTIVE': '高管'
    }
    return levelMap[level] || level
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Empty description="职位信息不存在" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 返回按钮 */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/jobs')}
          className="mb-4"
        >
          返回职位列表
        </Button>

        {/* 职位基本信息 */}
        <Card className="mb-6">
          <div className="flex items-start mb-6">
            <Avatar 
              size={80} 
              className="mr-4 flex-shrink-0"
            >
              {job.company?.[0]}
            </Avatar>
            <div className="flex-1">
              <Title level={2} className="mb-2">
                {job.title}
              </Title>
              <div className="flex items-center mb-2">
                <BankOutlined className="mr-2 text-gray-500" />
                <Text className="text-lg">{job.company}</Text>
              </div>
              <Space wrap>
                <Tag color="blue">{getJobTypeText(job.type)}</Tag>
                <Tag color="green">{getLevelText(job.level)}</Tag>
                {job.department && <Tag>{job.department}</Tag>}
              </Space>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-500 mb-2">
                {job.salary || '面议'}
              </div>
              <Button 
                type="primary" 
                size="large"
                onClick={() => setIsModalVisible(true)}
              >
                立即申请
              </Button>
            </div>
          </div>

          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div className="flex items-center">
                <EnvironmentOutlined className="mr-2 text-gray-500" />
                <span>{job.location}</span>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="flex items-center">
                <CalendarOutlined className="mr-2 text-gray-500" />
                <span>{new Date(job.publishDate || job.createdAt).toLocaleDateString()}</span>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="flex items-center">
                <TeamOutlined className="mr-2 text-gray-500" />
                <span>招聘职位</span>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="flex items-center">
                <EyeOutlined className="mr-2 text-gray-500" />
                <span>浏览 {job.viewCount || 0} 次</span>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* 职位描述 */}
            <Card title="职位描述" className="mb-6">
              <Paragraph>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {job.description}
                </div>
              </Paragraph>
            </Card>

            {/* 任职要求 */}
            {job.requirements && (
              <Card title="任职要求" className="mb-6">
                <Paragraph>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {job.requirements}
                  </div>
                </Paragraph>
              </Card>
            )}

            {/* 福利待遇 */}
            {job.benefits && (
              <Card title="福利待遇" className="mb-6">
                <Paragraph>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {job.benefits}
                  </div>
                </Paragraph>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            {/* 联系信息 */}
            {job.contact && (
              <Card title="联系方式" className="mb-6">
                <Space direction="vertical" className="w-full">
                  <div className="flex items-center">
                    <UserOutlined className="mr-2 text-gray-500" />
                    <span>{typeof job.contact === 'string' ? job.contact : JSON.stringify(job.contact)}</span>
                  </div>
                </Space>
              </Card>
            )}

            {/* 公司信息 */}
            <Card title="公司信息" className="mb-6">
              <Space direction="vertical" className="w-full">
                <div>
                  <Text strong>公司名称：</Text>
                  <Text>{job.company}</Text>
                </div>
                {job.industry && (
                  <div>
                    <Text strong>所属行业：</Text>
                    <Text>{job.industry}</Text>
                  </div>
                )}
                <div>
                  <Text strong>工作地点：</Text>
                  <Text>{job.location}</Text>
                </div>
                {job.companySize && (
                  <div>
                    <Text strong>公司规模：</Text>
                    <Text>{job.companySize}</Text>
                  </div>
                )}
                {job.validUntil && (
                  <div>
                    <Text strong>有效期至：</Text>
                    <Text>{new Date(job.validUntil).toLocaleDateString()}</Text>
                  </div>
                )}
              </Space>
            </Card>

            {/* 其他职位 */}
            <Card title="相关职位" size="small">
              <Text type="secondary">暂无相关职位</Text>
            </Card>
          </Col>
        </Row>

        {/* 申请职位模态框 */}
        <Modal
          title={`申请职位 - ${job.title}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
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
                <Button onClick={() => {
                  setIsModalVisible(false)
                  form.resetFields()
                }}>
                  取消
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={isApplying}
                >
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

export default JobDetail