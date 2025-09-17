const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    // 查找管理员账户
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@xiaoyao.com' }
    });

    if (!admin) {
      console.log('❌ 管理员账户不存在');
      return;
    }

    console.log('✅ 管理员账户信息:');
    console.log('ID:', admin.id);
    console.log('邮箱:', admin.email);
    console.log('姓名:', admin.name);
    console.log('角色:', admin.role);
    console.log('状态:', admin.status);
    console.log('创建时间:', admin.createdAt);

    // 测试密码验证
    const testPassword = 'admin123456';
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🔐 密码验证:');
    console.log('测试密码:', testPassword);
    console.log('密码正确:', isPasswordValid ? '✅ 是' : '❌ 否');

    if (!isPasswordValid) {
      console.log('\n🔧 重新设置管理员密码...');
      const newHashedPassword = await bcrypt.hash('admin123456', 10);
      
      await prisma.user.update({
        where: { email: 'admin@xiaoyao.com' },
        data: { 
          password: newHashedPassword,
          status: 'ACTIVE'
        }
      });
      
      console.log('✅ 管理员密码已重置为: admin123456');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();