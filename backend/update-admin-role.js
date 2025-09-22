const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminRole() {
  try {
    // 查找当前的管理员账号
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@xiaoyao.com' }
    });
    
    if (!adminUser) {
      console.log('❌ 未找到管理员账号');
      return;
    }
    
    console.log('当前管理员信息:');
    console.log('邮箱:', adminUser.email);
    console.log('当前角色:', adminUser.role);
    
    // 更新为系统管理员
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@xiaoyao.com' },
      data: { 
        role: 'SUPER_ADMIN',
        name: '系统管理员'
      }
    });
    
    console.log('\n✅ 管理员角色更新成功！');
    console.log('邮箱:', updatedUser.email);
    console.log('新角色:', updatedUser.role);
    console.log('姓名:', updatedUser.name);
    console.log('更新时间:', updatedUser.updatedAt);
    
  } catch (error) {
    console.error('❌ 更新管理员角色时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRole();