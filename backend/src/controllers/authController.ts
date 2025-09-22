import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { createError } from '../utils/createError';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// 生成JWT token
const generateToken = (userId: string, email: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const payload = { userId, email, role };
  
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// 用户登录
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError('请提供邮箱和密码', 400);
  }

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      role: true,
      status: true,
      mustChangePassword: true,
      createdAt: true,
      profile: {
        select: {
          avatar: true
        }
      }
    }
  });

  if (!user) {
    throw createError('用户不存在', 401);
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError('密码错误', 401);
  }

  // 检查用户状态
  if (user.status !== 'ACTIVE') {
    throw createError('账户未激活或已被暂停', 401);
  }

  // 生成JWT token
  const token = generateToken(user.id, user.email, user.role);

  // 返回用户信息（不包含密码）
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        avatar: user.profile?.avatar || null
      },
      token,
      mustChangePassword: user.mustChangePassword
    }
  });
});

// 修改密码
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  console.log('密码修改请求开始:', {
    userId,
    hasCurrentPassword: !!currentPassword,
    hasNewPassword: !!newPassword,
    newPasswordLength: newPassword?.length
  });

  if (!userId) {
    throw createError('用户未认证', 401);
  }

  if (!currentPassword || !newPassword) {
    throw createError('请提供当前密码和新密码', 400);
  }

  if (newPassword.length < 6) {
    throw createError('新密码长度至少6位', 400);
  }

  try {
    // 查找用户
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
      throw createError('用户不存在', 404);
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    console.log('密码验证结果:', isCurrentPasswordValid);
    
    if (!isCurrentPasswordValid) {
      throw createError('当前密码错误', 400);
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log('新密码加密完成');

    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 更新密码和清除强制修改密码标记
      const updatedUser = await tx.user.update({
        where: { id: userId },
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

      console.log('事务内更新结果:', updatedUser);
      return updatedUser;
    });

    console.log('事务完成，最终结果:', result);

    // 双重验证：再次查询确保更新成功
    const verifyUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        mustChangePassword: true,
        updatedAt: true
      }
    });

    console.log('验证查询结果:', verifyUser);

    if (verifyUser?.mustChangePassword !== false) {
      console.error('❌ 警告：mustChangePassword未正确更新');
      throw createError('密码修改失败，请重试', 500);
    }

    res.json({
      success: true,
      message: '密码修改成功'
    });

  } catch (error) {
    console.error('密码修改过程中发生错误:', error);
    throw error;
  }
});



// 用户注册
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    throw createError('请提供必要的注册信息', 400);
  }

  // 检查用户是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw createError('该邮箱已被注册', 400);
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10);

  // 创建用户
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'USER',
      status: 'ACTIVE'
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true
    }
  });

  res.status(201).json({
    success: true,
    data: user,
    message: '注册成功，您可以立即使用账户'
  });
});

// 获取当前用户信息
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw createError('用户未认证', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          avatar: true
        }
      }
    }
  });

  if (!user) {
    throw createError('用户不存在', 404);
  }

  const { profile, ...userWithoutProfile } = user;

  res.json({
    success: true,
    data: {
      ...userWithoutProfile,
      avatar: profile?.avatar || null
    }
  });
});

// 刷新token
export const refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const userEmail = req.user?.email;
  const userRole = req.user?.role;

  if (!userId || !userEmail || !userRole) {
    throw createError('用户未认证', 401);
  }

  // 生成新的token
  const newToken = generateToken(userId, userEmail, userRole);

  res.json({
    success: true,
    data: {
      token: newToken
    }
  });
});

// 更新用户头像
export const updateAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { avatar } = req.body;

  if (!userId) {
    throw createError('用户未认证', 401);
  }

  if (!avatar) {
    throw createError('请提供头像数据', 400);
  }

  // 查找或创建用户profile
  let userProfile = await prisma.userProfile.findUnique({
    where: { userId }
  });

  if (!userProfile) {
    // 如果用户profile不存在，创建一个
    userProfile = await prisma.userProfile.create({
      data: {
        userId,
        avatar
      }
    });
  } else {
    // 更新现有的profile
    userProfile = await prisma.userProfile.update({
      where: { userId },
      data: { avatar }
    });
  }

  res.json({
    success: true,
    message: '头像更新成功',
    data: {
      avatar: userProfile.avatar
    }
  });
});

// 用户登出
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  // 在实际应用中，这里可以将token加入黑名单
  // 目前只是返回成功响应，客户端会清除本地token
  res.json({
    success: true,
    message: '登出成功'
  });
});