import React, { useState } from 'react'
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input,
  Select,
  Modal,
  Form,
  message,
  Tabs,
  Switch,
  InputNumber,
  Popconfirm,
  Rate
} from 'antd'
import { 
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  PhoneOutlined,
  MessageOutlined
} from '@ant-design/icons'

const { Title } = Typography
const { Search } = Input
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

interface GuideContent {
  id: string
  category: 'register' | 'park' | 'policy' | 'project' | 'general'
  title: string
  content: string
  steps?: string[]
  order: number
  enabled: boolean
  updatedAt: string
}

interface FAQContent {
  id: string
  category: 'account' | 'park' | 'policy' | 'project' | 'payment' | 'general'
  question: string
  answer: string
  order: number
  enabled: boolean
  views: number
  updatedAt: string
}

interface ContactInfo {
  id: string
  type: 'phone' | 'email' | 'address' | 'hours' | 'department'
  title: string
  content: string
  description?: string
  order: number
  enabled: boolean
  updatedAt: string
}

interface FeedbackItem {
  id: string
  type: 'bug' | 'suggestion' | 'praise' | 'complaint' | 'other'
  title: string
  content: string
  contact: string
  rating: number
  status: 'pending' | 'processing' | 'resolved' | 'closed'
  response?: string
  createdAt: string
  updatedAt: string
}

const PageContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('guide')
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  // 模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  
  const [form] = Form.useForm()

  // 使用指南数据
  const guideContents: GuideContent[] = [
    {
      id: '1',
      category: 'register',
      title: '新用户注册指南',
      content: '详细的用户注册流程说明，包括注册步骤、注意事项等。',
      steps: ['点击注册按钮', '填写基本信息', '验证手机号', '完成注册'],
      order: 1,
      enabled: true,
      updatedAt: '2024-01-10 10:30:00'
    },
    {
      id: '2',
      category: 'park',
      title: '园区服务使用指南',
      content: '如何使用园区服务的详细说明，包括申请流程、审核标准等。',
      steps: ['浏览园区信息', '选择合适园区', '提交申请', '等待审核'],
      order: 2,
      enabled: true,
      updatedAt: '2024-01-10 10:30:00'
    },
    {
      id: '3',
      category: 'policy',
      title: '政策咨询指南',
      content: '政策查询和申请的详细流程说明。',
      order: 3,
      enabled: true,
      updatedAt: '2024-01-10 10:30:00'
    }
  ]

  // 常见问题数据
  const faqContents: FAQContent[] = [
    {
      id: '1',
      category: 'account',
      question: '如何注册逍遥人才网账户？',
      answer: '您可以点击页面右上角的"立即注册"按钮，填写手机号码获取验证码，设置密码后完善个人信息即可完成注册。注册过程简单快捷，通常只需要3-5分钟。',
      order: 1,
      enabled: true,
      views: 1250,
      updatedAt: '2024-01-10 10:30:00'
    },
    {
      id: '2',
      category: 'park',
      question: '如何申请入驻园区？',
      answer: '浏览园区列表，选择合适的园区后点击"申请入驻"，填写企业基本信息、业务范围、预期入驻时间等，上传相关资质文件后提交申请。园区方会在5个工作日内回复。',
      order: 2,
      enabled: true,
      views: 890,
      updatedAt: '2024-01-10 10:30:00'
    },
    {
      id: '3',
      category: 'policy',
      question: '政策申请需要什么材料？',
      answer: '不同政策需要的材料不同，一般包括：身份证明、学历证明、工作证明、企业营业执照、项目计划书等。具体材料清单请查看各政策的详细说明。',
      order: 3,
      enabled: true,
      views: 650,
      updatedAt: '2024-01-10 10:30:00'
    }
  ]

  // 联系信息数据
  const contactInfos: ContactInfo[] = [
    {
      id: '1',
      type: 'phone',
      title: '客服热线',
      content: '400-888-8888',
      description: '7×24小时服务热线',
      order: 1,
      enabled: true,
      updatedAt: '2024-01-10 10:30:00'
    },
    {
      id: '2',
      type: 'email',
      title: '邮箱地址',
      content: 'contact@xiaoyao.com',
      description: '商务合作与意见建议',
      order: 2,
      enabled: true,
      updatedAt: '2024-01-10 10:30:00'
    },
    {
      id: '3',
      type: 'address',
      title: '公司地址',
      content: '北京市海淀区中关村科技园',
      description: '欢迎预约实地参观',
      order: 3,
      enabled: true,
      updatedAt: '2024-01-10 10:30:00'
    }
  ]

  // 意见反馈数据
  const feedbackItems: FeedbackItem[] = [
    {
      id: '1',
      type: 'suggestion',
      title: '希望增加移动端APP',
      content: '建议开发移动端应用，方便用户随时查看信息和提交申请。',
      contact: '138****8888',
      rating: 5,
      status: 'processing',
      response: '感谢建议，移动端APP正在开发中，预计3月上线。',
      createdAt: '2024-01-15 14:30:00',
      updatedAt: '2024-01-16 09:15:00'
    },
    {
      id: '2',
      type: 'bug',
      title: '搜索功能偶尔无响应',
      content: '在使用搜索功能时，偶尔会出现无响应的情况，需要刷新页面才能正常使用。',
      contact: 'user@example.com',
      rating: 3,
      status: 'resolved',
      response: '问题已定位并修复，感谢您的反馈。',
      createdAt: '2024-01-12 16:45:00',
      updatedAt: '2024-01-13 10:20:00'
    }
  ]

  // 处理函数
  const handleCreate = (type: string) => {
    setSelectedItem(null)
    setModalType('create')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setModalType('edit')
    form.setFieldsValue(item)
    setIsModalVisible(true)
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setModalType('view')
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    message.success('删除成功')
  }

  const handleToggleEnabled = (id: string, enabled: boolean) => {
    message.success(enabled ? '已启用' : '已禁用')
  }

  const handleModalOk = async () => {
    if (modalType === 'view') {
      setIsModalVisible(false)
      return
    }

    try {
      const values = await form.validateFields()
      if (modalType === 'create') {
        message.success('创建成功')
      } else {
        message.success('更新成功')
      }
      setIsModalVisible(false)
    } catch (error) {
      message.error('请完善必填信息')
    }
  }

  // 获取分类选项
  const getCategoryOptions = (type: string) => {
    switch (type) {
      case 'guide':
        return [
          { value: 'register', label: '注册指南' },
          { value: 'park', label: '园区服务' },
          { value: 'policy', label: '政策咨询' },
          { value: 'project', label: '项目申报' },
          { value: 'general', label: '通用指南' }
        ]
      case 'faq':
        return [
          { value: 'account', label: '账户相关' },
          { value: 'park', label: '园区服务' },
          { value: 'policy', label: '政策咨询' },
          { value: 'project', label: '项目申报' },
          { value: 'payment', label: '费用相关' },
          { value: 'general', label: '其他问题' }
        ]
      case 'contact':
        return [
          { value: 'phone', label: '电话' },
          { value: 'email', label: '邮箱' },
          { value: 'address', label: '地址' },
          { value: 'hours', label: '工作时间' },
          { value: 'department', label: '部门联系' }
        ]
      case 'feedback':
        return [
          { value: 'bug', label: '问题反馈' },
          { value: 'suggestion', label: '功能建议' },
          { value: 'praise', label: '表扬建议' },
          { value: 'complaint', label: '投诉建议' },
          { value: 'other', label: '其他反馈' }
        ]
      default:
        return []
    }
  }

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'pending': { color: 'default', text: '待处理' },
      'processing': { color: 'processing', text: '处理中' },
      'resolved': { color: 'success', text: '已解决' },
      'closed': { color: 'error', text: '已关闭' }
    }
    const config = statusMap[status] || { color: 'default', text: status }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  // 使用指南表格列
  const guideColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: GuideContent) => (
        <Button type="link" onClick={() => handleView(record)}>
          {title}
        </Button>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const option = getCategoryOptions('guide').find(opt => opt.value === category)
        return <Tag color="blue">{option?.label || category}</Tag>
      }
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order'
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: GuideContent) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            type="text"
            onClick={() => handleToggleEnabled(record.id, !record.enabled)}
          >
            {record.enabled ? '禁用' : '启用'}
          </Button>
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ]

  // FAQ表格列
  const faqColumns = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      render: (question: string, record: FAQContent) => (
        <Button type="link" onClick={() => handleView(record)}>
          {question}
        </Button>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const option = getCategoryOptions('faq').find(opt => opt.value === category)
        return <Tag color="green">{option?.label || category}</Tag>
      }
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views'
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: FAQContent) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            type="text"
            onClick={() => handleToggleEnabled(record.id, !record.enabled)}
          >
            {record.enabled ? '禁用' : '启用'}
          </Button>
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 联系信息表格列
  const contactColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const option = getCategoryOptions('contact').find(opt => opt.value === type)
        return <Tag color="orange">{option?.label || type}</Tag>
      }
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ContactInfo) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            type="text"
            onClick={() => handleToggleEnabled(record.id, !record.enabled)}
          >
            {record.enabled ? '禁用' : '启用'}
          </Button>
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 意见反馈表格列
  const feedbackColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: FeedbackItem) => (
        <Button type="link" onClick={() => handleView(record)}>
          {title}
        </Button>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const option = getCategoryOptions('feedback').find(opt => opt.value === type)
        return <Tag color="purple">{option?.label || type}</Tag>
      }
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled value={rating} />
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: FeedbackItem) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        </Space>
      )
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>页面内容管理</Title>
      </div>

      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            <Space>
              <Search
                placeholder="搜索内容"
                allowClear
                style={{ width: 250 }}
                onSearch={setSearchText}
              />
              <Select
                placeholder="分类"
                allowClear
                style={{ width: 120 }}
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                {getCategoryOptions(activeTab).map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Space>
          }
        >
          <TabPane 
            tab={
              <Space>
                <BookOutlined />
                使用指南
              </Space>
            } 
            key="guide"
          >
            <div className="mb-4">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => handleCreate('guide')}
              >
                新增指南
              </Button>
            </div>
            <Table
              columns={guideColumns}
              dataSource={guideContents}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <QuestionCircleOutlined />
                常见问题
              </Space>
            } 
            key="faq"
          >
            <div className="mb-4">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => handleCreate('faq')}
              >
                新增问题
              </Button>
            </div>
            <Table
              columns={faqColumns}
              dataSource={faqContents}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <PhoneOutlined />
                联系信息
              </Space>
            } 
            key="contact"
          >
            <div className="mb-4">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => handleCreate('contact')}
              >
                新增联系方式
              </Button>
            </div>
            <Table
              columns={contactColumns}
              dataSource={contactInfos}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <MessageOutlined />
                意见反馈
              </Space>
            } 
            key="feedback"
          >
            <Table
              columns={feedbackColumns}
              dataSource={feedbackItems}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 通用编辑模态框 */}
      <Modal
        title={
          modalType === 'view' ? '查看详情' :
          modalType === 'edit' ? '编辑内容' : '新增内容'
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText={modalType === 'view' ? '关闭' : '确定'}
        cancelText="取消"
      >
        {modalType === 'view' && selectedItem ? (
          <div>
            {activeTab === 'guide' && (
              <>
                <p><strong>标题：</strong>{selectedItem.title}</p>
                <p><strong>分类：</strong>{selectedItem.category}</p>
                <p><strong>内容：</strong>{selectedItem.content}</p>
                {selectedItem.steps && (
                  <>
                    <p><strong>步骤：</strong></p>
                    <ul>
                      {selectedItem.steps.map((step: string, index: number) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            {activeTab === 'faq' && (
              <>
                <p><strong>问题：</strong>{selectedItem.question}</p>
                <p><strong>答案：</strong>{selectedItem.answer}</p>
                <p><strong>浏览量：</strong>{selectedItem.views}</p>
              </>
            )}
            {activeTab === 'feedback' && (
              <>
                <p><strong>标题：</strong>{selectedItem.title}</p>
                <p><strong>内容：</strong>{selectedItem.content}</p>
                <p><strong>联系方式：</strong>{selectedItem.contact}</p>
                <p><strong>评分：</strong><Rate disabled value={selectedItem.rating} /></p>
                <p><strong>状态：</strong>{getStatusTag(selectedItem.status)}</p>
                {selectedItem.response && (
                  <p><strong>回复：</strong>{selectedItem.response}</p>
                )}
              </>
            )}
          </div>
        ) : (
          <Form form={form} layout="vertical">
            {activeTab === 'guide' && (
              <>
                <Form.Item name="category" label="分类" rules={[{ required: true }]}>
                  <Select>
                    {getCategoryOptions('guide').map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="title" label="标题" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="content" label="内容" rules={[{ required: true }]}>
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="order" label="排序" rules={[{ required: true }]}>
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item name="enabled" label="启用" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </>
            )}
            
            {activeTab === 'faq' && (
              <>
                <Form.Item name="category" label="分类" rules={[{ required: true }]}>
                  <Select>
                    {getCategoryOptions('faq').map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="question" label="问题" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="answer" label="答案" rules={[{ required: true }]}>
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="order" label="排序" rules={[{ required: true }]}>
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item name="enabled" label="启用" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </>
            )}

            {activeTab === 'contact' && (
              <>
                <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                  <Select>
                    {getCategoryOptions('contact').map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="title" label="标题" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="content" label="内容" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="描述">
                  <Input />
                </Form.Item>
                <Form.Item name="order" label="排序" rules={[{ required: true }]}>
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item name="enabled" label="启用" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </>
            )}

            {activeTab === 'feedback' && (
              <>
                <Form.Item name="status" label="处理状态" rules={[{ required: true }]}>
                  <Select>
                    <Option value="pending">待处理</Option>
                    <Option value="processing">处理中</Option>
                    <Option value="resolved">已解决</Option>
                    <Option value="closed">已关闭</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="response" label="回复内容">
                  <TextArea rows={4} />
                </Form.Item>
              </>
            )}
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default PageContentManagement