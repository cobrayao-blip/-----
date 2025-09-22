import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Tag,
  Avatar,
  Rate,
  Upload,
  Image
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons'

const { TextArea } = Input

interface Testimonial {
  id: string
  name: string
  role: string
  avatar?: string
  content: string
  rating: number
  order: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

const TestimonialManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create'>('create')
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [form] = Form.useForm()

  // 获取用户评价列表
  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/testimonials/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setTestimonials(data.data.testimonials)
      } else {
        message.error('获取用户评价失败')
      }
    } catch (error) {
      console.error('获取用户评价失败:', error)
      message.error('获取用户评价失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  // 处理创建/编辑
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const token = localStorage.getItem('token')
      
      const url = modalType === 'create' 
        ? '/api/testimonials' 
        : `/api/testimonials/${selectedTestimonial?.id}`
      
      const method = modalType === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })
      
      const data = await response.json()
      
      if (data.success) {
        message.success(modalType === 'create' ? '创建成功' : '更新成功')
        setIsModalVisible(false)
        form.resetFields()
        fetchTestimonials()
      } else {
        message.error(data.message || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败')
    }
  }

  // 处理删除
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        message.success('删除成功')
        fetchTestimonials()
      } else {
        message.error(data.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
    }
  }

  // 切换启用状态
  const handleToggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/testimonials/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        message.success(data.message)
        fetchTestimonials()
      } else {
        message.error(data.message || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败')
    }
  }

  // 打开模态框
  const openModal = (type: 'view' | 'edit' | 'create', testimonial?: Testimonial) => {
    setModalType(type)
    setSelectedTestimonial(testimonial || null)
    setIsModalVisible(true)
    
    if (type !== 'create' && testimonial) {
      form.setFieldsValue({
        name: testimonial.name,
        role: testimonial.role,
        avatar: testimonial.avatar,
        content: testimonial.content,
        rating: testimonial.rating,
        order: testimonial.order,
        enabled: testimonial.enabled
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        rating: 5,
        order: 0,
        enabled: true
      })
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '用户信息',
      key: 'user',
      render: (record: Testimonial) => (
        <Space>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            size={40}
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.role}</div>
          </div>
        </Space>
      )
    },
    {
      title: '评价内容',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <div className="max-w-xs">
          {content.length > 50 ? `${content.substring(0, 50)}...` : content}
        </div>
      )
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Rate disabled value={rating} />
      )
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      sorter: (a: Testimonial, b: Testimonial) => a.order - b.order
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: Testimonial) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleStatus(record.id)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Testimonial) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => openModal('view', record)}
          >
            查看
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            onClick={() => openModal('edit', record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条评价吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal('create')}
        >
          新增评价
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={testimonials}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      <Modal
        title={
          modalType === 'view' ? '查看评价' :
          modalType === 'edit' ? '编辑评价' : '新增评价'
        }
        open={isModalVisible}
        onOk={modalType === 'view' ? () => setIsModalVisible(false) : handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText={modalType === 'view' ? '关闭' : '确定'}
        cancelText="取消"
      >
        {modalType === 'view' ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar 
                src={selectedTestimonial?.avatar} 
                icon={<UserOutlined />}
                size={64}
              />
              <div>
                <h3 className="text-lg font-medium">{selectedTestimonial?.name}</h3>
                <p className="text-gray-500">{selectedTestimonial?.role}</p>
                <Rate disabled value={selectedTestimonial?.rating} />
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">评价内容：</h4>
              <p className="text-gray-700">{selectedTestimonial?.content}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>排序：{selectedTestimonial?.order}</span>
              <span>状态：{selectedTestimonial?.enabled ? '启用' : '禁用'}</span>
            </div>
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>

            <Form.Item
              name="role"
              label="职位/身份"
              rules={[{ required: true, message: '请输入职位或身份' }]}
            >
              <Input placeholder="请输入职位或身份" />
            </Form.Item>

            <Form.Item
              name="avatar"
              label="头像URL"
            >
              <Input placeholder="请输入头像URL（可选）" />
            </Form.Item>

            <Form.Item
              name="content"
              label="评价内容"
              rules={[{ required: true, message: '请输入评价内容' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="请输入评价内容"
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              name="rating"
              label="评分"
              rules={[{ required: true, message: '请选择评分' }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="order"
              label="排序"
              rules={[{ required: true, message: '请输入排序' }]}
            >
              <InputNumber 
                min={0} 
                placeholder="数字越小排序越靠前" 
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="enabled"
              label="启用状态"
              valuePropName="checked"
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default TestimonialManagement