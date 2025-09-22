import { Request, Response } from 'express';
import { prisma } from '../index';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

class JobController {
  // 获取工作机会列表
  getJobs = asyncHandler(async (req: Request, res: Response) => {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      type, 
      level, 
      province, 
      city,
      company
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {
      status: 'PUBLISHED'
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
        { company: { contains: search as string } }
      ];
    }

    if (category) where.category = category;
    if (type) where.type = type;
    if (level) where.level = level;
    if (province) where.province = province;
    if (city) where.city = city;
    if (company) where.company = { contains: company as string };

    const [jobs, total] = await Promise.all([
      prisma.jobOpportunity.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.jobOpportunity.count({ where })
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  });

  // 获取工作详情
  getJobById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const job = await prisma.jobOpportunity.findUnique({
      where: { id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: '工作机会不存在'
      });
    }

    res.json({
      success: true,
      data: job
    });
  });

  // 申请工作
  applyJob = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { jobId, coverLetter, expectedSalary, availableDate, additionalDocs, includeResume, resumeData } = req.body;
    const userId = req.user!.id;

    // 处理FormData中的布尔值（FormData中所有值都是字符串）
    const includeResumeBoolean = includeResume === 'true' || includeResume === true;
    
    console.log('申请职位参数:', {
      jobId,
      userId,
      includeResume: includeResume,
      includeResumeBoolean,
      hasResumeData: !!resumeData,
      resumeDataLength: resumeData?.length || 0
    });

    // 检查工作是否存在
    const job = await prisma.jobOpportunity.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw createError('工作机会不存在', 404);
    }

    // 检查是否已申请
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId
        }
      }
    });

    if (existingApplication) {
      throw createError('您已申请过此职位', 400);
    }

    // 处理简历数据
    let resumeUrl = null;
    let resumeDataString = null;
    
    if (includeResumeBoolean) {
      if (resumeData) {
        // 如果前端传递了完整的简历数据，直接使用
        resumeDataString = JSON.stringify(resumeData);
      } else {
        // 否则从数据库获取用户简历信息
        const resume = await prisma.resume.findUnique({
          where: { userId }
        });
        
        if (resume && resume.isComplete) {
          // 解析JSON字符串字段
          const basicInfo = resume.basicInfo ? JSON.parse(resume.basicInfo) : {};
          const education = resume.education ? JSON.parse(resume.education) : [];
          const experience = resume.experience ? JSON.parse(resume.experience) : [];
          const projects = resume.projects ? JSON.parse(resume.projects) : [];
          const skills = resume.skills ? JSON.parse(resume.skills) : [];
          const certificates = resume.certificates ? JSON.parse(resume.certificates) : [];
          const languages = resume.languages ? JSON.parse(resume.languages) : [];
          const attachments = resume.attachments ? JSON.parse(resume.attachments) : [];
          
          // 构建完整的简历数据
          const fullResumeData = {
            basicInfo: basicInfo,
            title: resume.title,
            objective: basicInfo.jobObjective || '',
            summary: basicInfo.personalSummary || '',
            awards: basicInfo.awards || '',
            hobbies: basicInfo.hobbies || '',
            education: education,
            experience: experience,
            projects: projects,
            skills: skills,
            certificates: certificates,
            languages: languages,
            attachments: attachments
          };
          
          resumeDataString = JSON.stringify(fullResumeData);
          resumeUrl = `/api/resume/preview/${userId}`;
        }
      }
    }

    // 创建申请
    const application = await prisma.jobApplication.create({
      data: {
        userId,
        jobId,
        coverLetter,
        resumeUrl,
        resumeData: resumeDataString,
        expectedSalary,
        availableDate: availableDate ? new Date(availableDate) : null,
        additionalDocs: additionalDocs ? JSON.stringify(additionalDocs) : null
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        },
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

    res.status(201).json({
      success: true,
      data: application,
      message: '申请提交成功'
    });
  });

  // 获取用户工作申请
  getUserApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        jobId: true,
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
    });

    console.log('获取用户申请记录:', applications.length, '条');
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
      data: applications
    });
  });

  // 撤回工作申请
  withdrawApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const application = await prisma.jobApplication.findFirst({
      where: { id, userId }
    });

    if (!application) {
      throw createError('申请不存在', 404);
    }

    if (application.status !== 'PENDING') {
      throw createError('只能撤回待审核的申请', 400);
    }

    await prisma.jobApplication.update({
      where: { id },
      data: { status: 'WITHDRAWN' }
    });

    res.json({
      success: true,
      message: '申请已撤回'
    });
  });

  // 获取热门工作
  getPopularJobs = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 6 } = req.query;

    const jobs = await prisma.jobOpportunity.findMany({
      where: { status: 'PUBLISHED' },
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: jobs
    });
  });

  // 获取推荐工作
  getRecommendedJobs = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 6 } = req.query;

    const jobs = await prisma.jobOpportunity.findMany({
      where: { status: 'PUBLISHED' },
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: jobs
    });
  });

  // 搜索工作
  searchJobs = asyncHandler(async (req: Request, res: Response) => {
    const { keyword, category, type, province } = req.query;

    const where: any = {
      status: 'PUBLISHED'
    };

    if (keyword) {
      where.OR = [
        { title: { contains: keyword as string } },
        { description: { contains: keyword as string } },
        { company: { contains: keyword as string } }
      ];
    }

    if (category) where.category = category;
    if (type) where.type = type;
    if (province) where.province = province;

    const jobs = await prisma.jobOpportunity.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: jobs
    });
  });
}

export const jobController = new JobController();