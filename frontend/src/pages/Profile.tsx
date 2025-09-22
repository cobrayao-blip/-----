import React, { useState } from 'react'
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Upload, 
  message,
  Tabs,
  Descriptions,
  Table,
  Tag,
  Space,
  Modal,
  Progress,
  Statistic,
  List
} from 'antd'
import { 
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  SafetyOutlined,
  FileTextOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../store'
import { updateUser } from '../store/slices/authSlice'
import { useGetResumeQuery } from '../services/resumeApi'
import { useUpdateAvatarMutation } from '../store/api/authApi'
import { useGetUserApplicationsQuery, useUpdateUserInfoMutation } from '../store/api/userApi'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { TextArea } = Input

const Profile: React.FC = () => {
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [applicationDetailVisible, setApplicationDetailVisible] = useState(false)
  
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  // 获取用户简历数据
  const { data: resumeData, isLoading: resumeLoading, error: resumeError } = useGetResumeQuery()
  
  // 获取用户申请记录
  const { data: applicationsData, isLoading: applicationsLoading, refetch: refetchApplications } = useGetUserApplicationsQuery()
  
  // 更新头像API
  const [updateAvatarApi, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation()
  
  // 更新用户基本信息API
  const [updateUserInfo, { isLoading: isUpdatingInfo }] = useUpdateUserInfoMutation()

  // 如果用户未登录且没有token，重定向到登录页
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (!user && !token) {
      navigate('/login')
    }
  }, [user, navigate])

  // 如果用户未登录但有token，显示加载状态等待AuthChecker恢复用户信息
  const token = localStorage.getItem('token')
  if (!user && token) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">
          <div>正在加载用户信息...</div>
        </div>
      </div>
    )
  }

  // 如果既没有用户信息也没有token，显示加载状态
  if (!user && !token) {
    return <div>加载中...</div>
  }

  // 用户基本信息（简化版，用户可编辑）
  const userProfile = {
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    avatar: user?.avatar || null,
    joinDate: (user as any)?.createdAt || new Date().toISOString()
  }

  // 获取真实的申请记录
  console.log('Profile页面 - 申请记录数据:', applicationsData)
  const projectApplications = applicationsData?.data?.projects || []
  const jobApplications = applicationsData?.data?.jobs || []
  console.log('Profile页面 - 项目申请:', projectApplications)
  console.log('Profile页面 - 工作申请:', jobApplications)

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待审核',
      'APPROVED': '已通过',
      'REJECTED': '已拒绝',
      'RETURNED': '退回',
      'UNDER_REVIEW': '审核中'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'PENDING': 'processing',
      'APPROVED': 'success',
      'REJECTED': 'error',
      'RETURNED': 'warning',
      'UNDER_REVIEW': 'warning'
    }
    return colorMap[status] || 'default'
  }

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'TECH': '科技创新',
      'STARTUP': '创业扶持',
      'TALENT': '人才引进',
      'RESEARCH': '科研项目',
      'OTHER': '其他'
    }
    return categoryMap[category] || category
  }

  const handleEditProfile = () => {
    form.setFieldsValue(userProfile)
    setIsEditModalVisible(true)
  }

  const handleChangePassword = () => {
    passwordForm.resetFields()
    setIsPasswordModalVisible(true)
  }

  // 查看申报详情
  const handleViewApplicationDetail = (record: any) => {
    setSelectedApplication(record)
    setApplicationDetailVisible(true)
  }

  // 解析文件信息的辅助函数
  const parseFileInfo = (fileUrlString: string, fileType: string) => {
    if (!fileUrlString) return []
    
    try {
      const parsed = JSON.parse(fileUrlString)
      
      if (Array.isArray(parsed)) {
        return parsed.map((file, index) => ({
          name: file.name || file.originalName || `${fileType}${index + 1}`,
          url: file.url,
          size: file.size || null,
          type: fileType
        })).filter(file => file.url)
      } else if (parsed && typeof parsed === 'object' && parsed.url) {
        return [{
          name: parsed.name || parsed.originalName || fileType,
          url: parsed.url,
          size: parsed.size || null,
          type: fileType
        }]
      }
    } catch (e) {
      if (typeof fileUrlString === 'string' && fileUrlString.trim()) {
        return [{
          name: fileType,
          url: fileUrlString,
          size: null,
          type: fileType
        }]
      }
    }
    
    return []
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      // 调用真实的API更新用户信息
      await updateUserInfo({
        name: values.name,
        phone: values.phone
      }).unwrap()
      
      // 更新Redux store中的用户信息
      dispatch(updateUser({
        name: values.name
      }))
      
      message.success('个人资料更新成功')
      setIsEditModalVisible(false)
    } catch (error: any) {
      console.error('保存用户信息失败:', error)
      message.error(error?.data?.message || '保存失败，请检查输入信息')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    try {
      setLoading(true)
      const values = await passwordForm.validateFields()
      // 模拟密码更新操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('密码修改成功')
      setIsPasswordModalVisible(false)
    } catch (error) {
      message.error('密码修改失败')
    } finally {
      setLoading(false)
    }
  }

  const jobApplicationColumns = [
    {
      title: '职位信息',
      key: 'jobInfo',
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.job?.title || '未知职位'}</div>
          <Text type="secondary" className="text-sm">{record.job?.company || '未知公司'}</Text>
        </div>
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
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => new Date(time).toLocaleDateString()
    },
    {
      title: '审核时间',
      dataIndex: 'reviewedAt',
      key: 'reviewedAt',
      render: (time: string) => time ? new Date(time).toLocaleDateString() : '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewApplicationDetail(record)}
          >
            查看详情
          </Button>
          {record.status === 'RETURNED' && (
            <Button 
              type="primary" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/projects/edit-application/${record.id}`)}
            >
              重新编辑
            </Button>
          )}
        </Space>
      )
    }
  ]

  const applicationColumns = [
    {
      title: '项目名称',
      key: 'projectTitle',
      render: (record: any) => record.project?.title || '未知项目'
    },
    {
      title: '项目类别',
      key: 'projectCategory',
      render: (record: any) => getCategoryLabel(record.project?.category) || '-'
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
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => new Date(time).toLocaleDateString()
    },
    {
      title: '审核时间',
      dataIndex: 'reviewedAt',
      key: 'reviewedAt',
      render: (time: string) => time ? new Date(time).toLocaleDateString() : '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewApplicationDetail(record)}
          >
            查看详情
          </Button>
          {record.status === 'RETURNED' && (
            <Button 
              type="primary" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/projects/edit-application/${record.id}`)}
            >
              重新编辑
            </Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Title level={2}>个人中心</Title>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧个人信息卡片 */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <div className="mb-4">
              <Avatar 
                size={80} 
                src={user?.avatar} 
                icon={<UserOutlined />} 
              />
              <Upload
                name="avatar"
                showUploadList={false}
                accept="image/png,image/jpeg,image/jpg,image/gif"
                beforeUpload={(file) => {
                  // 检查文件类型
                  const isImage = file.type.startsWith('image/')
                  if (!isImage) {
                    message.error('只能上传图片文件！')
                    return false
                  }
                  
                  // 检查文件大小 (2MB)
                  const isLt2M = file.size / 1024 / 1024 < 2
                  if (!isLt2M) {
                    message.error('图片大小不能超过2MB！')
                    return false
                  }
                  
                  return true
                }}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    // 读取文件并转换为base64
                    const reader = new FileReader()
                    reader.onload = async (e) => {
                      try {
                        const avatarUrl = e.target?.result as string
                        
                        // 调用后端API更新头像
                        await updateAvatarApi({ avatar: avatarUrl }).unwrap()
                        
                        // 更新Redux store中的用户头像
                        dispatch(updateUser({ avatar: avatarUrl }))
                        
                        message.success('头像上传成功！')
                        onSuccess?.(avatarUrl)
                      } catch (apiError: any) {
                        console.error('头像上传API调用失败:', apiError)
                        message.error(apiError?.data?.message || '头像保存失败，请重试')
                        onError?.(apiError)
                      }
                    }
                    reader.readAsDataURL(file as File)
                  } catch (error) {
                    message.error('头像上传失败，请重试')
                    onError?.(error as Error)
                  }
                }}
              >
                <Button 
                  type="link" 
                  icon={<UploadOutlined />} 
                  className="mt-2"
                >
                  更换头像
                </Button>
              </Upload>
              <div className="text-xs text-gray-500 mt-1">
                支持 JPG、PNG、GIF 格式，文件大小不超过 2MB
              </div>
            </div>
            
            <Title level={4} className="mb-2">{userProfile.name || '未设置姓名'}</Title>
            <Text type="secondary" className="block mb-4">逍遥人才网用户</Text>
            
            <div className="mb-4">
              <Text strong>账户状态</Text>
              <div className="mt-2">
                <Tag color="green">已激活</Tag>
              </div>
            </div>

            <Space direction="vertical" className="w-full">
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={handleEditProfile}
                block
              >
                编辑资料
              </Button>
              <Button 
                icon={<FileTextOutlined />} 
                onClick={() => navigate('/resume')}
                block
              >
                我的简历
              </Button>
              <Button 
                icon={<SafetyOutlined />} 
                onClick={handleChangePassword}
                block
              >
                修改密码
              </Button>
              {/* 管理员专用入口 */}
              {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <Button 
                  type="default"
                  icon={<SettingOutlined />} 
                  onClick={() => navigate('/admin/dashboard')}
                  block
                  style={{ 
                    borderColor: '#ff4d4f', 
                    color: '#ff4d4f',
                    backgroundColor: '#fff2f0'
                  }}
                >
                  管理后台
                </Button>
              )}
            </Space>
          </Card>

          {/* 统计信息 */}
          <Card title="我的统计" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Statistic
                title="申报项目"
                value={projectApplications.length}
                suffix="个"
              />
              <Statistic
                title="通过项目"
                value={projectApplications.filter(app => app.status === 'APPROVED').length}
                suffix="个"
              />
              <Statistic
                title="求职申请"
                value={jobApplications.length}
                suffix="个"
              />
              <Statistic
                title="面试邀请"
                value={jobApplications.filter(app => app.status === 'APPROVED').length}
                suffix="个"
              />
            </div>
          </Card>
        </div>

        {/* 右侧详细信息 */}
        <div className="lg:col-span-2">
          <Tabs defaultActiveKey="info">
            {/* 基本信息 */}
            <TabPane 
              tab={
                <Space>
                  <UserOutlined />
                  基本信息
                </Space>
              } 
              key="info"
            >
              <Card>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="姓名" span={1}>
                    {resumeData?.basicInfo?.name || userProfile.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="邮箱" span={1}>
                    <Space>
                      <MailOutlined />
                      {resumeData?.basicInfo?.email || userProfile.email}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="手机号" span={1}>
                    <Space>
                      <PhoneOutlined />
                      {resumeData?.basicInfo?.phone || userProfile.phone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="出生年月" span={1}>
                    {resumeData?.basicInfo?.birthDate || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="籍贯" span={1}>
                    {resumeData?.basicInfo?.hometown || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="婚育状态" span={1}>
                    {resumeData?.basicInfo?.maritalStatus || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="就业状态" span={1}>
                    {resumeData?.basicInfo?.employmentStatus || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="注册时间" span={1}>
                    <Space>
                      <CalendarOutlined />
                      {new Date(userProfile.joinDate).toLocaleDateString()}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="求职意向" span={2}>
                    {resumeData?.basicInfo?.jobObjective || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="个人总结" span={2}>
                    {resumeData?.basicInfo?.personalSummary || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="获得奖励" span={2}>
                    {resumeData?.basicInfo?.awards || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="兴趣爱好" span={2}>
                    {resumeData?.basicInfo?.hobbies || '-'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </TabPane>

            {/* 简历详情 */}
            <TabPane 
              tab={
                <Space>
                  <FileTextOutlined />
                  简历详情
                </Space>
              } 
              key="resume"
            >
              {resumeLoading ? (
                <Card>
                  <div className="text-center py-8">
                    <Progress type="circle" percent={50} />
                    <div className="mt-4">加载简历数据中...</div>
                  </div>
                </Card>
              ) : resumeData ? (
                <div className="space-y-4">
                  {/* 教育经历 */}
                  <Card title="教育经历" size="small">
                    {resumeData.education && resumeData.education.length > 0 ? (
                      <List
                        dataSource={resumeData.education}
                        renderItem={(item: any) => (
                          <List.Item>
                            <div>
                              <Text strong>{item.school}</Text> - {item.major}
                              <br />
                              <Text type="secondary">{item.degree} | {item.startDate} - {item.endDate}</Text>
                              {item.description && (
                                <>
                                  <br />
                                  <Text>{item.description}</Text>
                                </>
                              )}
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Text type="secondary">暂无教育经历</Text>
                    )}
                  </Card>

                  {/* 工作经历 */}
                  <Card title="工作经历" size="small">
                    {resumeData.experience && resumeData.experience.length > 0 ? (
                      <List
                        dataSource={resumeData.experience}
                        renderItem={(item: any) => (
                          <List.Item>
                            <div>
                              <Text strong>{item.company}</Text> - {item.position}
                              <br />
                              <Text type="secondary">
                                {item.startDate} - {item.current ? '至今' : item.endDate}
                              </Text>
                              <br />
                              <Text>{item.description}</Text>
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Text type="secondary">暂无工作经历</Text>
                    )}
                  </Card>

                  {/* 技能 */}
                  <Card title="技能" size="small">
                    {resumeData.skills && resumeData.skills.length > 0 ? (
                      <Space wrap>
                        {resumeData.skills.map((skill: any, index: number) => (
                          <Tag key={index} color="blue">
                            {skill.name}: {skill.description}
                          </Tag>
                        ))}
                      </Space>
                    ) : (
                      <Text type="secondary">暂无技能信息</Text>
                    )}
                  </Card>

                  {/* 证书 */}
                  <Card title="证书" size="small">
                    {resumeData.certificates && resumeData.certificates.length > 0 ? (
                      <List
                        dataSource={resumeData.certificates}
                        renderItem={(item: any) => (
                          <List.Item>
                            <div>
                              <Text strong>{item.name}</Text>
                              <br />
                              <Text type="secondary">获得时间: {item.issueDate}</Text>
                              {item.expiryDate && (
                                <>
                                  <br />
                                  <Text type="secondary">有效期至: {item.expiryDate}</Text>
                                </>
                              )}
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Text type="secondary">暂无证书信息</Text>
                    )}
                  </Card>
                </div>
              ) : (
                <Card>
                  <div className="text-center py-8">
                    <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                    <div className="mt-4">
                      <Text type="secondary">还没有创建简历</Text>
                      <br />
                      <Button 
                        type="primary" 
                        className="mt-2"
                        onClick={() => navigate('/resume')}
                      >
                        立即创建简历
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </TabPane>

            {/* 申报记录 */}
            <TabPane 
              tab={
                <Space>
                  <FileTextOutlined />
                  申报记录
                </Space>
              } 
              key="applications"
            >
              <Card>
                {applicationsLoading ? (
                  <div className="text-center py-8">加载中...</div>
                ) : projectApplications.length > 0 ? (
                  <Table
                    columns={applicationColumns}
                    dataSource={projectApplications}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true
                    }}
                    locale={{
                      emptyText: '暂无申报记录'
                    }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                    <div className="mt-4">
                      <Text type="secondary">暂无申报记录</Text>
                      <br />
                      <Button 
                        type="primary" 
                        className="mt-2"
                        onClick={() => navigate('/projects')}
                      >
                        浏览项目申报
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </TabPane>

            {/* 求职记录 */}
            <TabPane 
              tab={
                <Space>
                  <UserOutlined />
                  求职记录
                </Space>
              } 
              key="jobs"
            >
              <Card>
                {applicationsLoading ? (
                  <div className="text-center py-8">加载中...</div>
                ) : jobApplications.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <Button 
                        type="primary" 
                        onClick={() => navigate('/jobs')}
                      >
                        浏览更多职位
                      </Button>
                    </div>
                    <Table
                      columns={jobApplicationColumns}
                      dataSource={jobApplications}
                      rowKey="id"
                      pagination={{
                        pageSize: 5,
                        showSizeChanger: false
                      }}
                      size="small"
                      locale={{
                        emptyText: '暂无求职记录'
                      }}
                    />
                  </>
                ) : (
                  <div className="text-center py-8">
                    <UserOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                    <div className="mt-4">
                      <Text type="secondary">暂无求职记录</Text>
                      <br />
                      <Button 
                        type="primary" 
                        className="mt-2"
                        onClick={() => navigate('/jobs')}
                      >
                        浏览职位信息
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </TabPane>
          </Tabs>
        </div>
      </div>

      {/* 编辑资料模态框 */}
      <Modal
        title="编辑个人资料"
        open={isEditModalVisible}
        onOk={handleSaveProfile}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          <Form.Item
            name="title"
            label="职位"
          >
            <Input placeholder="请输入职位" />
          </Form.Item>
          
          <Form.Item
            name="company"
            label="公司"
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="所在地"
          >
            <Input placeholder="请输入所在地" />
          </Form.Item>
          
          <Form.Item
            name="education"
            label="教育背景"
          >
            <Input placeholder="请输入教育背景" />
          </Form.Item>
          
          <Form.Item
            name="bio"
            label="个人简介"
          >
            <TextArea rows={4} placeholder="请输入个人简介" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onOk={handleUpdatePassword}
        onCancel={() => setIsPasswordModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度至少8位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 申报详情模态框 */}
      <Modal
        title="申报详情"
        open={applicationDetailVisible}
        onCancel={() => setApplicationDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setApplicationDetailVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedApplication && (
          <Tabs defaultActiveKey="basic">
            <TabPane tab="基本信息" key="basic">
              <div className="space-y-6">
                {/* 申请基本信息 */}
                <Card 
                  title={
                    <Space>
                      <UserOutlined />
                      <span>申请信息</span>
                    </Space>
                  }
                  size="small"
                  className="bg-blue-50"
                >
                  <Descriptions column={2} bordered size="small">
                    {/* 根据申请类型显示不同的基本信息 */}
                    {selectedApplication.project ? (
                      <>
                        <Descriptions.Item label="项目名称">
                          {selectedApplication.project?.title}
                        </Descriptions.Item>
                        <Descriptions.Item label="项目类别">
                          {getCategoryLabel(selectedApplication.project?.category)}
                        </Descriptions.Item>
                      </>
                    ) : selectedApplication.job ? (
                      <>
                        <Descriptions.Item label="职位名称">
                          {selectedApplication.job?.title}
                        </Descriptions.Item>
                        <Descriptions.Item label="公司名称">
                          {selectedApplication.job?.company}
                        </Descriptions.Item>
                        <Descriptions.Item label="期望薪资">
                          {selectedApplication.expectedSalary ? `${selectedApplication.expectedSalary}元` : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="可入职时间">
                          {selectedApplication.availableDate ? new Date(selectedApplication.availableDate).toLocaleDateString() : '-'}
                        </Descriptions.Item>
                      </>
                    ) : null}
                    <Descriptions.Item label="提交时间">
                      {new Date(selectedApplication.createdAt).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="状态">
                      <Tag color={getStatusColor(selectedApplication.status)}>
                        {getStatusLabel(selectedApplication.status)}
                      </Tag>
                    </Descriptions.Item>
                    {selectedApplication.reviewedAt && (
                      <Descriptions.Item label="审核时间">
                        {new Date(selectedApplication.reviewedAt).toLocaleString()}
                      </Descriptions.Item>
                    )}
                    {selectedApplication.reviewNote && (
                      <Descriptions.Item label="审核意见" span={2}>
                        {selectedApplication.reviewNote}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                  
                  {/* 显示求职信（仅职位申请） */}
                  {selectedApplication.job && selectedApplication.coverLetter && (
                    <div className="mt-4">
                      <Title level={5}>求职信</Title>
                      <div className="p-4 bg-white rounded border">
                        <Text>{selectedApplication.coverLetter}</Text>
                      </div>
                    </div>
                  )}
                </Card>

                {/* 显示我的简历（仅职位申请且包含简历数据时） */}
                {selectedApplication.job && selectedApplication.resumeData && (
                <div className="mt-6">
                  <Title level={5}>我的简历</Title>
                  {(() => {
                    try {
                      const resumeData = typeof selectedApplication.resumeData === 'string' 
                        ? JSON.parse(selectedApplication.resumeData) 
                        : selectedApplication.resumeData;
                      
                      return (
                        <div className="space-y-4">
                          {/* 基本信息 */}
                          {resumeData.basicInfo && (
                            <div>
                              <Text strong className="text-base text-blue-700">基本信息</Text>
                              <Descriptions column={2} size="small" className="mt-2" bordered>
                                {resumeData.basicInfo.name && <Descriptions.Item label="姓名">{resumeData.basicInfo.name}</Descriptions.Item>}
                                {resumeData.basicInfo.phone && <Descriptions.Item label="联系方式">{resumeData.basicInfo.phone}</Descriptions.Item>}
                                {resumeData.basicInfo.email && <Descriptions.Item label="邮箱">{resumeData.basicInfo.email}</Descriptions.Item>}
                                {resumeData.basicInfo.hometown && <Descriptions.Item label="籍贯">{resumeData.basicInfo.hometown}</Descriptions.Item>}
                                {resumeData.basicInfo.birthDate && <Descriptions.Item label="出生年月">{resumeData.basicInfo.birthDate}</Descriptions.Item>}
                                {resumeData.basicInfo.maritalStatus && <Descriptions.Item label="婚育状态">{resumeData.basicInfo.maritalStatus}</Descriptions.Item>}
                                {resumeData.basicInfo.employmentStatus && <Descriptions.Item label="就业状态">{resumeData.basicInfo.employmentStatus}</Descriptions.Item>}
                              </Descriptions>
                            </div>
                          )}
                          
                          {/* 求职意向 */}
                          {resumeData.objective && (
                            <div>
                              <Text strong className="text-blue-700">求职意向</Text>
                              <div className="mt-1 p-3 bg-white rounded border">{resumeData.objective}</div>
                            </div>
                          )}
                          
                          {/* 个人总结 */}
                          {resumeData.summary && (
                            <div>
                              <Text strong className="text-blue-700">个人总结</Text>
                              <div className="mt-1 p-3 bg-white rounded border">{resumeData.summary}</div>
                            </div>
                          )}
                          
                          {/* 教育经历 */}
                          {resumeData.education && resumeData.education.length > 0 && (
                            <div>
                              <Text strong className="text-blue-700">教育经历</Text>
                              <div className="mt-2 space-y-2">
                                {resumeData.education.map((edu: any, index: number) => (
                                  <div key={index} className="p-3 bg-white rounded border">
                                    <div className="font-medium text-gray-800">{edu.school} - {edu.major}</div>
                                    <div className="text-sm text-gray-600">{edu.degree} | {edu.startDate} 至 {edu.endDate}</div>
                                    {edu.description && <div className="text-sm mt-2 text-gray-700">{edu.description}</div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 工作经历 */}
                          {resumeData.experience && resumeData.experience.length > 0 && (
                            <div>
                              <Text strong className="text-blue-700">工作经历</Text>
                              <div className="mt-2 space-y-2">
                                {resumeData.experience.map((exp: any, index: number) => (
                                  <div key={index} className="p-3 bg-white rounded border">
                                    <div className="font-medium text-gray-800">{exp.position} - {exp.company}</div>
                                    <div className="text-sm text-gray-600">{exp.startDate} 至 {exp.current ? '至今' : exp.endDate}</div>
                                    {exp.description && <div className="text-sm mt-2 text-gray-700">{exp.description}</div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 专业技能 */}
                          {resumeData.skills && resumeData.skills.length > 0 && (
                            <div>
                              <Text strong className="text-blue-700">专业技能</Text>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {resumeData.skills.map((skill: any, index: number) => (
                                  <Tag key={index} color="blue">
                                    {skill.name} {skill.category && `(${skill.category})`}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 证书资质 */}
                          {resumeData.certificates && resumeData.certificates.length > 0 && (
                            <div>
                              <Text strong className="text-blue-700">证书资质</Text>
                              <div className="mt-2 space-y-1">
                                {resumeData.certificates.map((cert: any, index: number) => (
                                  <div key={index} className="text-sm p-2 bg-white rounded border">
                                    <span className="font-medium">{cert.name}</span>
                                    <span className="text-gray-600 ml-2">({cert.issueDate})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 获得奖励 */}
                          {resumeData.awards && (
                            <div>
                              <Text strong className="text-blue-700">获得奖励</Text>
                              <div className="mt-1 p-3 bg-white rounded border">{resumeData.awards}</div>
                            </div>
                          )}
                          
                          {/* 兴趣爱好 */}
                          {resumeData.hobbies && (
                            <div>
                              <Text strong className="text-blue-700">兴趣爱好</Text>
                              <div className="mt-1 p-3 bg-white rounded border">{resumeData.hobbies}</div>
                            </div>
                          )}
                        </div>
                      );
                    } catch (e) {
                      return <div className="text-red-500">简历数据解析错误</div>;
                    }
                  })()}
                </div>
              )}
              
              {/* 显示个人信息 */}
              {selectedApplication.personalInfo && (
                <div className="mt-6">
                  <Title level={5}>个人详细信息</Title>
                  <Descriptions column={2} bordered size="small">
                    {(() => {
                      try {
                        const personalInfo = JSON.parse(selectedApplication.personalInfo);
                        return (
                          <>
                            {personalInfo.name && <Descriptions.Item label="姓名">{personalInfo.name}</Descriptions.Item>}
                            {personalInfo.phone && <Descriptions.Item label="电话">{personalInfo.phone}</Descriptions.Item>}
                            {personalInfo.email && <Descriptions.Item label="邮箱">{personalInfo.email}</Descriptions.Item>}
                            {personalInfo.education && <Descriptions.Item label="学历">{personalInfo.education}</Descriptions.Item>}
                            {personalInfo.experience && <Descriptions.Item label="工作经验" span={2}>{personalInfo.experience}</Descriptions.Item>}
                            {personalInfo.skills && <Descriptions.Item label="技能特长" span={2}>{personalInfo.skills}</Descriptions.Item>}
                          </>
                        );
                      } catch (e) {
                        return <Descriptions.Item label="解析错误">个人信息格式错误</Descriptions.Item>;
                      }
                    })()}
                  </Descriptions>
                </div>
              )}
              
              {/* 显示项目信息 */}
              {selectedApplication.projectInfo && (
                <div className="mt-6">
                  <Title level={5}>项目详细信息</Title>
                  <Descriptions column={1} bordered size="small">
                    {(() => {
                      try {
                        const projectInfo = JSON.parse(selectedApplication.projectInfo);
                        return (
                          <>
                            {projectInfo.projectName && <Descriptions.Item label="项目名称">{projectInfo.projectName}</Descriptions.Item>}
                            {projectInfo.projectDescription && <Descriptions.Item label="项目描述">{projectInfo.projectDescription}</Descriptions.Item>}
                            {projectInfo.expectedFunding && <Descriptions.Item label="预期资金">{projectInfo.expectedFunding}</Descriptions.Item>}
                            {projectInfo.timeline && <Descriptions.Item label="项目周期">{projectInfo.timeline}</Descriptions.Item>}
                            {projectInfo.marketAnalysis && <Descriptions.Item label="市场分析">{projectInfo.marketAnalysis}</Descriptions.Item>}
                            {projectInfo.competitiveAdvantage && <Descriptions.Item label="竞争优势">{projectInfo.competitiveAdvantage}</Descriptions.Item>}
                          </>
                        );
                      } catch (e) {
                        return <Descriptions.Item label="解析错误">项目信息格式错误</Descriptions.Item>;
                      }
                    })()}
                  </Descriptions>
                </div>
              )}
              </div>
            </TabPane>
            
            <TabPane tab="申报材料" key="documents">
              {(() => {
                  let attachmentFiles: Array<{name: string, url: string, type: string, size: number | null}> = [];
                  
                  if (selectedApplication.project) {
                    // 项目申请的文件处理
                    const resumeFiles = parseFileInfo(selectedApplication.resumeUrl, '简历')
                    const businessPlanFiles = parseFileInfo(selectedApplication.businessPlanUrl, '商业计划书')
                    const financialReportFiles = parseFileInfo(selectedApplication.financialReportUrl, '财务报告')
                    const otherDocsFiles = parseFileInfo(selectedApplication.otherDocsUrl, '其他材料')
                    attachmentFiles.push(...resumeFiles, ...businessPlanFiles, ...financialReportFiles, ...otherDocsFiles)
                  } else if (selectedApplication.job) {
                    // 职位申请的附件处理
                    if (selectedApplication.additionalDocs) {
                      attachmentFiles = parseFileInfo(selectedApplication.additionalDocs, '附件')
                    }
                  }
                  
                  return (
                    <div className="space-y-6">
                      {/* 附件部分 */}
                      {attachmentFiles.length > 0 ? (
                        <Card 
                          title={
                            <Space>
                              <FileTextOutlined />
                              <span>申报附件</span>
                            </Space>
                          }
                          size="small"
                          className="bg-green-50"
                        >
                          <div className="space-y-3">
                            {attachmentFiles.map((doc, index) => (
                              <div key={`doc-${index}-${doc.name}`} className="flex items-center justify-between p-3 bg-white border rounded hover:shadow-sm transition-shadow">
                                <Space>
                                  <FileTextOutlined className="text-green-600" />
                                  <div>
                                    <div className="font-medium text-gray-800">{doc.name}</div>
                                    <div className="text-sm text-gray-500">
                                      {doc.type} {doc.size && `• ${(doc.size / 1024).toFixed(2)} KB`}
                                    </div>
                                  </div>
                                </Space>
                                <Button 
                                  icon={<EyeOutlined />} 
                                  size="small"
                                  type="primary"
                                  ghost
                                  onClick={() => window.open(doc.url, '_blank')}
                                >
                                  查看
                                </Button>
                              </div>
                            ))}
                          </div>
                        </Card>
                      ) : (
                        /* 无材料提示 */
                        <div className="text-center text-gray-500 py-12">
                          <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                          <div className="mt-4">暂无申报材料</div>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  )
}

export default Profile