import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Button, 
  Result, 
  Space, 
  Timeline,
  Tag,
  Descriptions
} from 'antd'
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const ApplicationSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const applicationId = `APP${Date.now().toString().slice(-8)}`

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <Result
            status="success"
            title="申报提交成功！"
            subTitle={`您的申报编号：${applicationId}，我们将在3-5个工作日内完成初审。`}
            extra={[
              <Button type="primary" key="applications" onClick={() => navigate('/my-applications')}>
                <UnorderedListOutlined /> 查看我的申报
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>
                <HomeOutlined /> 返回首页
              </Button>,
              <Button key="projects" onClick={() => navigate('/projects')}>
                浏览更多项目
              </Button>
            ]}
          />

          <div className="mt-8">
            <Card title="申报信息" size="small" className="mb-6">
              <Descriptions column={2}>
                <Descriptions.Item label="申报编号">{applicationId}</Descriptions.Item>
                <Descriptions.Item label="申报时间">{new Date().toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="申报状态">
                  <Tag color="processing">待审核</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="预计审核时间">3-5个工作日</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="审核流程" size="small">
              <Timeline
                items={[
                  {
                    color: 'green',
                    dot: <CheckCircleOutlined className="text-green-500" />,
                    children: (
                      <div>
                        <div className="font-medium">申报提交</div>
                        <div className="text-sm text-gray-500">
                          {new Date().toLocaleString()} - 已完成
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: 'blue',
                    dot: <ClockCircleOutlined className="text-blue-500" />,
                    children: (
                      <div>
                        <div className="font-medium">材料审核</div>
                        <div className="text-sm text-gray-500">
                          预计1-2个工作日 - 进行中
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: 'gray',
                    dot: <FileTextOutlined className="text-gray-400" />,
                    children: (
                      <div>
                        <div className="font-medium">专家评审</div>
                        <div className="text-sm text-gray-500">
                          预计2-3个工作日 - 待开始
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: 'gray',
                    dot: <CheckCircleOutlined className="text-gray-400" />,
                    children: (
                      <div>
                        <div className="font-medium">结果通知</div>
                        <div className="text-sm text-gray-500">
                          审核完成后 - 待开始
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <Title level={5} className="text-blue-800 mb-2">
              <FileTextOutlined /> 温馨提示
            </Title>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• 请保持手机畅通，我们会通过短信或电话联系您</li>
              <li>• 如需补充材料，请及时响应并提供</li>
              <li>• 您可以随时在"我的申报"中查看审核进度</li>
              <li>• 如有疑问，请联系客服：400-123-4567</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ApplicationSuccess