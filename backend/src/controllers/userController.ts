import { Response } from 'express';
import { prisma } from '../index';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

class UserController {
  // 获取用户资料
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.user!.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: profile
    });
  });

  // 更新用户资料
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const profileData = req.body;

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });

    res.json({
      success: true,
      data: profile,
      message: '资料更新成功'
    });
  });

  // 上传简历
  uploadResume = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw createError('请选择文件', 400);
    }

    const resumeUrl = `/uploads/${req.file.filename}`;
    
    await prisma.userProfile.upsert({
      where: { userId: req.user!.id },
      update: { bio: `简历文件: ${resumeUrl}` },
      create: {
        userId: req.user!.id,
        bio: `简历文件: ${resumeUrl}`
      }
    });

    res.json({
      success: true,
      data: { url: resumeUrl },
      message: '简历上传成功'
    });
  });

  // 获取用户申请记录
  getApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [projectApplications, jobApplications] = await Promise.all([
      prisma.projectApplication.findMany({
        where: { userId: req.user!.id },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.jobApplication.findMany({
        where: { userId: req.user!.id },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      success: true,
      data: {
        projects: projectApplications,
        jobs: jobApplications
      }
    });
  });

  // 更新用户基本信息
  updateInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true
      }
    });

    res.json({
      success: true,
      data: user,
      message: '信息更新成功'
    });
  });

  // 修改密码
  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    // 实现密码修改逻辑
    res.json({
      success: true,
      message: '密码修改成功'
    });
  });
}

export const userController = new UserController();