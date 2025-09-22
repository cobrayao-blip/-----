const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    console.log('检查管理员用户...');
    
    // 查找管理员用户
    const adminUsers = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPER_ADMIN' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });
    
    console.log(`找到 ${adminUsers.length} 个管理员用户:`);
    
    adminUsers.forEach((user, index) => {
      console.log(`\n--- 管理员 ${index + 1} ---`);
      console.log(`ID: ${user.id}`);
      console.log(`姓名: ${user.name}`);
      console.log(`邮箱: ${user.email}`);
      console.log(`角色: ${user.role}`);
      console.log(`状态: ${user.status}`);
      console.log(`创建时间: ${user.createdAt}`);
    });
    
    if (adminUsers.length === 0) {
      console.log('\n❌ 没有找到管理员用户，需要创建一个');
      
      // 创建管理员用户
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newAdmin = await prisma.user.create({
        data: {
          name: '系统管理员',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          status: 'ACTIVE'
        }
      });
      
      console.log('✅ 已创建管理员用户:');
      console.log(`邮箱: ${newAdmin.email}`);
      console.log(`密码: admin123`);
    }
    
  } catch (error) {
    console.error('检查过程中出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();