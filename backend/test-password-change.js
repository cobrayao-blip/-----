const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testPasswordChangeFlow() {
  try {
    console.log('=== 开始测试密码修改流程 ===');
    
    // 1. 获取测试用户
    const user = await prisma.user.findUnique({
      where: { email: 'test-admin2@xiaoyao.com' },
      select: {
        id: true,
        email: true,
        password: true,
        mustChangePassword: true
      }
    });
    
    console.log('1. 测试用户信息:', {
      id: user.id,
      email: user.email,
      mustChangePassword: user.mustChangePassword
    });
    
    // 2. 模拟JWT token验证
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWZ0bjUxYjAwMDAwaXNjdWZmN3QwYXFpIiwiZW1haWwiOiJ0ZXN0LWFkbWluMkB4aWFveWFvLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1ODQ1NjU1MiwiZXhwIjoxNzU5MDYxMzUyfQ.ZD7jeKkF6Z2oj6jQS9hzpOx1tbsZb8tUpyCK9WVpTMk';
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('2. JWT解码结果:', decoded);
    
    // 3. 验证用户ID匹配
    console.log('3. 用户ID匹配检查:', {
      tokenUserId: decoded.userId,
      dbUserId: user.id,
      match: decoded.userId === user.id
    });
    
    // 4. 验证当前密码
    const currentPassword = 'admin123';
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    console.log('4. 当前密码验证:', isCurrentPasswordValid);
    
    if (!isCurrentPasswordValid) {
      console.log('❌ 当前密码错误');
      return;
    }
    
    // 5. 生成新密码哈希
    const newPassword = 'newpassword123';
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log('5. 新密码哈希生成完成');
    
    // 6. 更新数据库
    console.log('6. 开始更新数据库...');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
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
    
    console.log('7. 数据库更新结果:', updatedUser);
    
    // 8. 验证更新是否成功
    const verifyUser = await prisma.user.findUnique({
      where: { email: 'test-admin2@xiaoyao.com' },
      select: {
        mustChangePassword: true,
        updatedAt: true
      }
    });
    
    console.log('8. 验证更新结果:', verifyUser);
    
    // 9. 验证新密码是否有效
    const newPasswordValid = await bcrypt.compare(newPassword, hashedNewPassword);
    console.log('9. 新密码验证:', newPasswordValid);
    
    console.log('=== 测试完成 ===');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordChangeFlow();