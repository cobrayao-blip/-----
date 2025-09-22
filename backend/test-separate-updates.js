const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testSeparateUpdates() {
  try {
    console.log('=== 测试分离的数据库更新操作 ===');
    
    const userId = 'cmftnypa80000e1po29p5466b'; // test-admin3的用户ID
    
    // 1. 获取当前状态
    const beforeUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
        mustChangePassword: true
      }
    });
    
    console.log('1. 更新前状态:', {
      email: beforeUser.email,
      mustChangePassword: beforeUser.mustChangePassword
    });
    
    // 2. 生成新密码
    const newPassword = 'separatetest123';
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log('2. 新密码哈希生成完成');
    
    // 3. 测试只更新密码
    console.log('3. 测试只更新密码...');
    try {
      const passwordUpdateResult = await prisma.user.update({
        where: { id: userId },
        data: { 
          password: hashedNewPassword
        },
        select: {
          id: true,
          email: true,
          mustChangePassword: true
        }
      });
      console.log('密码更新结果:', passwordUpdateResult);
    } catch (error) {
      console.error('❌ 密码更新失败:', error.message);
    }
    
    // 4. 验证密码更新
    const afterPasswordUpdate = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, mustChangePassword: true }
    });
    
    const isNewPasswordValid = await bcrypt.compare(newPassword, afterPasswordUpdate.password);
    console.log('4. 密码更新验证:', {
      newPasswordValid: isNewPasswordValid,
      mustChangePassword: afterPasswordUpdate.mustChangePassword
    });
    
    // 5. 测试只更新mustChangePassword
    console.log('5. 测试只更新mustChangePassword...');
    try {
      const flagUpdateResult = await prisma.user.update({
        where: { id: userId },
        data: { 
          mustChangePassword: false
        },
        select: {
          id: true,
          email: true,
          mustChangePassword: true
        }
      });
      console.log('标记更新结果:', flagUpdateResult);
    } catch (error) {
      console.error('❌ 标记更新失败:', error.message);
    }
    
    // 6. 验证标记更新
    const afterFlagUpdate = await prisma.user.findUnique({
      where: { id: userId },
      select: { mustChangePassword: true }
    });
    
    console.log('6. 标记更新验证:', {
      mustChangePassword: afterFlagUpdate.mustChangePassword
    });
    
    // 7. 测试同时更新两个字段
    console.log('7. 测试同时更新密码和标记...');
    
    // 重置状态
    await prisma.user.update({
      where: { id: userId },
      data: { mustChangePassword: true }
    });
    
    const finalPassword = 'finaltest123';
    const finalHashedPassword = await bcrypt.hash(finalPassword, 10);
    
    try {
      const combinedUpdateResult = await prisma.user.update({
        where: { id: userId },
        data: { 
          password: finalHashedPassword,
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
      console.log('组合更新结果:', combinedUpdateResult);
      
      // 立即验证
      const finalVerification = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true, mustChangePassword: true }
      });
      
      const isFinalPasswordValid = await bcrypt.compare(finalPassword, finalVerification.password);
      console.log('组合更新验证:', {
        finalPasswordValid: isFinalPasswordValid,
        mustChangePassword: finalVerification.mustChangePassword
      });
      
    } catch (error) {
      console.error('❌ 组合更新失败:', error.message);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSeparateUpdates();