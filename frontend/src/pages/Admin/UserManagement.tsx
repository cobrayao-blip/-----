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
  Avatar,
  Descriptions,
  Tabs,
  Popconfirm,
  Spin,
  Alert,
  Row,
  Col
} from 'antd'
import { 
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { 
  useGetUsersQuery, 
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation, 
  useDeleteUserMutation,
  type User 
} from '../../store/api/adminApi'

const { Title } = Typography
const { Search } = Input
const { Option } = Select
const { TabPane } = Tabs

const UserManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create'>('view')
  const [searchText, setSearchText] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [form] = Form.useForm()

  // 获取用户数据
  const { 
    data: usersData, 
    isLoading, 
    error,
    refetch 
  } = useGetUsersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchText || undefined,
    role: selectedRole || undefined,
    status: selectedStatus || undefined
  })

  // 创建用户
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  
  // 更新用户
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation()
  
  // 更新用户状态
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation()
  
  // 删除用户
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const users = usersData?.users || []
  const total = usersData?.total || 0

  // 处理状态更新
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUserStatus({ id: userId, status: newStatus }).unwrap()
      message.success('用户状态更新成功')
    } catch (error) {
      message.error('用户状态更新失败')
    }
  }

  // 处理用户删除
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap()
      message.success('用户删除成功')
    } catch (error) {
      message.error('用户删除失败')
    }
  }

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  // 处理筛选
  const handleRoleChange = (value: string) => {
    setSelectedRole(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  // 处理查看用户
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setModalType('view')
    setIsModalVisible(true)
  }

  // 处理编辑用户
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setModalType('edit')
    form.setFieldsValue(user)
    setIsModalVisible(true)
  }

  // 处理模态框确认
  const handleModalOk = async () => {
    if (modalType === 'view') {
      setIsModalVisible(false)
      return
    }

    try {
      const values = await form.validateFields()
      
      if (modalType === 'create') {
        await createUser(values).unwrap()
        message.success('用户创建成功')
      } else if (modalType === 'edit' && selectedUser) {
        await updateUser({ id: selectedUser.id, ...values }).unwrap()
        message.success('用户信息更新成功')
      }
      
      setIsModalVisible(false)
      form.resetFields()
    } catch (error: any) {
      message.error(error?.data?.message || '操作失败，请重试')
    }
  }

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'red'
      case 'VIP': return 'gold'
      case 'USER': return 'blue'
      default: return 'default'
    }
  }

  // 获取角色标签
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return '管理员'
      case 'VIP': return 'VIP用户'
      case 'USER': return '普通用户'
      default: return role
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green'
      case 'INACTIVE': return 'orange'
      case 'SUSPENDED': return 'red'
      default: return 'default'
    }
  }

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '正常'
      case 'INACTIVE': return '未激活'
      case 'SUSPENDED': return '已停用'
      default: return status
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '用户信息',
      key: 'userInfo',
      render: (record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {getRoleLabel(role)}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
          {record.status === 'ACTIVE' ? (
            <Button 
              type="link" 
              icon={<LockOutlined />}
              onClick={() => handleStatusChange(record.id, 'SUSPENDED')}
              loading={isUpdating}
            >
              停用
            </Button>
          ) : (
            <Button 
              type="link" 
              icon={<UnlockOutlined />}
              onClick={() => handleStatusChange(record.id, 'ACTIVE')}
              loading={isUpdating}
            >
              激活
            </Button>
          )}
          {record.role !== 'ADMIN' && (
            <Popconfirm
              title="确定要删除这个用户吗？"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="link" 
                danger
                icon={<DeleteOutlined />}
                loading={isDeleting}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  // 渲染模态框内容
  const renderModalContent = () => {
    if (modalType === 'view' && selectedUser) {
      return (
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基本信息" key="basic">
            <Descriptions column={2}>
              <Descriptions.Item label="用户姓名">{selectedUser.name}</Descriptions.Item>
              <Descriptions.Item label="邮箱地址">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedUser.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="用户角色">
                <Tag color={getRoleColor(selectedUser.role)}>
                  {getRoleLabel(selectedUser.role)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="账户状态">
                <Tag color={getStatusColor(selectedUser.status)}>
                  {getStatusLabel(selectedUser.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {new Date(selectedUser.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="最后登录">
                {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : '-'}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
        </Tabs>
      )
    }

    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="用户姓名"
          rules={[{ required: true, message: '请输入用户姓名' }]}
        >
          <Input placeholder="请输入用户姓名" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="邮箱地址"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input placeholder="请输入邮箱地址" disabled={modalType === 'edit'} />
        </Form.Item>
        
        {modalType === 'create' && (
          <Form.Item
            name="password"
            label="初始密码"
            rules={[
              { required: true, message: '请设置初始密码' },
              { min: 6, message: '密码长度至少6位' }
            ]}
          >
            <Input.Password 
              placeholder="请设置初始密码（用户首次登录后需要修改）" 
              autoComplete="new-password"
            />
          </Form.Item>
        )}
        
        <Form.Item name="phone" label="联系电话">
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        
        <Form.Item
          name="role"
          label="用户角色"
          rules={[{ required: true, message: '请选择用户角色' }]}
        >
          <Select placeholder="请选择用户角色">
            <Option value="USER">普通用户</Option>
            <Option value="VIP">VIP用户</Option>
            <Option value="ADMIN">管理员</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="status"
          label="账户状态"
          rules={[{ required: true, message: '请选择账户状态' }]}
        >
          <Select placeholder="请选择账户状态">
            <Option value="ACTIVE">正常</Option>
            <Option value="PENDING">待激活</Option>
            <Option value="SUSPENDED">已停用</Option>
          </Select>
        </Form.Item>

        {modalType === 'create' && (
          <div className="bg-blue-50 p-3 rounded mb-4">
            <Text type="secondary" className="text-sm">
              💡 提示：
              <br />
              • 管理员账户创建后，用户需要使用初始密码首次登录
              <br />
              • 首次登录后系统会要求用户修改密码
              <br />
              • 建议设置简单易记的初始密码，如：123456
            </Text>
          </div>
        )}
      </Form>
    )
  }

  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description="无法获取用户数据，请稍后重试"
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => refetch()}>
            重试
          </Button>
        }
      />
    )
  }

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          <Title level={2}>用户管理</Title>
          
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Search
                placeholder="搜索用户姓名或邮箱"
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="选择角色"
                allowClear
                onChange={handleRoleChange}
                style={{ width: '100%' }}
              >
                <Option value="USER">普通用户</Option>
                <Option value="VIP">VIP用户</Option>
                <Option value="ADMIN">管理员</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="选择状态"
                allowClear
                onChange={handleStatusFilterChange}
                style={{ width: '100%' }}
              >
                <Option value="ACTIVE">正常</Option>
                <Option value="INACTIVE">未激活</Option>
                <Option value="SUSPENDED">已停用</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setModalType('create')
                    form.resetFields()
                    setIsModalVisible(true)
                  }}
                >
                  新增用户
                </Button>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                >
                  刷新
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page)
              setPageSize(size || 10)
            }
          }}
        />

        <Modal
          title={
            modalType === 'view' ? '查看用户' :
            modalType === 'edit' ? '编辑用户' : '新增用户'
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          okText={modalType === 'view' ? '关闭' : '确定'}
          cancelText="取消"
        >
          {renderModalContent()}
        </Modal>
      </Card>
    </div>
  )
}

export default UserManagement