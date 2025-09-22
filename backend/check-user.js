const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test-admin3@xiaoyao.com' },
      select: {
        id: true,
        email: true,
        password: true,
        mustChangePassword: true,
        updatedAt: true
      }
    });
    
    console.log('=== 用户状态检查 ===');
    console.log('邮箱:', user.email);
    console.log('mustChangePassword:', user.mustChangePassword);
    console.log('更新时间:', user.updatedAt);
    
    // 测试密码
    const isOriginalValid = await bcrypt.compare('admin123', user.password);
    const isNewValid = await bcrypt.compare('newpassword456', user.password);
    
    console.log('\n=== 密码验证 ===');
    console.log('原始密码 admin123:', isOriginalValid);
    console.log('新密码 newpassword456:', isNewValid);
    
    if (user.mustChangePassword === true && isNewValid === true) {
      console.log('\n❌ 问题重现：密码已更改但mustChangePassword未清除！');
    } else if (user.mustChangePassword === false && isNewValid === true) {
      console.log('\n✅ 正常：密码已更改且mustChangePassword已清除');
    } else {
      console.log('\n⚠️ 异常状态');
    }
    
  } catch (error) {
    console.error('检查失败:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();