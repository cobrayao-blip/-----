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
        console.log(`- ID: ${user.id}, 邮箱: ${user.email}, 姓名: ${user.name}, 角色: ${user.role}, 创建时间: ${user.createdAt}`);
      });
    } else {
      console.log('❌ 数据库中没有任何用户数据！');
    }
    
    console.log('\n=== 检查用户资料数据 ===');
    const profiles = await prisma.userProfile.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        phone: true,
        createdAt: true
      }
    });
    
    console.log('用户资料总数:', profiles.length);
    if (profiles.length > 0) {
      console.log('用户资料列表:');
      profiles.forEach(profile => {
        console.log(`- ID: ${profile.id}, 用户ID: ${profile.userId}, 姓名: ${profile.name}, 电话: ${profile.phone}`);
      });
    } else {
      console.log('❌ 数据库中没有任何用户资料数据！');
    }
    
  } catch (error) {
    console.error('检查用户数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();