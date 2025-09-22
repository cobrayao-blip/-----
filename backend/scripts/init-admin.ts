import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function initAdmin() {
  try {
    // 检查是否已存在管理员账户
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('管理员账户已存在:', existingAdmin.email)
      return
    }

    // 创建管理员账户
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@xiaoyao.com',
        password: hashedPassword,
        name: '系统管理员',
        phone: '13800138000',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    })

    console.log('管理员账户创建成功:', admin.email)

    // 创建一些测试用户
    const testUsers = [
      {
        email: 'user1@test.com',
        password: await bcrypt.hash('123456', 10),
        name: '张三',
        phone: '13800138001',
        role: 'USER',
        status: 'ACTIVE'
      },
      {
        email: 'user2@test.com',
        password: await bcrypt.hash('123456', 10),
        name: '李四',
        phone: '13800138002',
        role: 'VIP',
        status: 'ACTIVE'
      },
      {
        email: 'user3@test.com',
        password: await bcrypt.hash('123456', 10),
        name: '王五',
        phone: '13800138003',
        role: 'USER',
        status: 'PENDING'
      }
    ]

    for (const userData of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        await prisma.user.create({ data: userData })
        console.log('测试用户创建成功:', userData.email)
      }
    }

    // 创建一些测试政策
    const testPolicies = [
      {
        title: '人才引进实施办法',
        content: '为了吸引和培养高层次人才，制定本实施办法...',
        type: 'TALENT',
        level: 'MUNICIPAL',
        status: 'PUBLISHED'
      },
      {
        title: '创业扶持政策',
        content: '为了支持创新创业，提供资金和政策支持...',
        type: 'STARTUP',
        level: 'PROVINCIAL',
        status: 'PUBLISHED'
      }
    ]

    for (const policyData of testPolicies) {
      const existingPolicy = await prisma.policy.findFirst({
        where: { title: policyData.title }
      })

      if (!existingPolicy) {
        await prisma.policy.create({ data: policyData })
        console.log('测试政策创建成功:', policyData.title)
      }
    }

    // 创建一些测试园区
    const testParks = [
      {
        name: '苏州工业园区',
        description: '国家级经济技术开发区',
        type: 'INDUSTRIAL',
        level: 'NATIONAL',
        province: '江苏省',
        city: '苏州市',
        status: 'PUBLISHED'
      },
      {
        name: '中关村科技园',
        description: '国家自主创新示范区',
        type: 'TECH',
        level: 'NATIONAL',
        province: '北京市',
        city: '北京市',
        status: 'PUBLISHED'
      }
    ]

    for (const parkData of testParks) {
      const existingPark = await prisma.park.findFirst({
        where: { name: parkData.name }
      })

      if (!existingPark) {
        await prisma.park.create({ data: parkData })
        console.log('测试园区创建成功:', parkData.name)
      }
    }

    // 创建一些测试项目
    const testProjects = [
      {
        title: 'AI智能客服系统',
        description: '基于人工智能的智能客服解决方案',
        category: '科技创新',
        funding: 500000,
        status: 'PUBLISHED'
      },
      {
        title: '绿色能源储存项目',
        description: '新型储能技术研发与应用',
        category: '新能源',
        funding: 1000000,
        status: 'PUBLISHED'
      }
    ]

    for (const projectData of testProjects) {
      const existingProject = await prisma.startupProject.findFirst({
        where: { title: projectData.title }
      })

      if (!existingProject) {
        await prisma.startupProject.create({ data: projectData })
        console.log('测试项目创建成功:', projectData.title)
      }
    }

    console.log('初始化完成！')
    console.log('管理员登录信息:')
    console.log('邮箱: admin@xiaoyao.com')
    console.log('密码: admin123')

  } catch (error) {
    console.error('初始化失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initAdmin()