const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // 清空所有数据表
    console.log('正在清空数据库...');
    await prisma.projectApplication.deleteMany();
    await prisma.jobApplication.deleteMany();
    await prisma.resume.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.startupProject.deleteMany();
    await prisma.jobOpportunity.deleteMany();
    await prisma.policy.deleteMany();
    await prisma.park.deleteMany();
    await prisma.guide.deleteMany();
    await prisma.fAQ.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.contactInfo.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('数据库已清空');
    
    // 创建管理员用户
    console.log('正在创建系统管理员账号...');
    
    const hashedPassword = await bcrypt.hash('admin123456', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@xiaoyao.com',
        password: hashedPassword,
        name: '系统管理员',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    
    console.log('✓ 系统管理员账号创建成功！');
    console.log('邮箱:', adminUser.email);
    console.log('角色:', adminUser.role);
    console.log('用户ID:', adminUser.id);
    console.log('创建时间:', adminUser.createdAt);
    
    // 验证创建结果
    const userCount = await prisma.user.count();
    console.log(`\n数据库中现有用户数量: ${userCount}`);
    
  } catch (error) {
    console.error('创建管理员用户时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();