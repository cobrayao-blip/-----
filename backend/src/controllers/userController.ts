import { Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../utils/createError';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

class UserController {
  // 获取用户资料
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        resume: true
      }
    });

    if (!user) {
      throw createError('用户不存在', 404);
    }

    res.json({
      success: true,
      data: user
    });
  });

  // 更新用户资料
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { name, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone
      }
    });

    res.json({
      success: true,
      message: '用户资料更新成功',
      data: updatedUser
    });
  });

  // 上传简历
  uploadResume = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw createError('请选择要上传的简历文件', 400);
    }

    const userId = req.user!.id;
    const file = req.file;
    
    // 检查文件类型
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      // 删除已上传的文件
      fs.unlinkSync(file.path);
      throw createError('只支持PDF、DOC、DOCX格式的简历文件', 400);
    }

    // 构建文件访问URL
    const fileUrl = `/uploads/${file.filename}`;

    // 文件名现在已经在multer层面修复，直接使用
    const fixedName = file.originalname;
    console.log(`简历文件名: ${fixedName}`);

    res.json({
      success: true,
      message: '简历上传成功',
      data: {
        filename: file.filename,
        originalName: fixedName,
        name: fixedName,
        url: fileUrl,
        size: file.size
      }
    });
  });

  // 上传项目申报文件
  uploadProjectFiles = asyncHandler(async (req: AuthRequest, res: Response) => {
    console.log('收到文件上传请求');
    console.log('用户ID:', req.user?.id);
    console.log('请求文件:', req.files);
    
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      console.log('没有文件上传');
      throw createError('请选择要上传的文件', 400);
    }

    const userId = req.user!.id;
    const uploadedFiles = files.map(file => {
      // 文件名现在已经在multer层面修复，直接使用
      console.log(`处理文件: ${file.originalname}`);
      
      return {
        filename: file.filename,
        originalName: file.originalname,
        name: file.originalname, // 添加name字段，确保兼容性
        url: `/uploads/${file.filename}`,
        size: file.size,
        fieldname: file.fieldname
      };
    });

    console.log('文件上传成功:', uploadedFiles);

    const response = {
      success: true,
      message: '文件上传成功',
      data: uploadedFiles
    };
    
    console.log('发送响应:', response);
    res.status(200).json(response);
  });

  // 获取用户申请记录
  getApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const [projectApplications, jobApplications] = await Promise.all([
      prisma.projectApplication.findMany({
        where: { userId },
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
        where: { userId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true
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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phone }
    });

    res.json({
      success: true,
      message: '基本信息更新成功',
      data: updatedUser
    });
  });

  // 修改密码
  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    // 获取用户当前密码
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      throw createError('用户不存在', 404);
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw createError('当前密码错误', 400);
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // 更新密码
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: '密码修改成功'
    });
  });

  // 获取项目申报详情
  getProjectApplicationDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const application = await prisma.projectApplication.findFirst({
      where: { 
        id,
        userId 
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            funding: true,
            duration: true,
            requirements: true,
            benefits: true
          }
        }
      }
    });

    if (!application) {
      throw createError('申报记录不存在', 404);
    }

    res.json({
      success: true,
      data: application
    });
  });

  // 更新项目申报
  updateProjectApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const { 
      personalInfo, 
      projectInfo, 
      resumeUrl, 
      businessPlanUrl, 
      financialReportUrl, 
      otherDocsUrl,
      message 
    } = req.body;

    // 检查申报是否存在且属于当前用户
    const existingApplication = await prisma.projectApplication.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingApplication) {
      throw createError('申报记录不存在', 404);
    }

    // 只有RETURNED状态的申报才能被编辑
    if (existingApplication.status !== 'RETURNED') {
      throw createError('只有被退回的申报才能编辑', 400);
    }

    // 添加调试日志
    console.log('更新申报 - 接收到的数据:', {
      personalInfo,
      projectInfo,
      resumeUrl,
      businessPlanUrl,
      financialReportUrl,
      otherDocsUrl,
      message
    });

    // 处理文件URL，如果传递了空数组字符串，则保持原有值
    const processFileUrl = (newUrl: string, existingUrl: string | null) => {
      if (!newUrl) return existingUrl;
      if (newUrl === '[]') return existingUrl; // 空数组字符串保持原有值
      try {
        const parsed = JSON.parse(newUrl);
        if (Array.isArray(parsed) && parsed.length === 0) return existingUrl; // 空数组保持原有值
        return newUrl;
      } catch (e) {
        return newUrl; // 如果不是JSON，直接使用新值
      }
    };

    const updatedApplication = await prisma.projectApplication.update({
      where: { id },
      data: {
        personalInfo: personalInfo ? JSON.stringify(personalInfo) : existingApplication.personalInfo,
        projectInfo: projectInfo ? JSON.stringify(projectInfo) : existingApplication.projectInfo,
        resumeUrl: processFileUrl(resumeUrl, existingApplication.resumeUrl),
        businessPlanUrl: processFileUrl(businessPlanUrl, existingApplication.businessPlanUrl),
        financialReportUrl: processFileUrl(financialReportUrl, existingApplication.financialReportUrl),
        otherDocsUrl: processFileUrl(otherDocsUrl, existingApplication.otherDocsUrl),
        message: message || existingApplication.message,
        status: 'PENDING', // 重新提交后状态变为待审核
        reviewNote: null, // 清除之前的审核意见
        reviewedAt: null, // 清除审核时间
        updatedAt: new Date()
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

    res.json({
      success: true,
      message: '申报更新成功，已重新提交审核',
      data: updatedApplication
    });
  });

  // 获取工作申请详情
  getJobApplicationDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const application = await prisma.jobApplication.findFirst({
      where: { 
        id,
        userId 
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            description: true,
            type: true,
            level: true,
            location: true,
            salary: true,
            requirements: true,
            benefits: true
          }
        }
      }
    });

    if (!application) {
      throw createError('申请记录不存在', 404);
    }

    res.json({
      success: true,
      data: application
    });
  });

  // 更新工作申请
  updateJobApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const { 
      coverLetter, 
      resumeUrl, 
      expectedSalary, 
      availableDate, 
      additionalDocs 
    } = req.body;

    // 检查申请是否存在且属于当前用户
    const existingApplication = await prisma.jobApplication.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingApplication) {
      throw createError('申请记录不存在', 404);
    }

    // 只有RETURNED状态的申请才能被编辑
    if (existingApplication.status !== 'RETURNED') {
      throw createError('只有被退回的申请才能编辑', 400);
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: {
        coverLetter: coverLetter || existingApplication.coverLetter,
        resumeUrl: resumeUrl || existingApplication.resumeUrl,
        expectedSalary: expectedSalary || existingApplication.expectedSalary,
        availableDate: availableDate ? new Date(availableDate) : existingApplication.availableDate,
        additionalDocs: additionalDocs || existingApplication.additionalDocs,
        status: 'PENDING', // 重新提交后状态变为待审核
        reviewNote: null, // 清除之前的审核意见
        reviewedAt: null, // 清除审核时间
        updatedAt: new Date()
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: '申请更新成功，已重新提交审核',
      data: updatedApplication
    });
  });
}

export const userController = new UserController();