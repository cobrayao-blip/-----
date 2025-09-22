const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testPrismaUpdate() {
  try {
    console.log('=== 开始测试Prisma更新操作 ===');
    
    // 1. 获取当前用户状态
    const beforeUser = await prisma.user.findUnique({
      where: { email: 'test-admin3@xiaoyao.com' },
      select: {
        id: true,
        email: true,
        password: true,
        mustChangePassword: true,
        updatedAt: true
      }
    });
    
    console.log('1. 更新前用户状态:', {
      id: beforeUser.id,
      email: beforeUser.email,
      mustChangePassword: beforeUser.mustChangePassword,
      updatedAt: beforeUser.updatedAt
    });
    
    // 2. 生成新密码
    const newPassword = 'testpassword789';
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log('2. 新密码哈希生成完成');
    
    // 3. 执行更新操作（完全模拟API中的代码）
    console.log('3. 开始执行Prisma更新操作...');
    
    const updatedUser = await prisma.user.update({
      where: { id: beforeUser.id },
      data: { 
        password: hashedNewPassword,
        mustChangePassword: false,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        mustChangePassword: true,
        updatedAt: true
      }
    });
    
    console.log('4. Prisma更新操作返回结果:', updatedUser);
    
    // 5. 立即重新查询验证
    const afterUser = await prisma.user.findUnique({
      where: { email: 'test-admin3@xiaoyao.com' },
      select: {
        id: true,
        email: true,
        password: true,
        mustChangePassword: true,
        updatedAt: true
      }
    });
    
    console.log('5. 更新后重新查询结果:', {
      id: afterUser.id,
      email: afterUser.email,
      mustChangePassword: afterUser.mustChangePassword,
      updatedAt: afterUser.updatedAt
    });
    
    // 6. 验证新密码
    const isNewPasswordValid = await bcrypt.compare(newPassword, afterUser.password);
    console.log('6. 新密码验证:', isNewPasswordValid);
    
    // 7. 分析结果
    console.log('\n=== 结果分析 ===');
    if (updatedUser.mustChangePassword === false && afterUser.mustChangePassword === false && isNewPasswordValid) {
      console.log('✅ 更新成功：密码和标记都正确更新');
    } else if (updatedUser.mustChangePassword === false && afterUser.mustChangePassword === true) {
      console.log('❌ Prisma返回成功但数据库实际未更新mustChangePassword');
    } else if (updatedUser.mustChangePassword === true) {
      console.log('❌ Prisma更新操作本身失败');
    } else {
      console.log('⚠️ 其他异常情况');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaUpdate();