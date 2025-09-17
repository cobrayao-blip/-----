import { Response } from 'express';
import { prisma } from '../index';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

class ProjectController {
  // 获取创业项目列表
  getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      province, 
      city,
      fundingMin,
      fundingMax
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {
      status: 'PUBLISHED'
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }

    if (category) where.category = category;
    if (province) where.province = province;
    if (city) where.city = city;
    
    if (fundingMin || fundingMax) {
      where.fundingAmount = {};
      if (fundingMin) where.fundingAmount.gte = Number(fundingMin);
      if (fundingMax) where.fundingAmount.lte = Number(fundingMax);
    }

    const [projects, total] = await Promise.all([
      prisma.startupProject.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.startupProject.count({ where })
    ]);

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  });

  // 获取项目详情
  getProjectById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const project = await prisma.startupProject.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: '项目不存在'
      });
    }

    res.json({
      success: true,
      data: project
    });
  });

  // 申请项目
  applyProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { projectId, businessPlanUrl, additionalDocs, message } = req.body;
    const userId = req.user!.id;

    // 检查项目是否存在
    const project = await prisma.startupProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw createError('项目不存在', 404);
    }

    // 检查是否已申请
    const existingApplication = await prisma.projectApplication.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    });

    if (existingApplication) {
      throw createError('您已申请过此项目', 400);
    }

    // 创建申请
    const application = await prisma.projectApplication.create({
      data: {
        userId,
        projectId,
        businessPlanUrl,
        additionalDocs,
        message
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      }
    });

    // 更新项目申请人数
    // 项目申请数量更新逻辑可以在这里实现
    // await prisma.startupProject.update({
    //   where: { id: projectId },
    //   data: { /* 更新逻辑 */ }
    // });

    res.status(201).json({
      success: true,
      data: application,
      message: '申请提交成功'
    });
  });

  // 上传创业计划书
  uploadBusinessPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw createError('请选择文件', 400);
    }

    const url = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      data: { url },
      message: '文件上传成功'
    });
  });

  // 获取用户项目申请
  getUserApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applications = await prisma.projectApplication.findMany({
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
    });

    res.json({
      success: true,
      data: applications
    });
  });

  // 撤回项目申请
  withdrawApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const application = await prisma.projectApplication.findFirst({
      where: { id, userId }
    });

    if (!application) {
      throw createError('申请不存在', 404);
    }

    if (application.status !== 'PENDING') {
      throw createError('只能撤回待审核的申请', 400);
    }

    await prisma.projectApplication.update({
      where: { id },
      data: { status: 'WITHDRAWN' }
    });

    res.json({
      success: true,
      message: '申请已撤回'
    });
  });

  // 获取热门项目
  getPopularProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { limit = 6 } = req.query;

    const projects = await prisma.startupProject.findMany({
      where: { status: 'PUBLISHED' },
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: projects
    });
  });
}

export const projectController = new ProjectController();