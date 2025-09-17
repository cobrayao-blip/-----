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
  Timeline,
  Divider,
  List
} from 'antd'
import { 
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  SafetyOutlined,
  FileTextOutlined,
  TrophyOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../store'
import { updateUser } from '../store/slices/authSlice'
import { useGetResumeQuery } from '../services/resumeApi'
import { useUpdateAvatarMutation } from '../store/api/authApi'
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
  
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  // 获取用户简历数据
  const { data: resumeData, isLoading: resumeLoading, error: resumeError } = useGetResumeQuery()
  
  // 更新头像API
  const [updateAvatarApi, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation()

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

  // 模拟用户详细信息
  const userProfile = {
    id: user?.id || '1',
    name: user?.name || '张三',
    email: user?.email || 'zhangsan@example.com',
    phone: '13800138001',
    avatar: null,
    title: '高级软件工程师',
    company: '科技创新有限公司',
    location: '北京市海淀区',
    bio: '专注于人工智能和机器学习领域，有5年以上的项目开发经验。',
    skills: ['JavaScript', 'Python', 'React', '机器学习', 'Node.js'],
    education: '清华大学 计算机科学与技术 硕士',
    experience: '5年',
    joinDate: '2024-01-10',
    profileCompletion: 85
  }

  // 模拟求职申请记录
  const jobApplications = [
    {
      id: '1',
      jobTitle: '高级前端工程师',
      company: '腾讯科技有限公司',
      status: 'INTERVIEW_SCHEDULED',
      applyTime: '2024-01-15 14:30:00',
      salary: '25K-35K'
    },
    {
      id: '2',
      jobTitle: 'Python后端开发工程师',
      company: '字节跳动科技有限公司',
      status: 'PENDING',
      applyTime: '2024-01-20 09:15:00',
      salary: '30K-45K'
    },
    {
      id: '3',
      jobTitle: 'UI/UX设计师',
      company: '美团点评',
      status: 'REJECTED',
      applyTime: '2024-01-10 16:45:00',
      salary: '20K-30K'
    }
  ]

  // 模拟申报记录
  const applications = [
    {
      id: '1',
      projectTitle: 'AI智能客服系统',
      supportProject: '人工智能产业扶持项目',
      status: 'APPROVED',
      submitTime: '2024-01-15 14:30:00',
      reviewTime: '2024-01-18 10:20:00'
    },
    {
      id: '2',
      projectTitle: '智慧农业物联网平台',
      supportProject: '现代农业扶持项目',
      status: 'PENDING',
      submitTime: '2024-01-20 09:15:00'
    },
    {
      id: '3',
      projectTitle: '区块链供应链管理',
      supportProject: '数字经济扶持项目',
      status: 'REJECTED',
      submitTime: '2024-01-10 16:45:00',
      reviewTime: '2024-01-12 14:30:00'
    }
  ]

  // 模拟活动记录
  const activities = [
    {
      time: '2024-01-20 09:15:00',
      content: '提交了"智慧农业物联网平台"项目申报',
      type: 'application'
    },
    {
      time: '2024-01-18 10:20:00',
      content: '"AI智能客服系统"项目申报审核通过',
      type: 'approval'
    },
    {
      time: '2024-01-15 14:30:00',
      content: '提交了"AI智能客服系统"项目申报',
      type: 'application'
    },
    {
      time: '2024-01-10 10:30:00',
      content: '完善了个人资料信息',
      type: 'profile'
    }
  ]

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待审核',
      'APPROVED': '已通过',
      'REJECTED': '已拒绝',
      'UNDER_REVIEW': '审核中'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'PENDING': 'processing',
      'APPROVED': 'success',
      'REJECTED': 'error',
      'UNDER_REVIEW': 'warning'
    }
    return colorMap[status] || 'default'
  }

  const handleEditProfile = () => {
    form.setFieldsValue(userProfile)
    setIsEditModalVisible(true)
  }

  const handleChangePassword = () => {
    passwordForm.resetFields()
    setIsPasswordModalVisible(true)
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('个人资料更新成功')
      setIsEditModalVisible(false)
    } catch (error) {
      message.error('保存失败，请检查输入信息')
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
          <div className="font-medium">{record.jobTitle}</div>
          <Text type="secondary" className="text-sm">{record.company}</Text>
        </div>
      )
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      key: 'salary'
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
      dataIndex: 'applyTime',
      key: 'applyTime',
      render: (time: string) => new Date(time).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'actions',
      render: () => (
        <Button type="link" icon={<EyeOutlined />} size="small">
          查看
        </Button>
      )
    }
  ]

  const applicationColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectTitle',
      key: 'projectTitle'
    },
    {
      title: '扶持项目',
      dataIndex: 'supportProject',
      key: 'supportProject'
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
      dataIndex: 'submitTime',
      key: 'submitTime',
      render: (time: string) => new Date(time).toLocaleDateString()
    },
    {
      title: '审核时间',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      render: (time: string) => time ? new Date(time).toLocaleDateString() : '-'
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
            
            <Title level={4} className="mb-2">{userProfile.name}</Title>
            <Text type="secondary" className="block mb-4">{userProfile.title}</Text>
            
            <div className="mb-4">
              <Text strong>资料完整度</Text>
              <Progress 
                percent={userProfile.profileCompletion} 
                size="small" 
                className="mt-2"
              />
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
            </Space>
          </Card>

          {/* 统计信息 */}
          <Card title="我的统计" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Statistic
                title="申报项目"
                value={applications.length}
                suffix="个"
              />
              <Statistic
                title="通过项目"
                value={applications.filter(app => app.status === 'APPROVED').length}
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
                    {resumeData?.basicInfo?.hometown || userProfile.location}
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
                    {resumeData?.basicInfo?.personalSummary || userProfile.bio}
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
                <Table
                  columns={applicationColumns}
                  dataSource={applications}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true
                  }}
                />
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
                <div className="mb-4">
                  <Button 
                    type="primary" 
                    onClick={() => window.open('/job-applications', '_blank')}
                  >
                    查看完整求职记录
                  </Button>
                </div>
                <Table
                  columns={jobApplicationColumns}
                  dataSource={jobApplications.slice(0, 5)}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
                {jobApplications.length > 5 && (
                  <div className="text-center mt-4">
                    <Text type="secondary">
                      显示最近5条记录，共{jobApplications.length}条
                    </Text>
                  </div>
                )}
              </Card>
            </TabPane>

            {/* 活动记录 */}
            <TabPane 
              tab={
                <Space>
                  <TrophyOutlined />
                  活动记录
                </Space>
              } 
              key="activities"
            >
              <Card>
                <Timeline
                  items={activities.map((activity, index) => ({
                    children: (
                      <div>
                        <Text>{activity.content}</Text>
                        <br />
                        <Text type="secondary" className="text-xs">
                          {new Date(activity.time).toLocaleString()}
                        </Text>
                      </div>
                    ),
                    color: activity.type === 'approval' ? 'green' : 
                           activity.type === 'application' ? 'blue' : 'gray'
                  }))}
                />
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
    </div>
  )
}

export default Profile