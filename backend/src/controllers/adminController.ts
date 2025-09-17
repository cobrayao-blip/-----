import { Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

class AdminController {
  // 获取仪表盘统计数据
  getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [
      totalUsers,
      totalParks,
      totalPolicies,
      totalProjects,
      totalJobs,
      pendingProjectApplications,
      pendingJobApplications,
      approvedProjectApplications,
      approvedJobApplications
    ] = await Promise.all([
      prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
      prisma.park.count(),
      prisma.policy.count(),
      prisma.startupProject.count(),
      prisma.jobOpportunity.count(),
      prisma.projectApplication.count({ where: { status: 'PENDING' } }),
      prisma.jobApplication.count({ where: { status: 'PENDING' } }),
      prisma.projectApplication.count({ where: { status: 'APPROVED' } }),
      prisma.jobApplication.count({ where: { status: 'APPROVED' } })
    ]);

    // 计算活跃用户（最近30天登录的用户）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await prisma.user.count({
      where: {
        role: { not: 'ADMIN' },
        updatedAt: { gte: thirtyDaysAgo }
      }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProjects,
        totalPolicies,
        totalParks,
        totalJobs,
        pendingApplications: pendingProjectApplications + pendingJobApplications,
        approvedApplications: approvedProjectApplications + approvedJobApplications,
        totalViews: 0, // 需要实现浏览量统计
        activeUsers
      }
    });
  });

  // 用户管理 - 基于权限的查看
  getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const currentUserRole = req.user?.role;
    const currentUserId = req.user?.id;
    
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    // 权限控制：普通管理员只能看到普通用户，系统管理员可以看到所有用户
    if (currentUserRole === 'ADMIN') {
      // 普通管理员只能看到普通用户和VIP用户
      where.role = { in: ['USER', 'VIP'] };
    } else if (currentUserRole === 'SUPER_ADMIN') {
      // 系统管理员可以看到所有用户，但排除自己
      where.id = { not: currentUserId };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } }
      ];
    }
    
    if (role) {
      // 如果是普通管理员，限制角色筛选范围
      if (currentUserRole === 'ADMIN' && !['USER', 'VIP'].includes(role as string)) {
        return res.status(403).json({
          success: false,
          message: '权限不足，无法查看该角色用户'
        });
      }
      where.role = role;
    }
    
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        total,
        currentUserRole // 返回当前用户角色，前端可以据此调整UI
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  });

  updateUserStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    await prisma.user.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: '用户状态更新成功'
    });
  });

  createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, email, phone, role, password } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 加密密码
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role,
        password: hashedPassword,
        status: 'ACTIVE',
        // 新创建的管理员账户状态为PENDING，需要首次登录后激活
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,

      }
    });

    res.status(201).json({
      success: true,
      data: user,
      message: '用户创建成功'
    });
  });

  updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, phone, role, status },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: user,
      message: '用户信息更新成功'
    });
  });

  deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // 不允许删除管理员账户
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });

    if (user?.role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: '不能删除管理员账户'
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '用户删除成功'
    });
  });

  // 园区管理
  getParks = asyncHandler(async (req: AuthRequest, res: Response) => {
    const parks = await prisma.park.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: parks
    });
  });

  createPark = asyncHandler(async (req: AuthRequest, res: Response) => {
    const park = await prisma.park.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      data: park,
      message: '园区创建成功'
    });
  });

  updatePark = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const park = await prisma.park.update({
      where: { id },
      data: req.body
    });

    res.json({
      success: true,
      data: park,
      message: '园区更新成功'
    });
  });

  deletePark = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    await prisma.park.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '园区删除成功'
    });
  });

  // 政策管理
  getPolicies = asyncHandler(async (req: AuthRequest, res: Response) => {
    const policies = await prisma.policy.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: policies
    });
  });

  createPolicy = asyncHandler(async (req: AuthRequest, res: Response) => {
    const policy = await prisma.policy.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      data: policy,
      message: '政策创建成功'
    });
  });

  updatePolicy = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const policy = await prisma.policy.update({
      where: { id },
      data: req.body
    });

    res.json({
      success: true,
      data: policy,
      message: '政策更新成功'
    });
  });

  deletePolicy = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    await prisma.policy.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '政策删除成功'
    });
  });

  // 项目管理
  getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const projects = await prisma.startupProject.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: projects
    });
  });

  createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await prisma.startupProject.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      data: project,
      message: '项目创建成功'
    });
  });

  updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const project = await prisma.startupProject.update({
      where: { id },
      data: req.body
    });

    res.json({
      success: true,
      data: project,
      message: '项目更新成功'
    });
  });

  deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    await prisma.startupProject.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '项目删除成功'
    });
  });

  // 工作管理
  getJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const jobs = await prisma.jobOpportunity.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: jobs
    });
  });

  createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
    const job = await prisma.jobOpportunity.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      data: job,
      message: '工作机会创建成功'
    });
  });

  updateJob = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    const job = await prisma.jobOpportunity.update({
      where: { id },
      data: req.body
    });

    res.json({
      success: true,
      data: job,
      message: '工作机会更新成功'
    });
  });

  deleteJob = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    await prisma.jobOpportunity.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '工作机会删除成功'
    });
  });

  // 申请审核
  getProjectApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applications = await prisma.projectApplication.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, title: true, category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: applications
    });
  });

  reviewProjectApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status, reviewNote } = req.body;

    await prisma.projectApplication.update({
      where: { id },
      data: {
        status,
        reviewNote,
        reviewedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: '审核完成'
    });
  });

  getJobApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applications = await prisma.jobApplication.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        job: {
          select: { id: true, title: true, company: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: applications
    });
  });

  reviewJobApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status, reviewNote } = req.body;

    await prisma.jobApplication.update({
      where: { id },
      data: {
        status,
        reviewNote,
        reviewedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: '审核完成'
    });
  });

  // 文件上传
  uploadFiles = asyncHandler(async (req: AuthRequest, res: Response) => {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      });
    }

    const uploadedFiles = files.map(file => ({
      name: file.originalname,
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      data: uploadedFiles,
      message: '文件上传成功'
    });
  });
}

export const adminController = new AdminController();