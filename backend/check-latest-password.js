const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkLatestPassword() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test-admin3@xiaoyao.com' },
      select: { password: true, mustChangePassword: true }
    });
    
    console.log('=== 检查最新密码状态 ===');
    
    // 测试各种可能的密码
    const passwords = ['admin123', 'testpassword123', 'newpassword456', 'newpassword999'];
    
    for (const pwd of passwords) {
      const isValid = await bcrypt.compare(pwd, user.password);
      console.log(`密码 ${pwd}: ${isValid}`);
    }
    
    console.log(`mustChangePassword: ${user.mustChangePassword}`);
    
    // 检查是否存在问题
    const isTestPasswordValid = await bcrypt.compare('testpassword123', user.password);
    if (isTestPasswordValid && user.mustChangePassword) {
      console.log('\n❌ 问题确认：密码已更改为testpassword123但mustChangePassword未清除');
    } else if (!isTestPasswordValid) {
      console.log('\n⚠️ 密码没有被更改为预期值');
    } else {
      console.log('\n✅ 状态正常');
    }
    
  } catch (error) {
    console.error('检查失败:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestPassword();