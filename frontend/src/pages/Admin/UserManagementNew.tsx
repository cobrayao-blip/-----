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
  Popconfirm,
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
  ReloadOutlined,
  CrownOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { 
  useGetUsersQuery, 
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation, 
  useDeleteUserMutation,
  type User 
} from '../../store/api/adminApi'
import { useAppSelector } from '../../store'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select

const UserManagementNew: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create'>('view')
  const [searchText, setSearchText] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [form] = Form.useForm()

  // 获取当前用户信息
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const isSystemAdmin = currentUser?.role === 'SUPER_ADMIN'
  const isRegularAdmin = currentUser?.role === 'ADMIN'

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
  const currentUserRole = usersData?.currentUserRole

  // 根据当前用户权限获取可管理的角色选项
  const getRoleOptions = () => {
    if (isSystemAdmin) {
      return [
        { value: 'USER', label: '普通用户', icon: <UserOutlined /> },
        { value: 'VIP', label: 'VIP用户', icon: <CrownOutlined /> },
        { value: 'ADMIN', label: '普通管理员', icon: <TeamOutlined /> }
      ]
    } else if (isRegularAdmin) {
      return [
        { value: 'USER', label: '普通用户', icon: <UserOutlined /> },
        { value: 'VIP', label: 'VIP用户', icon: <CrownOutlined /> }
      ]
    }
    return []
  }

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

  // 处理创建用户
  const handleCreateUser = () => {
    setSelectedUser(null)
    setModalType('create')
    form.resetFields()
    // 设置默认值
    form.setFieldsValue({
      role: 'USER',
      status: 'ACTIVE'
    })
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
      case 'SUPER_ADMIN': return 'purple'
      case 'ADMIN': return 'red'
      case 'VIP': return 'gold'
      case 'USER': return 'blue'
      default: return 'default'
    }
  }

  // 获取角色标签
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return '系统管理员'
      case 'ADMIN': return '普通管理员'
      case 'VIP': return 'VIP用户'
      case 'USER': return '普通用户'
      default: return role
    }
  }

  // 获取角色图标
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return <CrownOutlined style={{ color: '#722ed1' }} />
      case 'ADMIN': return <TeamOutlined style={{ color: '#f5222d' }} />
      case 'VIP': return <CrownOutlined style={{ color: '#faad14' }} />
      case 'USER': return <UserOutlined style={{ color: '#1890ff' }} />
      default: return <UserOutlined />
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green'
      case 'PENDING': return 'orange'
      case 'SUSPENDED': return 'red'
      case 'INACTIVE': return 'gray'
      default: return 'default'
    }
  }

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '正常'
      case 'PENDING': return '待激活'
      case 'SUSPENDED': return '已停用'
      case 'INACTIVE': return '未激活'
      default: return status
    }
  }

  // 检查是否可以删除用户
  const canDeleteUser = (user: User) => {
    // 系统管理员可以删除普通管理员和普通用户，但不能删除其他系统管理员
    if (isSystemAdmin) {
      return user.role !== 'SUPER_ADMIN'
    }
    // 普通管理员只能删除普通用户
    if (isRegularAdmin) {
      return user.role === 'USER' || user.role === 'VIP'
    }
    return false
  }

  // 检查是否可以编辑用户
  const canEditUser = (user: User) => {
    if (isSystemAdmin) {
      return user.role !== 'SUPER_ADMIN'
    }
    if (isRegularAdmin) {
      return user.role === 'USER' || user.role === 'VIP'
    }
    return false
  }

  // 表格列定义
  const columns = [
    {
      title: '用户信息',
      key: 'userInfo',
      render: (record: User) => (
        <Space>
          <Avatar icon={getRoleIcon(record.role)} />
          <div>
            <div className="font-medium flex items-center gap-2">
              {record.name}
              {record.role === 'SUPER_ADMIN' && (
                <Tag color="purple" size="small">超级</Tag>
              )}
            </div>
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
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
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
          {canEditUser(record) && (
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            >
              编辑
            </Button>
          )}
          {canEditUser(record) && (
            <>
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
            </>
          )}
          {canDeleteUser(record) && (
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
        <Descriptions column={2}>
          <Descriptions.Item label="用户姓名">{selectedUser.name}</Descriptions.Item>
          <Descriptions.Item label="邮箱地址">{selectedUser.email}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{selectedUser.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="用户角色">
            <Tag color={getRoleColor(selectedUser.role)} icon={getRoleIcon(selectedUser.role)}>
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
        </Descriptions>
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
              placeholder="请设置初始密码（建议使用简单密码，用户首次登录后需要修改）" 
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
            {getRoleOptions().map(option => (
              <Option key={option.value} value={option.value}>
                <Space>
                  {option.icon}
                  {option.label}
                </Space>
              </Option>
            ))}
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
          <Alert
            message="权限说明"
            description={
              <div className="text-sm">
                <p><strong>普通用户</strong>：可以浏览和申请项目、职位</p>
                <p><strong>VIP用户</strong>：享有更多特权和优先服务</p>
                {isSystemAdmin && (
                  <p><strong>普通管理员</strong>：可以管理普通用户，但不能管理其他管理员</p>
                )}
                <p className="mt-2 text-orange-600">
                  💡 提示：用户首次使用初始密码登录时，系统会要求修改密码
                </p>
              </div>
            }
            type="info"
            showIcon
            className="mt-4"
          />
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
          <div className="flex items-center justify-between mb-4">
            <Title level={2} className="mb-0">
              用户管理
              {currentUserRole && (
                <Tag color={getRoleColor(currentUserRole)} className="ml-2">
                  {getRoleLabel(currentUserRole)}
                </Tag>
              )}
            </Title>
            
            {(isSystemAdmin || isRegularAdmin) && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateUser}
              >
                {isSystemAdmin ? '新增用户/管理员' : '新增用户'}
              </Button>
            )}
          </div>
          
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
                {getRoleOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    <Space>
                      {option.icon}
                      {option.label}
                    </Space>
                  </Option>
                ))}
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
                <Option value="PENDING">待激活</Option>
                <Option value="SUSPENDED">已停用</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Space>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                >
                  刷新
                </Button>
                <Text type="secondary" className="text-sm">
                  {isSystemAdmin ? '系统管理员视图' : '普通管理员视图'}
                </Text>
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
            modalType === 'view' ? '查看用户详情' :
            modalType === 'edit' ? '编辑用户信息' : 
            (isSystemAdmin ? '新增用户/管理员' : '新增用户')
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          okText={modalType === 'view' ? '关闭' : '确定'}
          cancelText="取消"
          confirmLoading={isCreating || isUpdatingUser}
        >
          {renderModalContent()}
        </Modal>
      </Card>
    </div>
  )
}

export default UserManagementNew