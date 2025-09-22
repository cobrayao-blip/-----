import React, { useState, useEffect } from 'react'
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
  Rate,
  Upload
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
  MessageOutlined,
  LoadingOutlined
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
  type: 'phone' | 'email' | 'address' | 'hours' | 'department' | 'social' | 'location' | 'transport' | 'nearby'
  title: string
  content: string
  description?: string
  qrCode?: string
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
  
  // 数据状态
  const [guideContents, setGuideContents] = useState<GuideContent[]>([])
  const [faqContents, setFaqContents] = useState<FAQContent[]>([])
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([])
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(false)
  
  // 图片上传状态
  const [contactImageLoading, setContactImageLoading] = useState(false)
  const [contactImageUrl, setContactImageUrl] = useState<string>('')
  
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      switch (activeTab) {
        case 'guide':
          const guideResponse = await fetch('/api/content/guides', { headers })
          const guideData = await guideResponse.json()
          if (guideData.success) {
            setGuideContents(guideData.data.map((item: any) => ({
              ...item,
              steps: item.steps ? JSON.parse(item.steps) : [],
              updatedAt: new Date(item.updatedAt).toLocaleString()
            })))
          }
          break
        case 'faq':
          const faqResponse = await fetch('/api/content/faqs', { headers })
          const faqData = await faqResponse.json()
          if (faqData.success) {
            setFaqContents(faqData.data.map((item: any) => ({
              ...item,
              updatedAt: new Date(item.updatedAt).toLocaleString()
            })))
          }
          break
        case 'contact':
          const contactResponse = await fetch('/api/content/contacts', { headers })
          const contactData = await contactResponse.json()
          if (contactData.success) {
            setContactInfos(contactData.data.map((item: any) => ({
              ...item,
              updatedAt: new Date(item.updatedAt).toLocaleString()
            })))
          }
          break
        case 'feedback':
          const feedbackResponse = await fetch('/api/content/feedbacks', { headers })
          const feedbackData = await feedbackResponse.json()
          if (feedbackData.success) {
            setFeedbackItems(feedbackData.data.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt).toLocaleString(),
              updatedAt: new Date(item.updatedAt).toLocaleString()
            })))
          }
          break
      }
    } catch (error) {
      message.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }



  // 处理函数
  const handleCreate = (type: string) => {
    setSelectedItem(null)
    setModalType('create')
    form.resetFields()
    setContactImageUrl('')
    setIsModalVisible(true)
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setModalType('edit')
    form.setFieldsValue(item)
    // 如果是联系信息且有二维码，设置图片URL
    if (activeTab === 'contact' && item.qrCode) {
      setContactImageUrl(item.qrCode)
    } else {
      setContactImageUrl('')
    }
    setIsModalVisible(true)
  }

  const handleView = (item: any) => {
    setSelectedItem(item)
    setModalType('view')
    setIsModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      let endpoint = ''
      switch (activeTab) {
        case 'guide':
          endpoint = `/api/content/guides/${id}`
          break
        case 'faq':
          endpoint = `/api/content/faqs/${id}`
          break
        case 'contact':
          endpoint = `/api/content/contacts/${id}`
          break
        case 'feedback':
          endpoint = `/api/content/feedbacks/${id}`
          break
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers
      })

      const data = await response.json()
      if (data.success) {
        message.success('删除成功')
        fetchData()
      } else {
        message.error(data.message || '删除失败')
      }
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      let endpoint = ''
      switch (activeTab) {
        case 'guide':
          endpoint = `/api/content/guides/${id}`
          break
        case 'faq':
          endpoint = `/api/content/faqs/${id}`
          break
        case 'contact':
          endpoint = `/api/content/contacts/${id}`
          break
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ enabled })
      })

      const data = await response.json()
      if (data.success) {
        message.success(enabled ? '已启用' : '已禁用')
        fetchData()
      } else {
        message.error(data.message || '操作失败')
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleModalOk = async () => {
    if (modalType === 'view') {
      setIsModalVisible(false)
      return
    }

    try {
      const values = await form.validateFields()
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      let endpoint = ''
      let method = modalType === 'create' ? 'POST' : 'PUT'
      
      switch (activeTab) {
        case 'guide':
          endpoint = modalType === 'create' ? '/api/content/guides' : `/api/content/guides/${selectedItem?.id}`
          break
        case 'faq':
          endpoint = modalType === 'create' ? '/api/content/faqs' : `/api/content/faqs/${selectedItem?.id}`
          break
        case 'contact':
          endpoint = modalType === 'create' ? '/api/content/contacts' : `/api/content/contacts/${selectedItem?.id}`
          break
        case 'feedback':
          endpoint = modalType === 'create' ? '/api/content/feedbacks' : `/api/content/feedbacks/${selectedItem?.id}`
          break
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(values)
      })

      const data = await response.json()
      if (data.success) {
        message.success(modalType === 'create' ? '创建成功' : '更新成功')
        setIsModalVisible(false)
        fetchData()
      } else {
        message.error(data.message || '操作失败')
      }
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
          { value: 'department', label: '部门联系' },
          { value: 'social', label: '社交媒体' },
          { value: 'location', label: '位置信息' },
          { value: 'transport', label: '交通指南' },
          { value: 'nearby', label: '周边设施' }
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
      title: '二维码',
      dataIndex: 'qrCode',
      key: 'qrCode',
      render: (qrCode: string) => (
        qrCode ? <Tag color="blue">已设置</Tag> : <Tag color="default">未设置</Tag>
      )
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
              loading={loading}
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
              loading={loading}
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
              loading={loading}
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
              loading={loading}
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
                <Form.Item name="qrCode" label="二维码图片" help="适用于微信、QQ等社交媒体，上传二维码图片">
                  <Upload
                    name="image"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/api/content/contacts/upload-image"
                    headers={{
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('只能上传图片文件!');
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('图片大小不能超过 2MB!');
                      }
                      return isImage && isLt2M;
                    }}
                    onChange={(info) => {
                      if (info.file.status === 'uploading') {
                        setContactImageLoading(true);
                        return;
                      }
                      if (info.file.status === 'done') {
                        setContactImageLoading(false);
                        if (info.file.response?.success) {
                          const imageUrl = info.file.response.data.url;
                          form.setFieldsValue({ qrCode: imageUrl });
                          setContactImageUrl(imageUrl);
                          message.success('图片上传成功');
                        } else {
                          message.error('图片上传失败');
                        }
                      }
                      if (info.file.status === 'error') {
                        setContactImageLoading(false);
                        message.error('图片上传失败');
                      }
                    }}
                  >
                    {contactImageUrl ? (
                      <img src={contactImageUrl} alt="二维码" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div>
                        {contactImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>上传二维码</div>
                      </div>
                    )}
                  </Upload>
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