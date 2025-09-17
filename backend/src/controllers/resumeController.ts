import { Response } from 'express';
import { prisma } from '../index';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

class ResumeController {
  // 获取用户简历
  getResume = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    let resume = await prisma.resume.findUnique({
      where: { userId }
    });

    // 如果简历不存在，创建一个空的简历
    if (!resume) {
      resume = await prisma.resume.create({
        data: {
          userId,
          title: '我的简历',
          isPublic: false,
          isComplete: false
        }
      });
    }

    // 解析JSON字段
    const parsedResume = {
      ...resume,
      basicInfo: resume.basicInfo ? JSON.parse(resume.basicInfo as string) : {},
      education: resume.education ? JSON.parse(resume.education as string) : [],
      experience: resume.experience ? JSON.parse(resume.experience as string) : [],
      projects: resume.projects ? JSON.parse(resume.projects as string) : [],
      skills: resume.skills ? JSON.parse(resume.skills as string) : [],
      certificates: resume.certificates ? JSON.parse(resume.certificates as string) : [],
      languages: resume.languages ? JSON.parse(resume.languages as string) : [],
      awards: resume.awards || '', // awards是字符串，不需要JSON.parse
      attachments: resume.attachments ? JSON.parse(resume.attachments as string) : []
    };

    res.json({
      success: true,
      data: parsedResume
    });
  });

  // 更新简历
  updateResume = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const {
      title,
      basicInfo,
      objective,
      summary,
      education,
      experience,
      projects,
      skills,
      certificates,
      languages,
      hobbies,
      awards,
      attachments,
      isPublic,
      // 兼容直接传递的字段
      name,
      birthDate,
      hometown,
      phone,
      email,
      maritalStatus,
      employmentStatus
    } = req.body;

    console.log('收到的简历数据:', JSON.stringify(req.body, null, 2));

    // 处理basicInfo数据或直接传递的字段
    const finalObjective = objective || basicInfo?.jobObjective || '';
    const finalSummary = summary || basicInfo?.personalSummary || '';
    const finalHobbies = hobbies || basicInfo?.hobbies || '';
    const finalAwards = awards || basicInfo?.awards || '';

    // 检查简历完整度
    const isComplete = !!(title && finalObjective && finalSummary && education && experience);

    // 构建基本信息对象
    const basicInfoData = {
      name: name || basicInfo?.name || '',
      birthDate: birthDate || basicInfo?.birthDate || '',
      hometown: hometown || basicInfo?.hometown || '',
      phone: phone || basicInfo?.phone || '',
      email: email || basicInfo?.email || '',
      maritalStatus: maritalStatus || basicInfo?.maritalStatus || '',
      employmentStatus: employmentStatus || basicInfo?.employmentStatus || '',
      jobObjective: finalObjective,
      personalSummary: finalSummary,
      awards: finalAwards,
      hobbies: finalHobbies
    };

    const resume = await prisma.resume.upsert({
      where: { userId },
      update: {
        title,
        objective: finalObjective,
        summary: finalSummary,
        education: education ? JSON.stringify(education) : null,
        experience: experience ? JSON.stringify(experience) : null,
        projects: projects ? JSON.stringify(projects) : null,
        skills: skills ? JSON.stringify(skills) : null,
        certificates: certificates ? JSON.stringify(certificates) : null,
        languages: languages ? JSON.stringify(languages) : null,
        hobbies: finalHobbies,
        awards: typeof finalAwards === 'string' ? finalAwards : JSON.stringify(finalAwards || []),
        attachments: attachments ? JSON.stringify(attachments) : null,
        isPublic: isPublic || false,
        isComplete,
        basicInfo: JSON.stringify(basicInfoData)
      },
      create: {
        userId,
        title: title || '我的简历',
        objective: finalObjective,
        summary: finalSummary,
        education: education ? JSON.stringify(education) : null,
        experience: experience ? JSON.stringify(experience) : null,
        projects: projects ? JSON.stringify(projects) : null,
        skills: skills ? JSON.stringify(skills) : null,
        certificates: certificates ? JSON.stringify(certificates) : null,
        languages: languages ? JSON.stringify(languages) : null,
        hobbies: finalHobbies,
        awards: typeof finalAwards === 'string' ? finalAwards : JSON.stringify(finalAwards || []),
        attachments: attachments ? JSON.stringify(attachments) : null,
        isPublic: isPublic || false,
        isComplete,
        basicInfo: JSON.stringify(basicInfoData)
      }
    });

    console.log('简历保存成功:', resume.id);

    // 解析JSON字段返回
    const parsedResume = {
      ...resume,
      basicInfo: resume.basicInfo ? JSON.parse(resume.basicInfo as string) : {},
      education: resume.education ? JSON.parse(resume.education as string) : [],
      experience: resume.experience ? JSON.parse(resume.experience as string) : [],
      projects: resume.projects ? JSON.parse(resume.projects as string) : [],
      skills: resume.skills ? JSON.parse(resume.skills as string) : [],
      certificates: resume.certificates ? JSON.parse(resume.certificates as string) : [],
      languages: resume.languages ? JSON.parse(resume.languages as string) : [],
      awards: resume.awards || '', // awards是字符串，不需要JSON.parse
      attachments: resume.attachments ? JSON.parse(resume.attachments as string) : []
    };

    res.json({
      success: true,
      data: parsedResume
    });
  });

  // 上传简历附件
  uploadAttachment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { fileName, fileUrl, fileType, fileSize } = req.body;

    if (!fileName || !fileUrl) {
      throw createError('文件名和文件URL不能为空', 400);
    }

    // 获取当前简历
    let resume = await prisma.resume.findUnique({
      where: { userId }
    });

    if (!resume) {
      // 如果简历不存在，先创建
      resume = await prisma.resume.create({
        data: {
          userId,
          title: '我的简历',
          isPublic: false,
          isComplete: false
        }
      });
    }

    // 解析现有附件
    let attachments = [];
    if (resume.attachments) {
      try {
        attachments = JSON.parse(resume.attachments);
      } catch (error) {
        attachments = [];
      }
    }

    // 添加新附件
    const newAttachment = {
      id: Date.now().toString(),
      fileName,
      fileUrl,
      fileType: fileType || 'application/octet-stream',
      fileSize: fileSize || 0,
      uploadTime: new Date().toISOString()
    };

    attachments.push(newAttachment);

    // 更新简历
    const updatedResume = await prisma.resume.update({
      where: { userId },
      data: {
        attachments: JSON.stringify(attachments)
      }
    });

    res.json({
      success: true,
      data: {
        resume: updatedResume,
        attachment: newAttachment
      },
      message: '附件上传成功'
    });
  });

  // 删除简历附件
  deleteAttachment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { attachmentId } = req.params;

    const resume = await prisma.resume.findUnique({
      where: { userId }
    });

    if (!resume) {
      throw createError('简历不存在', 404);
    }

    // 解析现有附件
    let attachments = [];
    if (resume.attachments) {
      try {
        attachments = JSON.parse(resume.attachments);
      } catch (error) {
        attachments = [];
      }
    }

    // 删除指定附件
    attachments = attachments.filter((att: any) => att.id !== attachmentId);

    // 更新简历
    const updatedResume = await prisma.resume.update({
      where: { userId },
      data: {
        attachments: JSON.stringify(attachments)
      }
    });

    res.json({
      success: true,
      data: updatedResume,
      message: '附件删除成功'
    });
  });

  // 获取简历预览（用于申请时展示给管理员）
  getResumePreview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    const resume = await prisma.resume.findUnique({
      where: { userId },
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

    if (!resume) {
      throw createError('简历不存在', 404);
    }

    // 解析JSON字段
    const resumeData = {
      ...resume,
      education: resume.education ? JSON.parse(resume.education) : [],
      experience: resume.experience ? JSON.parse(resume.experience) : [],
      projects: resume.projects ? JSON.parse(resume.projects) : [],
      skills: resume.skills ? JSON.parse(resume.skills) : [],
      certificates: resume.certificates ? JSON.parse(resume.certificates) : [],
      languages: resume.languages ? JSON.parse(resume.languages) : [],
      awards: resume.awards || '', // awards是字符串，不需要JSON.parse
      attachments: resume.attachments ? JSON.parse(resume.attachments) : []
    };

    res.json({
      success: true,
      data: resumeData
    });
  });

  // 导出简历为PDF（模拟功能）
  exportResume = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const resume = await prisma.resume.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!resume) {
      throw createError('简历不存在', 404);
    }

    // 这里应该实现PDF生成逻辑
    // 目前返回模拟的PDF URL
    const pdfUrl = `/api/resume/pdf/${userId}`;

    res.json({
      success: true,
      data: {
        pdfUrl,
        fileName: `${resume.user.name}_简历.pdf`
      },
      message: '简历导出成功'
    });
  });
}

export const resumeController = new ResumeController();