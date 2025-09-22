import React, { useState } from 'react'
import { 
  Table, 
  Card, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Modal, 
  Descriptions, 
  Tabs, 
  Timeline,
  Alert,
  message
} from 'antd'
import { 
  EyeOutlined, 
  CheckOutlined, 
  ReloadOutlined,
  UserOutlined,
  FileTextOutlined,
  DownloadOutlined,
  RollbackOutlined
} from '@ant-design/icons'
import { 
  useGetProjectApplicationsQuery, 
  useGetJobApplicationsQuery,
  useReviewProjectApplicationMutation,
  useReviewJobApplicationMutation
} from '../../store/api/adminApi'

const { Title, Text } = Typography

interface ApplicationManagementProps {}

const ApplicationManagement: React.FC<ApplicationManagementProps> = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'jobs'>('projects')
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)

  // API调用
  const { 
    data: projectApplicationsData, 
    isLoading: projectLoading, 
    error: projectError,
    refetch: refetchProjects 
  } = useGetProjectApplicationsQuery({})
  
  const { 
    data: jobApplicationsData, 
    isLoading: jobLoading, 
    error: jobError,
    refetch: refetchJobs 
  } = useGetJobApplicationsQuery({})
  
  const [reviewProjectApplication] = useReviewProjectApplicationMutation()
  const [reviewJobApplication] = useReviewJobApplicationMutation()

  // 数据处理
  const projectApplications = projectApplicationsData?.applications || []
  const jobApplications = jobApplicationsData?.applications || []
  const projectTotal = projectApplicationsData?.total || 0
  const jobTotal = jobApplicationsData?.total || 0
  const isLoading = projectLoading || jobLoading
  const error = projectError || jobError

  // 刷新数据
  const handleRefresh = () => {
    refetchProjects()
    refetchJobs()
    message.success('数据已刷新')
  }

  // 状态相关函数
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'orange'
      case 'APPROVED': return 'green'
      case 'REJECTED': return 'red'
      case 'RETURNED': return 'purple'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '待审核'
      case 'APPROVED': return '已通过'
      case 'REJECTED': return '已拒绝'
      case 'RETURNED': return '已退回'
      default: return '未知'
    }
  }

  // 审核操作
  const handleApprove = async (id: string, type: 'project' | 'job') => {
    try {
      if (type === 'project') {
        await reviewProjectApplication({ 
          id, 
          status: 'APPROVED',
          comment: '申请已通过审核'
        }).unwrap()
      } else {
        await reviewJobApplication({ 
          id, 
          status: 'APPROVED',
          comment: '申请已通过审核'
        }).unwrap()
      }
      message.success('审核通过')
      handleRefresh()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleReturn = async (id: string, type: 'project' | 'job') => {
    try {
      if (type === 'project') {
        await reviewProjectApplication({ 
          id, 
          status: 'RETURNED',
          comment: '申请需要补充材料，请重新提交'
        }).unwrap()
      } else {
        await reviewJobApplication({ 
          id, 
          status: 'RETURNED',
          comment: '申请需要补充材料，请重新提交'
        }).unwrap()
      }
      message.success('已退回申请')
      handleRefresh()
    } catch (error) {
      message.error('操作失败')
    }
  }

  // 查看详情
  const handleViewDetail = (record: any) => {
    setSelectedApplication(record)
    setDetailModalVisible(true)
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

  // 表格列定义
  const columns = [
    {
      title: '申请人',
      dataIndex: 'applicantName',
      key: 'applicantName',
      render: (name: string) => (
        <Space>
          <UserOutlined />
          {name}
        </Space>
      )
    },
    {
      title: activeTab === 'projects' ? '项目名称' : '职位名称',
      dataIndex: 'targetTitle',
      key: 'targetTitle'
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
      render: (time: string) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="link" 
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id, activeTab === 'projects' ? 'project' : 'job')}
              >
                通过
              </Button>
              <Button 
                type="link" 
                icon={<RollbackOutlined />}
                onClick={() => handleReturn(record.id, activeTab === 'projects' ? 'project' : 'job')}
              >
                退回
              </Button>
            </>
          )}
        </Space>
      )
    }
  ]

  // 渲染申报详情
  const renderApplicationDetail = () => {
    if (!selectedApplication) return null

    const tabItems = [
      {
        key: 'basic',
        label: '基本信息',
        children: (
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
                <Descriptions.Item label="申请人">{selectedApplication?.applicantName || '未知'}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{selectedApplication?.applicantEmail || '未提供'}</Descriptions.Item>
                <Descriptions.Item label={activeTab === 'projects' ? '项目名称' : '职位名称'}>
                  {selectedApplication?.targetTitle || '未知'}
                </Descriptions.Item>
                <Descriptions.Item label="申请类型">
                  {activeTab === 'projects' ? '项目申报' : '工作申请'}
                </Descriptions.Item>
                <Descriptions.Item label="提交时间">
                  {selectedApplication?.submitTime ? new Date(selectedApplication.submitTime).toLocaleString() : '未知'}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={getStatusColor(selectedApplication?.status || 'PENDING')}>
                    {getStatusLabel(selectedApplication?.status || 'PENDING')}
                  </Tag>
                </Descriptions.Item>
                {selectedApplication?.reviewTime && (
                  <Descriptions.Item label="审核时间">
                    {new Date(selectedApplication.reviewTime).toLocaleString()}
                  </Descriptions.Item>
                )}
                {selectedApplication?.reviewer && (
                  <Descriptions.Item label="审核人">{selectedApplication.reviewer}</Descriptions.Item>
                )}
                {selectedApplication?.reviewComment && (
                  <Descriptions.Item label="审核意见" span={2}>
                    {selectedApplication.reviewComment}
                  </Descriptions.Item>
                )}
              </Descriptions>
              
              {/* 显示求职信（仅职位申请） */}
              {activeTab === 'jobs' && (() => {
                const originalData = selectedApplication?.originalData;
                return originalData?.coverLetter && (
                  <div className="mt-4">
                    <Title level={5}>求职信</Title>
                    <div className="p-4 bg-white rounded border">
                      <Text>{originalData.coverLetter}</Text>
                    </div>
                  </div>
                );
              })()}
            </Card>

            {/* 显示我的简历（仅职位申请且包含简历时） */}
            {activeTab === 'jobs' && (() => {
              const originalData = selectedApplication?.originalData;
              return originalData?.resumeData && (
                <Card 
                  title={
                    <Space>
                      <FileTextOutlined />
                      <span>我的简历</span>
                    </Space>
                  }
                  size="small"
                  className="bg-green-50"
                >
                  {(() => {
                    try {
                      const resumeData = (() => {
                        try {
                          if (typeof originalData.resumeData === 'string') {
                            return JSON.parse(originalData.resumeData);
                          }
                          return originalData.resumeData || {};
                        } catch (error) {
                          console.error('简历数据解析错误:', error);
                          return {};
                        }
                      })();
                    
                      return (
                        <div className="space-y-4">
                          {/* 基本信息 */}
                          {resumeData.basicInfo && (
                            <div>
                              <Text strong className="text-base text-blue-700">基本信息</Text>
                              <Descriptions column={2} size="small" className="mt-2" bordered>
                                {resumeData?.basicInfo?.name && <Descriptions.Item label="姓名">{resumeData.basicInfo.name}</Descriptions.Item>}
                                {resumeData?.basicInfo?.phone && <Descriptions.Item label="联系方式">{resumeData.basicInfo.phone}</Descriptions.Item>}
                                {resumeData?.basicInfo?.email && <Descriptions.Item label="邮箱">{resumeData.basicInfo.email}</Descriptions.Item>}
                                {resumeData?.basicInfo?.hometown && <Descriptions.Item label="籍贯">{resumeData.basicInfo.hometown}</Descriptions.Item>}
                                {resumeData?.basicInfo?.birthDate && <Descriptions.Item label="出生年月">{resumeData.basicInfo.birthDate}</Descriptions.Item>}
                                {resumeData?.basicInfo?.maritalStatus && <Descriptions.Item label="婚育状态">{resumeData.basicInfo.maritalStatus}</Descriptions.Item>}
                                {resumeData?.basicInfo?.employmentStatus && <Descriptions.Item label="就业状态">{resumeData.basicInfo.employmentStatus}</Descriptions.Item>}
                              </Descriptions>
                            </div>
                          )}
                          
                          {/* 求职意向 */}
                          {resumeData?.objective && (
                            <div>
                              <Text strong className="text-blue-700">求职意向</Text>
                              <div className="mt-1 p-3 bg-white rounded border">{resumeData.objective}</div>
                            </div>
                          )}
                          
                          {/* 个人总结 */}
                          {resumeData?.summary && (
                            <div>
                              <Text strong className="text-blue-700">个人总结</Text>
                              <div className="mt-1 p-3 bg-white rounded border">{resumeData.summary}</div>
                            </div>
                          )}
                          
                          {/* 教育经历 */}
                          {resumeData?.education && Array.isArray(resumeData.education) && resumeData.education.length > 0 && (
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
                          {resumeData?.experience && Array.isArray(resumeData.experience) && resumeData.experience.length > 0 && (
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
                          {resumeData?.skills && Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && (
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
                          {resumeData?.certificates && Array.isArray(resumeData.certificates) && resumeData.certificates.length > 0 && (
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
                          {resumeData?.awards && (
                            <div>
                              <Text strong className="text-blue-700">获得奖励</Text>
                              <div className="mt-1 p-3 bg-white rounded border">{resumeData.awards}</div>
                            </div>
                          )}
                          
                          {/* 兴趣爱好 */}
                          {resumeData?.hobbies && (
                            <div>
                              <Text strong className="text-blue-700">兴趣爱好</Text>
                              <div className="mt-1 p-3 bg-white rounded border">{resumeData.hobbies}</div>
                            </div>
                          )}
                        </div>
                      );
                    } catch (error) {
                      return <Text type="secondary">简历数据格式错误</Text>;
                    }
                  })()}
                </Card>
              );
            })()}

            {/* 项目申请的详细信息 */}
            {activeTab === 'projects' && (() => {
              const personalInfoStr = selectedApplication.personalInfo || selectedApplication.originalData?.personalInfo
              const projectInfoStr = selectedApplication.projectInfo || selectedApplication.originalData?.projectInfo
              
              return (
                <>
                  {personalInfoStr && (
                    <Card 
                      title={
                        <Space>
                          <UserOutlined />
                          <span>个人详细信息</span>
                        </Space>
                      }
                      size="small"
                    >
                      <Descriptions column={2} bordered size="small">
                        {(() => {
                          try {
                            const personalInfo = JSON.parse(personalInfoStr);
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
                    </Card>
                  )}
                  
                  {projectInfoStr && (
                    <Card 
                      title={
                        <Space>
                          <ProjectOutlined />
                          <span>项目详细信息</span>
                        </Space>
                      }
                      size="small"
                    >
                      <Descriptions column={1} bordered size="small">
                        {(() => {
                          try {
                            const projectInfo = JSON.parse(projectInfoStr);
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
                    </Card>
                  )}
                </>
              );
            })()}
          </div>
        )
      },
      {
        key: 'documents',
        label: '申报材料',
        children: (
          <div className="space-y-4">
            {(() => {
              const documents: Array<{name: string, url: string, type: string, size: number | null}> = [];
              
              // 添加调试信息
              console.log('=== 申报详情数据调试 ===');
              console.log('申请人:', selectedApplication?.applicantName || '未知');
              console.log('当前标签页:', activeTab);
              
              // 从originalData中获取实际数据
              const originalData = selectedApplication?.originalData;
              console.log('原始数据:', originalData);
              console.log('简历URL:', originalData?.resumeUrl || '无');
              console.log('附加文档:', originalData?.additionalDocs || '无');
              console.log('简历数据:', originalData?.resumeData ? '有简历数据' : '无简历数据');
              console.log('职位信息:', originalData?.job || '无职位信息');
              console.log('求职信:', originalData?.coverLetter ? '有求职信' : '无求职信');
              console.log('完整申请数据:', selectedApplication);
              
              if (activeTab === 'projects') {
                // 项目申请的文件
                const resumeUrl = selectedApplication.resumeUrl || selectedApplication.originalData?.resumeUrl
                const businessPlanUrl = selectedApplication.businessPlanUrl || selectedApplication.originalData?.businessPlanUrl
                const financialReportUrl = selectedApplication.financialReportUrl || selectedApplication.originalData?.financialReportUrl
                const otherDocsUrl = selectedApplication.otherDocsUrl || selectedApplication.originalData?.otherDocsUrl
                
                const resumeFiles = parseFileInfo(resumeUrl, '简历')
                const businessPlanFiles = parseFileInfo(businessPlanUrl, '商业计划书')
                const financialReportFiles = parseFileInfo(financialReportUrl, '财务报告')
                const otherDocsFiles = parseFileInfo(otherDocsUrl, '其他材料')
                
                documents.push(...resumeFiles, ...businessPlanFiles, ...financialReportFiles, ...otherDocsFiles)
              } else {
                // 职位申请的文件（只包含上传的附件，不包含简历数据）
                const originalData = selectedApplication?.originalData;
                console.log('职位申请文件解析:', {
                  resumeUrl: originalData?.resumeUrl,
                  additionalDocs: originalData?.additionalDocs
                });
                
                if (originalData?.resumeUrl) {
                  const resumeFiles = parseFileInfo(originalData.resumeUrl, '简历文件')
                  console.log('解析的简历文件:', resumeFiles);
                  documents.push(...resumeFiles)
                }
                if (originalData?.additionalDocs) {
                  const additionalFiles = parseFileInfo(originalData.additionalDocs, '附加材料')
                  console.log('解析的附加材料:', additionalFiles);
                  documents.push(...additionalFiles)
                }
              }
              
              console.log('最终文档列表:', documents);
              
              return (
                <div className="space-y-4">
                  {/* 申报附件部分 */}
                  {documents.length > 0 && (
                    <Card 
                      title={
                        <Space>
                          <FileTextOutlined />
                          <span>申报附件</span>
                          <Tag color="green">上传文件</Tag>
                        </Space>
                      }
                      size="small"
                      className="bg-green-50"
                    >
                      <div className="space-y-3">
                        {documents.map((doc, index) => (
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
                            <Space>
                              <Button 
                                icon={<EyeOutlined />} 
                                size="small"
                                type="primary"
                                ghost
                                onClick={() => window.open(doc.url, '_blank')}
                              >
                                查看
                              </Button>
                              <Button 
                                icon={<DownloadOutlined />} 
                                size="small"
                                onClick={() => {
                                  const link = document.createElement('a')
                                  link.href = doc.url
                                  link.download = doc.name
                                  link.click()
                                }}
                              >
                                下载
                              </Button>
                            </Space>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                  
                  {/* 无材料提示 */}
                  {documents.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                      <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                      <div className="mt-4">暂无申报材料</div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )
      }
    ];

    return <Tabs items={tabItems} />
  }

  // 主标签页配置
  const mainTabItems = [
    {
      key: 'projects',
      label: `项目申报 (${projectTotal})`,
      children: (
        <Table
          columns={columns}
          dataSource={projectApplications}
          loading={isLoading}
          rowKey="id"
          pagination={{
            total: projectTotal,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      )
    },
    {
      key: 'jobs',
      label: `工作申请 (${jobTotal})`,
      children: (
        <Table
          columns={columns}
          dataSource={jobApplications}
          loading={isLoading}
          rowKey="id"
          pagination={{
            total: jobTotal,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>申报管理</Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={isLoading}
        >
          刷新数据
        </Button>
      </div>

      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key as 'projects' | 'jobs')}
          items={mainTabItems}
        />
      </Card>

      <Modal
        title="申报详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={1000}
        footer={null}
      >
        {renderApplicationDetail()}
      </Modal>
    </div>
  )
}

export default ApplicationManagement