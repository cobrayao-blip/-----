import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createAdmin() {
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
    const hashedPassword = await bcrypt.hash('admin123456', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@xiaoyao.com',
        name: '系统管理员',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '13800138000'
      }
    })

    console.log('管理员账户创建成功:')
    console.log('邮箱:', admin.email)
    console.log('密码: admin123456')
    console.log('角色:', admin.role)
    
  } catch (error) {
    console.error('创建管理员账户失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()