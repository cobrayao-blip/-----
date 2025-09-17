import React, { useState } from 'react'
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Switch, 
  InputNumber,
  Select,
  Upload,
  message,
  Tabs,
  Divider,
  Space,
  Alert,
  Progress,
  Statistic,
  Table
} from 'antd'
import { 
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  CloudUploadOutlined,
  MailOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

const SystemSettings: React.FC = () => {
  const [basicForm] = Form.useForm()
  const [emailForm] = Form.useForm()
  const [securityForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 模拟系统统计数据
  const systemStats = {
    totalStorage: 100, // GB
    usedStorage: 45,   // GB
    totalUsers: 1248,
    activeUsers: 892,
    totalApplications: 234,
    systemUptime: '15天 8小时 32分钟'
  }

  // 模拟系统日志
  const systemLogs = [
    {
      id: '1',
      time: '2024-01-15 14:30:00',
      level: 'INFO',
      message: '用户登录成功',
      user: 'zhangsan@example.com'
    },
    {
      id: '2',
      time: '2024-01-15 14:25:00',
      level: 'WARN',
      message: '存储空间使用率超过40%',
      user: 'system'
    },
    {
      id: '3',
      time: '2024-01-15 14:20:00',
      level: 'ERROR',
      message: '邮件发送失败',
      user: 'system'
    }
  ]

  const handleSaveBasicSettings = async () => {
    try {
      setLoading(true)
      const values = await basicForm.validateFields()
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('基础设置保存成功')
    } catch (error) {
      message.error('保存失败，请检查输入信息')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEmailSettings = async () => {
    try {
      setLoading(true)
      const values = await emailForm.validateFields()
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('邮件设置保存成功')
    } catch (error) {
      message.error('保存失败，请检查输入信息')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSecuritySettings = async () => {
    try {
      setLoading(true)
      const values = await securityForm.validateFields()
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('安全设置保存成功')
    } catch (error) {
      message.error('保存失败，请检查输入信息')
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      message.success('测试邮件发送成功')
    } catch (error) {
      message.error('测试邮件发送失败')
    } finally {
      setLoading(false)
    }
  }

  const handleBackupDatabase = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 3000))
      message.success('数据库备份完成')
    } catch (error) {
      message.error('数据库备份失败')
    } finally {
      setLoading(false)
    }
  }

  const logColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => {
        const colors = {
          'INFO': 'blue',
          'WARN': 'orange',
          'ERROR': 'red'
        }
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium bg-${colors[level as keyof typeof colors]}-100 text-${colors[level as keyof typeof colors]}-800`}>
            {level}
          </span>
        )
      }
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 150
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>系统设置</Title>
      </div>

      <Tabs defaultActiveKey="basic">
        {/* 基础设置 */}
        <TabPane 
          tab={
            <Space>
              <SettingOutlined />
              基础设置
            </Space>
          } 
          key="basic"
        >
          <Card>
            <Form
              form={basicForm}
              layout="vertical"
              initialValues={{
                siteName: '逍遥人才网',
                siteDescription: '专业的人才服务平台',
                siteKeywords: '人才,招聘,创业,政策',
                registrationEnabled: true,
                maintenanceMode: false,
                maxFileSize: 10,
                allowedFileTypes: 'pdf,doc,docx,jpg,png'
              }}
            >
              <Form.Item
                name="siteName"
                label="网站名称"
                rules={[{ required: true, message: '请输入网站名称' }]}
              >
                <Input placeholder="请输入网站名称" />
              </Form.Item>

              <Form.Item
                name="siteDescription"
                label="网站描述"
                rules={[{ required: true, message: '请输入网站描述' }]}
              >
                <TextArea rows={3} placeholder="请输入网站描述" />
              </Form.Item>

              <Form.Item
                name="siteKeywords"
                label="网站关键词"
              >
                <Input placeholder="请输入网站关键词，用逗号分隔" />
              </Form.Item>

              <Form.Item
                name="registrationEnabled"
                label="允许用户注册"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="maintenanceMode"
                label="维护模式"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="maxFileSize"
                label="最大文件上传大小(MB)"
              >
                <InputNumber min={1} max={100} />
              </Form.Item>

              <Form.Item
                name="allowedFileTypes"
                label="允许的文件类型"
              >
                <Input placeholder="请输入允许的文件类型，用逗号分隔" />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={handleSaveBasicSettings}
                  loading={loading}
                >
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* 邮件设置 */}
        <TabPane 
          tab={
            <Space>
              <MailOutlined />
              邮件设置
            </Space>
          } 
          key="email"
        >
          <Card>
            <Form
              form={emailForm}
              layout="vertical"
              initialValues={{
                smtpHost: 'smtp.example.com',
                smtpPort: 587,
                smtpUser: 'noreply@example.com',
                smtpSecurity: 'tls',
                fromName: '逍遥人才网',
                fromEmail: 'noreply@example.com'
              }}
            >
              <Alert
                message="邮件配置"
                description="配置SMTP服务器用于发送系统邮件，包括注册确认、密码重置等。"
                type="info"
                showIcon
                className="mb-4"
              />

              <Form.Item
                name="smtpHost"
                label="SMTP服务器"
                rules={[{ required: true, message: '请输入SMTP服务器地址' }]}
              >
                <Input placeholder="请输入SMTP服务器地址" />
              </Form.Item>

              <Form.Item
                name="smtpPort"
                label="SMTP端口"
                rules={[{ required: true, message: '请输入SMTP端口' }]}
              >
                <InputNumber min={1} max={65535} />
              </Form.Item>

              <Form.Item
                name="smtpUser"
                label="SMTP用户名"
                rules={[{ required: true, message: '请输入SMTP用户名' }]}
              >
                <Input placeholder="请输入SMTP用户名" />
              </Form.Item>

              <Form.Item
                name="smtpPassword"
                label="SMTP密码"
                rules={[{ required: true, message: '请输入SMTP密码' }]}
              >
                <Input.Password placeholder="请输入SMTP密码" />
              </Form.Item>

              <Form.Item
                name="smtpSecurity"
                label="加密方式"
                rules={[{ required: true, message: '请选择加密方式' }]}
              >
                <Select>
                  <Option value="none">无加密</Option>
                  <Option value="ssl">SSL</Option>
                  <Option value="tls">TLS</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="fromName"
                label="发件人名称"
                rules={[{ required: true, message: '请输入发件人名称' }]}
              >
                <Input placeholder="请输入发件人名称" />
              </Form.Item>

              <Form.Item
                name="fromEmail"
                label="发件人邮箱"
                rules={[
                  { required: true, message: '请输入发件人邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入发件人邮箱" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    onClick={handleSaveEmailSettings}
                    loading={loading}
                  >
                    保存设置
                  </Button>
                  <Button 
                    icon={<MailOutlined />}
                    onClick={handleTestEmail}
                    loading={loading}
                  >
                    发送测试邮件
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* 安全设置 */}
        <TabPane 
          tab={
            <Space>
              <SecurityScanOutlined />
              安全设置
            </Space>
          } 
          key="security"
        >
          <Card>
            <Form
              form={securityForm}
              layout="vertical"
              initialValues={{
                passwordMinLength: 8,
                passwordRequireSpecial: true,
                sessionTimeout: 24,
                maxLoginAttempts: 5,
                lockoutDuration: 30,
                twoFactorEnabled: false
              }}
            >
              <Alert
                message="安全配置"
                description="配置系统安全策略，包括密码策略、登录限制等。"
                type="warning"
                showIcon
                className="mb-4"
              />

              <Form.Item
                name="passwordMinLength"
                label="密码最小长度"
              >
                <InputNumber min={6} max={20} />
              </Form.Item>

              <Form.Item
                name="passwordRequireSpecial"
                label="密码必须包含特殊字符"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="会话超时时间(小时)"
              >
                <InputNumber min={1} max={168} />
              </Form.Item>

              <Form.Item
                name="maxLoginAttempts"
                label="最大登录尝试次数"
              >
                <InputNumber min={3} max={10} />
              </Form.Item>

              <Form.Item
                name="lockoutDuration"
                label="账户锁定时长(分钟)"
              >
                <InputNumber min={5} max={1440} />
              </Form.Item>

              <Form.Item
                name="twoFactorEnabled"
                label="启用双因素认证"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={handleSaveSecuritySettings}
                  loading={loading}
                >
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* 系统监控 */}
        <TabPane 
          tab={
            <Space>
              <DatabaseOutlined />
              系统监控
            </Space>
          } 
          key="monitor"
        >
          <div className="space-y-6">
            {/* 系统统计 */}
            <Card title="系统统计">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Statistic
                  title="总用户数"
                  value={systemStats.totalUsers}
                  suffix="人"
                />
                <Statistic
                  title="活跃用户"
                  value={systemStats.activeUsers}
                  suffix="人"
                />
                <Statistic
                  title="总申报数"
                  value={systemStats.totalApplications}
                  suffix="个"
                />
                <Statistic
                  title="系统运行时间"
                  value={systemStats.systemUptime}
                />
              </div>
            </Card>

            {/* 存储使用情况 */}
            <Card title="存储使用情况">
              <div className="mb-4">
                <Text>已使用: {systemStats.usedStorage}GB / {systemStats.totalStorage}GB</Text>
              </div>
              <Progress 
                percent={(systemStats.usedStorage / systemStats.totalStorage) * 100} 
                status={systemStats.usedStorage / systemStats.totalStorage > 0.8 ? 'exception' : 'active'}
              />
            </Card>

            {/* 数据库管理 */}
            <Card title="数据库管理">
              <Space>
                <Button 
                  icon={<DatabaseOutlined />}
                  onClick={handleBackupDatabase}
                  loading={loading}
                >
                  备份数据库
                </Button>
                <Button icon={<ReloadOutlined />}>
                  优化数据库
                </Button>
                <Upload>
                  <Button icon={<CloudUploadOutlined />}>
                    恢复数据库
                  </Button>
                </Upload>
              </Space>
            </Card>

            {/* 系统日志 */}
            <Card title="系统日志">
              <Table
                columns={logColumns}
                dataSource={systemLogs}
                rowKey="id"
                size="small"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true
                }}
              />
            </Card>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default SystemSettings