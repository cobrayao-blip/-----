import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始填充种子数据...')

  // 清空现有数据
  await prisma.jobApplication.deleteMany()
  await prisma.projectApplication.deleteMany()
  await prisma.jobOpportunity.deleteMany()
  await prisma.startupProject.deleteMany()
  await prisma.policy.deleteMany()
  await prisma.park.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.admin.deleteMany()

  console.log('已清空现有数据')

  // 创建用户
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@xiaoyao.com',
        name: '系统管理员',
        password: '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', // 实际应用中应该是加密后的密码
        role: 'ADMIN',
        phone: '13800138000'
      }
    }),
    prisma.user.create({
      data: {
        email: 'zhangsan@example.com',
        name: '张三',
        password: '$2b$10$rOzJqQqQqQqQqQqQqQqQqO',
        role: 'USER',
        phone: '13800138001'
      }
    }),
    prisma.user.create({
      data: {
        email: 'lisi@example.com',
        name: '李四',
        password: '$2b$10$rOzJqQqQqQqQqQqQqQqQqO',
        role: 'EMPLOYER',
        phone: '13800138002'
      }
    })
  ])

  console.log('用户创建完成:', users.length)

  // 创建产业园区
  const parks = await Promise.all([
    prisma.park.create({
      data: {
        name: '中关村科技园',
        description: '中国最具影响力的高科技园区，聚集了众多知名科技企业和创新团队。',
        type: 'TECH',
        level: 'NATIONAL',
        province: '北京市',
        city: '北京市',
        district: '海淀区',
        address: '北京市海淀区中关村大街',
        establishedYear: 1988,
        area: 488.0,
        industries: 'AI,软件开发,生物医药,新材料',
        policies: '{"tax":"税收优惠","talent":"人才引进","startup":"创业扶持"}',
        contact: '{"phone":"010-82691000","website":"http://www.zgc.gov.cn"}',
        images: '["zhongguancun1.jpg","zhongguancun2.jpg"]',
        status: 'PUBLISHED'
      }
    }),
    prisma.park.create({
      data: {
        name: '深圳前海深港现代服务业合作区',
        description: '国家级现代服务业合作区，重点发展金融、现代物流、信息服务等产业。',
        type: 'ECONOMIC',
        level: 'NATIONAL',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        address: '深圳市南山区前海路',
        establishedYear: 2010,
        area: 28.2,
        industries: '金融服务,现代物流,信息服务,科技服务',
        policies: '{"tax":"15%企业所得税","talent":"人才奖励","innovation":"创新支持"}',
        contact: '{"phone":"0755-88228888","website":"http://www.szqh.com.cn"}',
        images: '["qianhai1.jpg","qianhai2.jpg"]',
        status: 'PUBLISHED'
      }
    }),
    prisma.park.create({
      data: {
        name: '杭州未来科技城',
        description: '以信息经济为主导的科技新城，阿里巴巴等知名企业总部所在地。',
        type: 'HIGH_TECH',
        level: 'PROVINCIAL',
        province: '浙江省',
        city: '杭州市',
        district: '余杭区',
        address: '杭州市余杭区文一西路',
        establishedYear: 2011,
        area: 123.0,
        industries: '互联网,人工智能,大数据,云计算',
        policies: '{"funding":"最高1亿元项目资助","housing":"人才安居","education":"子女入学"}',
        contact: '{"phone":"0571-89898989","website":"http://www.futuretech.gov.cn"}',
        images: '["hangzhou1.jpg","hangzhou2.jpg"]',
        status: 'PUBLISHED'
      }
    }),
    prisma.park.create({
      data: {
        name: '上海张江高科技园区',
        description: '国家自主创新示范区核心园区，生物医药和集成电路产业集聚地。',
        type: 'HIGH_TECH',
        level: 'NATIONAL',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        address: '上海市浦东新区张江路',
        establishedYear: 1992,
        area: 25.0,
        industries: '生物医药,集成电路,软件信息,新能源',
        policies: '{"tax":"研发费用加计扣除","certification":"高新技术企业认定","talent":"人才落户"}',
        contact: '{"phone":"021-50801234","website":"http://www.zjpark.com"}',
        images: '["zhangjiang1.jpg","zhangjiang2.jpg"]',
        status: 'PUBLISHED'
      }
    })
  ])

  console.log('产业园区创建完成:', parks.length)

  // 创建政策
  const policies = await Promise.all([
    prisma.policy.create({
      data: {
        title: '关于进一步加强高层次人才引进工作的实施意见',
        summary: '为深入实施人才强国战略，进一步加强高层次人才引进工作，制定本实施意见。',
        content: '为深入实施人才强国战略，进一步加强高层次人才引进工作，现结合实际，制定本实施意见。一、总体要求...',
        type: 'TALENT',
        level: 'NATIONAL',
        publishDate: new Date('2024-01-15'),
        effectiveDate: new Date('2024-02-01'),
        expiryDate: new Date('2026-12-31'),
        department: '人力资源和社会保障部',
        tags: '人才引进,高层次人才,政策支持',
        keywords: '人才,引进,高层次,实施意见',
        attachments: 'policy1.pdf',
        viewCount: 1250,
        status: 'PUBLISHED'
      }
    }),
    prisma.policy.create({
      data: {
        title: '创业投资企业税收优惠政策',
        summary: '为支持创业投资发展，促进科技成果转化，对符合条件的创业投资企业给予税收优惠。',
        content: '为支持创业投资发展，促进科技成果转化，现对符合条件的创业投资企业给予税收优惠。一、适用范围...',
        type: 'TAX',
        level: 'NATIONAL',
        publishDate: new Date('2024-01-10'),
        effectiveDate: new Date('2024-01-01'),
        expiryDate: new Date('2025-12-31'),
        department: '财政部、税务总局',
        tags: '创业投资,税收优惠,科技成果转化',
        keywords: '创业,投资,税收,优惠',
        attachments: 'policy2.pdf',
        viewCount: 890,
        status: 'PUBLISHED'
      }
    }),
    prisma.policy.create({
      data: {
        title: '关于支持大学生创新创业的若干措施',
        summary: '为鼓励大学生创新创业，提供全方位支持，制定以下措施。',
        content: '为深入贯彻落实创新驱动发展战略，鼓励大学生创新创业，现制定以下支持措施。一、创业扶持...',
        type: 'STARTUP',
        level: 'PROVINCIAL',
        publishDate: new Date('2024-01-08'),
        effectiveDate: new Date('2024-01-15'),
        expiryDate: new Date('2025-06-30'),
        department: '省教育厅、省人社厅',
        tags: '大学生创业,创新创业,政策支持',
        keywords: '大学生,创新,创业,支持',
        attachments: 'policy3.pdf',
        viewCount: 2100,
        status: 'PUBLISHED'
      }
    })
  ])

  console.log('政策创建完成:', policies.length)

  // 创建项目
  const projects = await Promise.all([
    prisma.startupProject.create({
      data: {
        title: 'AI智能客服系统',
        description: '基于深度学习的智能客服系统，支持多轮对话和情感分析，可大幅提升客户服务效率。',
        category: 'AI',
        funding: 500000,
        duration: 12,
        requirements: '具备AI算法基础,有创业经验优先',
        benefits: '资金支持,技术指导,市场推广',
        applicationStart: new Date('2024-01-01'),
        applicationEnd: new Date('2024-03-31'),
        contactPerson: '张三',
        contactPhone: '13800138001',
        contactEmail: 'zhangsan@example.com',
        viewCount: 2580,
        applicationCount: 15,
        status: 'PUBLISHED'
      }
    }),
    prisma.startupProject.create({
      data: {
        title: '绿色能源储存解决方案',
        description: '新型锂电池技术，能量密度提升30%，充电速度提升50%，适用于电动汽车和储能系统。',
        category: 'ENERGY',
        funding: 2000000,
        duration: 24,
        requirements: '新能源相关专业背景,有产业化经验',
        benefits: '大额资金支持,产业对接,技术转化',
        applicationStart: new Date('2024-01-01'),
        applicationEnd: new Date('2024-04-30'),
        contactPerson: '李四',
        contactPhone: '13800138002',
        contactEmail: 'lisi@example.com',
        viewCount: 1890,
        applicationCount: 8,
        status: 'PUBLISHED'
      }
    })
  ])

  console.log('项目创建完成:', projects.length)

  // 创建职位
  const jobs = await Promise.all([
    prisma.jobOpportunity.create({
      data: {
        title: '高级前端开发工程师',
        company: '阿里巴巴集团',
        description: '负责前端架构设计和开发，参与产品需求分析，优化用户体验，提升页面性能。',
        type: 'FULL_TIME',
        level: 'SENIOR',
        department: '技术部',
        location: '杭州市',
        salary: '25K-45K',
        benefits: '五险一金,年终奖,股票期权,弹性工作,免费三餐',
        requirements: '3年以上前端开发经验;熟练掌握React/Vue等主流框架;熟悉TypeScript、Webpack等工具;有移动端开发经验优先;良好的团队协作能力',
        companySize: '10000+',
        industry: 'INTERNET',
        publishDate: new Date('2024-01-20'),
        validUntil: new Date('2024-02-20'),
        contact: '{"phone":"0571-12345678","email":"hr@alibaba.com"}',
        viewCount: 1580,
        applicationCount: 45,
        status: 'PUBLISHED'
      }
    }),
    prisma.jobOpportunity.create({
      data: {
        title: 'AI算法工程师',
        company: '字节跳动',
        description: '负责AI算法研发，参与模型训练和优化，推动AI技术在产品中的应用。',
        type: 'FULL_TIME',
        level: 'SENIOR',
        department: 'AI Lab',
        location: '北京市',
        salary: '30K-60K',
        benefits: '六险一金,年终奖,股票期权,技术津贴,学习基金',
        requirements: '计算机、数学等相关专业硕士以上学历;3年以上机器学习/深度学习经验;熟练使用Python、TensorFlow/PyTorch;有大规模数据处理经验;优秀的算法设计和分析能力',
        companySize: '10000+',
        industry: 'AI',
        publishDate: new Date('2024-01-18'),
        validUntil: new Date('2024-02-18'),
        contact: '{"phone":"010-12345678","email":"hr@bytedance.com"}',
        viewCount: 2100,
        applicationCount: 78,
        status: 'PUBLISHED'
      }
    }),
    prisma.jobOpportunity.create({
      data: {
        title: '产品经理',
        company: '腾讯科技',
        description: '负责产品规划和设计，分析用户需求，制定产品策略，推动产品迭代。',
        type: 'FULL_TIME',
        level: 'MID',
        department: '产品部',
        location: '深圳市',
        salary: '20K-35K',
        benefits: '五险一金,年终奖,带薪年假,健身房,下午茶',
        requirements: '2年以上产品经理经验;熟悉互联网产品设计流程;具备良好的逻辑思维和沟通能力;熟练使用Axure、Figma等工具;有移动端产品经验优先',
        companySize: '10000+',
        industry: 'INTERNET',
        publishDate: new Date('2024-01-15'),
        validUntil: new Date('2024-02-15'),
        contact: '{"phone":"0755-12345678","email":"hr@tencent.com"}',
        viewCount: 1200,
        applicationCount: 32,
        status: 'PUBLISHED'
      }
    })
  ])

  console.log('职位创建完成:', jobs.length)

  console.log('种子数据填充完成！')
}

main()
  .catch((e) => {
    console.error('种子数据填充失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })