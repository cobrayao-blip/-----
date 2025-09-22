const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// 模拟认证中间件的逻辑
async function simulateAuthMiddleware(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // 验证用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, status: true }
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('账户未激活或已被暂停');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    throw new Error('认证失败: ' + error.message);
  }
}

// 模拟完整的密码修改API流程
async function simulateChangePasswordAPI(token, currentPassword, newPassword) {
  try {
    console.log('=== 开始模拟完整API调用流程 ===');
    
    // 1. 认证中间件
    console.log('1. 执行认证中间件...');
    const authUser = await simulateAuthMiddleware(token);
    console.log('认证成功:', authUser);
    
    const userId = authUser.id;
    
    // 2. 参数验证
    console.log('2. 参数验证...');
    if (!userId) {
      throw new Error('用户未认证');
    }

    if (!currentPassword || !newPassword) {
      throw new Error('请提供当前密码和新密码');
    }

    if (newPassword.length < 6) {
      throw new Error('新密码长度至少6位');
    }
    console.log('参数验证通过');

    // 3. 查找用户
    console.log('3. 查找用户...');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
        mustChangePassword: true
      }
    });

    console.log('找到用户:', {
      id: user?.id,
      email: user?.email,
      mustChangePassword: user?.mustChangePassword
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 4. 验证当前密码
    console.log('4. 验证当前密码...');
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    console.log('密码验证结果:', isCurrentPasswordValid);
    
    if (!isCurrentPasswordValid) {
      throw new Error('当前密码错误');
    }

    // 5. 加密新密码
    console.log('5. 加密新密码...');
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log('新密码加密完成');

    // 6. 更新数据库
    console.log('6. 更新数据库...');
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        mustChangePassword: false,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        mustChangePassword: true
      }
    });

    console.log('数据库更新结果:', updatedUser);

    // 7. 立即验证更新结果
    console.log('7. 立即验证更新结果...');
    const verifyUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        mustChangePassword: true,
        updatedAt: true
      }
    });
    console.log('验证结果:', verifyUser);

    // 8. 返回成功响应
    console.log('8. 返回成功响应');
    return {
      success: true,
      message: '密码修改成功'
    };

  } catch (error) {
    console.error('❌ API调用失败:', error.message);
    throw error;
  }
}

async function testFullAPIFlow() {
  try {
    // 重置测试用户状态
    console.log('=== 重置测试用户状态 ===');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.update({
      where: { email: 'test-admin3@xiaoyao.com' },
      data: {
        password: hashedPassword,
        mustChangePassword: true
      }
    });
    console.log('测试用户状态已重置');
    
    // 生成新的token
    const user = await prisma.user.findUnique({
      where: { email: 'test-admin3@xiaoyao.com' },
      select: { id: true, email: true, role: true }
    });
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('新token生成完成');
    
    // 执行完整API流程测试
    const result = await simulateChangePasswordAPI(token, 'admin123', 'newpassword999');
    console.log('API调用结果:', result);
    
    // 最终验证
    console.log('\n=== 最终验证 ===');
    const finalUser = await prisma.user.findUnique({
      where: { email: 'test-admin3@xiaoyao.com' },
      select: {
        mustChangePassword: true,
        password: true
      }
    });
    
    const isNewPasswordValid = await bcrypt.compare('newpassword999', finalUser.password);
    
    console.log('最终状态:');
    console.log('mustChangePassword:', finalUser.mustChangePassword);
    console.log('新密码有效:', isNewPasswordValid);
    
    if (finalUser.mustChangePassword === false && isNewPasswordValid) {
      console.log('✅ 完整API流程测试成功');
    } else {
      console.log('❌ 完整API流程测试失败');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFullAPIFlow();