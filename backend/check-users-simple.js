const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('=== 检查用户数据 ===');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('用户总数:', users.length);
    if (users.length > 0) {
      console.log('用户列表:');
      users.forEach(user => {
        console.log(`- 邮箱: ${user.email}, 姓名: ${user.name}, 角色: ${user.role}`);
      });
      
      // 检查超级管理员
      const superAdmin = users.find(u => u.role === 'SUPER_ADMIN');
      if (superAdmin) {
        console.log('\n✅ 超级管理员存在:', superAdmin.email);
      } else {
        console.log('\n❌ 超级管理员不存在！');
      }
      
      // 检查普通管理员
      const admins = users.filter(u => u.role === 'ADMIN');
      console.log(`✅ 普通管理员数量: ${admins.length}`);
      
      // 检查普通用户
      const normalUsers = users.filter(u => u.role === 'USER');
      console.log(`✅ 普通用户数量: ${normalUsers.length}`);
      
    } else {
      console.log('❌ 数据库中没有任何用户数据！');
    }
    
  } catch (error) {
    console.error('检查用户数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();