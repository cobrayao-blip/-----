import { prisma } from '../src/index';
import bcrypt from 'bcryptjs';

async function initTestData() {
  try {
    console.log('开始初始化测试数据...');

    // 清空现有数据
    await prisma.user.deleteMany();
    console.log('清空现有用户数据');

    // 创建超级管理员
    const superAdminPassword = await bcrypt.hash('admin123', 12);
    const superAdmin = await prisma.user.create({
      data: {
        email: 'superadmin@xiaoyao.com',
        password: superAdminPassword,
        name: '超级管理员',
        phone: '13800000001',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log('✅ 创建超级管理员:', superAdmin.email);

    // 创建普通管理员
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@xiaoyao.com',
        password: adminPassword,
        name: '普通管理员',
        phone: '13800000002',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log('✅ 创建普通管理员:', admin.email);

    // 创建测试用户
    const userPassword = await bcrypt.hash('123456', 12);
    const testUser = await prisma.user.create({
      data: {
        email: 'test@xiaoyao.com',
        password: userPassword,
        name: '测试用户',
        phone: '13800000003',
        role: 'USER',
        status: 'ACTIVE'
      }
    });
    console.log('✅ 创建测试用户:', testUser.email);

    // 显示所有用户
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true
      }
    });

    console.log('\n当前所有用户:');
    console.table(allUsers);

    console.log('\n登录信息:');
    console.log('超级管理员 - 邮箱: superadmin@xiaoyao.com, 密码: admin123');
    console.log('普通管理员 - 邮箱: admin@xiaoyao.com, 密码: admin123');
    console.log('测试用户 - 邮箱: test@xiaoyao.com, 密码: 123456');

  } catch (error) {
    console.error('初始化失败:', error);
  }
}

initTestData()
  .catch(console.error)
  .finally(() => process.exit());