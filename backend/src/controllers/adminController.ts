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
        // 新创建的普通管理员需要首次登录时修改密码
        mustChangePassword: role === 'ADMIN' ? true : false,
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
    const currentUserRole = req.user?.role;
    const currentUserId = req.user?.id;

    // 不能删除自己
    if (id === currentUserId) {
      return res.status(403).json({
        success: false,
        message: '不能删除自己的账户'
      });
    }

    // 获取要删除的用户信息
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true, name: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 权限控制：
    // 1. 普通管理员(ADMIN)只能删除普通用户(USER, VIP)
    // 2. 系统管理员(SUPER_ADMIN)可以删除普通管理员和普通用户，但不能删除其他系统管理员
    if (currentUserRole === 'ADMIN') {
      if (!['USER', 'VIP'].includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: '权限不足，无法删除该用户'
        });
      }
    } else if (currentUserRole === 'SUPER_ADMIN') {
      if (user.role === 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: '不能删除其他系统管理员账户'
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: '权限不足'
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
    const { page = 1, limit = 10, search, status, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { company: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }
    
    if (status) where.status = status;
    if (type) where.type = type;

    const [jobs, total] = await Promise.all([
      prisma.jobOpportunity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.jobOpportunity.count({ where })
    ]);

    res.json({
      success: true,
      data: jobs,
      total
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
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = status ? { status: status as string } : {};
    
    const [applications, total] = await Promise.all([
      prisma.projectApplication.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          project: {
            select: { id: true, title: true, category: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.projectApplication.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        applications,
        total
      }
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

    const statusMessages = {
      'APPROVED': '审核通过',
      'REJECTED': '审核拒绝',
      'RETURNED': '已退回，请申报人修改后重新提交'
    };

    res.json({
      success: true,
      message: statusMessages[status as keyof typeof statusMessages] || '审核完成'
    });
  });

  getJobApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = status ? { status: status as string } : {};
    
    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        select: {
          id: true,
          jobId: true,
          userId: true,
          coverLetter: true,
          resumeUrl: true,
          resumeData: true,
          expectedSalary: true,
          availableDate: true,
          additionalDocs: true,
          status: true,
          reviewNote: true,
          reviewedAt: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: { id: true, name: true, email: true, phone: true }
          },
          job: {
            select: { id: true, title: true, company: true, location: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.jobApplication.count({ where })
    ]);

    console.log('管理后台获取职位申请:', applications.length, '条');
    if (applications.length > 0) {
      console.log('第一条申请记录:', {
        id: applications[0].id,
        hasResumeData: !!applications[0].resumeData,
        hasAdditionalDocs: !!applications[0].additionalDocs,
        resumeDataLength: applications[0].resumeData?.length || 0,
        additionalDocsLength: applications[0].additionalDocs?.length || 0
      });
    }

    res.json({
      success: true,
      data: {
        applications,
        total
      }
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

    const statusMessages = {
      'APPROVED': '审核通过',
      'REJECTED': '审核拒绝',
      'RETURNED': '已退回，请申报人修改后重新提交'
    };

    res.json({
      success: true,
      message: statusMessages[status as keyof typeof statusMessages] || '审核完成'
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

    // 增强版文件名编码修复函数
    const fixFileNameEncoding = (originalName: string): string => {
      try {
        console.log('开始修复文件名编码:', originalName);
        
        // 检查是否需要修复（包含乱码特征）
        const needsFix = /[ï¿½]/.test(originalName) || 
                        /[\u00C0-\u00FF]{2,}/.test(originalName) ||
                        /\\x[0-9a-fA-F]{2}/.test(originalName) ||
                        /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]{2,}/.test(originalName);
        
        if (!needsFix) {
          console.log('文件名无需修复');
          return originalName;
        }
        
        console.log('检测到编码问题，开始修复...');
        
        // 策略1: 处理\x转义序列
        if (/\\x[0-9a-fA-F]{2}/.test(originalName)) {
          try {
            console.log('尝试修复\\x转义序列');
            let fixed = originalName.replace(/\\x([0-9a-fA-F]{2})/g, (match, hex) => {
              return String.fromCharCode(parseInt(hex, 16));
            });
            
            // 然后尝试UTF-8解码
            const buffer = Buffer.from(fixed, 'latin1');
            fixed = buffer.toString('utf8');
            
            if (/[\u4e00-\u9fff]/.test(fixed)) {
              console.log('\\x转义序列修复成功:', fixed);
              return fixed;
            }
          } catch (e) {
            console.log('\\x转义序列修复失败:', e);
          }
        }
        
        // 策略2: Latin-1 -> UTF-8 转换
        try {
          console.log('尝试Latin-1到UTF-8转换');
          const buffer = Buffer.from(originalName, 'latin1');
          const fixed = buffer.toString('utf8');
          
          if (/[\u4e00-\u9fff]/.test(fixed)) {
            console.log('Latin-1转UTF-8修复成功:', fixed);
            return fixed;
          }
        } catch (e) {
          console.log('Latin-1转UTF-8失败:', e);
        }
        
        // 策略3: URL解码
        try {
          console.log('尝试URL解码');
          const decoded = decodeURIComponent(escape(originalName));
          
          if (/[\u4e00-\u9fff]/.test(decoded)) {
            console.log('URL解码修复成功:', decoded);
            return decoded;
          }
        } catch (e) {
          console.log('URL解码失败:', e);
        }
        
        // 策略4: 直接字节重新解释
        try {
          console.log('尝试字节重新解释');
          const bytes = [];
          for (let i = 0; i < originalName.length; i++) {
            bytes.push(originalName.charCodeAt(i) & 0xFF);
          }
          const buffer = Buffer.from(bytes);
          const fixed = buffer.toString('utf8');
          
          if (/[\u4e00-\u9fff]/.test(fixed)) {
            console.log('字节重新解释修复成功:', fixed);
            return fixed;
          }
        } catch (e) {
          console.log('字节重新解释失败:', e);
        }
        
        // 策略5: 常见乱码模式替换
        try {
          console.log('尝试常见乱码模式替换');
          const commonPatterns = {
            'å¼ ': '张',
            'ä¸\x89': '三',
            'ç®\x80': '简',
            'å\x8E\x86': '历',
            'è¯\x81': '证',
            'ä¹¦': '书',
            'å¥\x96': '奖',
            'ç\x8A¶': '状'
          };
          
          let fixed = originalName;
          for (const [pattern, replacement] of Object.entries(commonPatterns)) {
            fixed = fixed.replace(new RegExp(pattern, 'g'), replacement);
          }
          
          if (fixed !== originalName && /[\u4e00-\u9fff]/.test(fixed)) {
            console.log('模式替换修复成功:', fixed);
            return fixed;
          }
        } catch (e) {
          console.log('模式替换失败:', e);
        }
        
        console.log('所有修复策略都失败，返回原始文件名');
        return originalName;
        
      } catch (e) {
        console.error('文件名编码修复过程出错:', e);
        return originalName;
      }
    };

    const uploadedFiles = files.map(file => {
      const fixedName = fixFileNameEncoding(file.originalname);
      console.log(`管理员文件名修复: ${file.originalname} -> ${fixedName}`);
      
      return {
        name: fixedName,
        originalName: fixedName,
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    res.json({
      success: true,
      data: uploadedFiles,
      message: '文件上传成功'
    });
  });
}

export const adminController = new AdminController();