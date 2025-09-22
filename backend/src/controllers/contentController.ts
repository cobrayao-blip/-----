import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';
import { createError } from '../utils/createError';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// 使用指南相关API
export const getGuides = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  
  const where = category ? { category: category as string, enabled: true } : { enabled: true };
  
  const guides = await prisma.guide.findMany({
    where,
    orderBy: { order: 'asc' }
  });

  res.json({
    success: true,
    data: guides
  });
});

export const createGuide = asyncHandler(async (req: Request, res: Response) => {
  const { category, title, content, steps, order, enabled } = req.body;

  if (!category || !title || !content) {
    throw createError('请提供必要的指南信息', 400);
  }

  const guide = await prisma.guide.create({
    data: {
      category,
      title,
      content,
      steps: steps ? JSON.stringify(steps) : null,
      order: order || 0,
      enabled: enabled !== undefined ? enabled : true
    }
  });

  res.status(201).json({
    success: true,
    data: guide,
    message: '指南创建成功'
  });
});

export const updateGuide = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category, title, content, steps, order, enabled } = req.body;

  const guide = await prisma.guide.findUnique({
    where: { id }
  });

  if (!guide) {
    throw createError('指南不存在', 404);
  }

  const updatedGuide = await prisma.guide.update({
    where: { id },
    data: {
      ...(category && { category }),
      ...(title && { title }),
      ...(content && { content }),
      ...(steps && { steps: JSON.stringify(steps) }),
      ...(order !== undefined && { order }),
      ...(enabled !== undefined && { enabled })
    }
  });

  res.json({
    success: true,
    data: updatedGuide,
    message: '指南更新成功'
  });
});

export const deleteGuide = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const guide = await prisma.guide.findUnique({
    where: { id }
  });

  if (!guide) {
    throw createError('指南不存在', 404);
  }

  await prisma.guide.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: '指南删除成功'
  });
});

// FAQ相关API
export const getFAQs = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  
  const where = category ? { category: category as string, enabled: true } : { enabled: true };
  
  const faqs = await prisma.fAQ.findMany({
    where,
    orderBy: { order: 'asc' }
  });

  res.json({
    success: true,
    data: faqs
  });
});

export const createFAQ = asyncHandler(async (req: Request, res: Response) => {
  const { category, question, answer, order, enabled } = req.body;

  if (!category || !question || !answer) {
    throw createError('请提供必要的FAQ信息', 400);
  }

  const faq = await prisma.fAQ.create({
    data: {
      category,
      question,
      answer,
      order: order || 0,
      enabled: enabled !== undefined ? enabled : true
    }
  });

  res.status(201).json({
    success: true,
    data: faq,
    message: 'FAQ创建成功'
  });
});

export const updateFAQ = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category, question, answer, order, enabled } = req.body;

  const faq = await prisma.fAQ.findUnique({
    where: { id }
  });

  if (!faq) {
    throw createError('FAQ不存在', 404);
  }

  const updatedFAQ = await prisma.fAQ.update({
    where: { id },
    data: {
      ...(category && { category }),
      ...(question && { question }),
      ...(answer && { answer }),
      ...(order !== undefined && { order }),
      ...(enabled !== undefined && { enabled })
    }
  });

  res.json({
    success: true,
    data: updatedFAQ,
    message: 'FAQ更新成功'
  });
});

export const deleteFAQ = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const faq = await prisma.fAQ.findUnique({
    where: { id }
  });

  if (!faq) {
    throw createError('FAQ不存在', 404);
  }

  await prisma.fAQ.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: 'FAQ删除成功'
  });
});

// 增加FAQ浏览量
export const incrementFAQViews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const faq = await prisma.fAQ.findUnique({
    where: { id }
  });

  if (!faq) {
    throw createError('FAQ不存在', 404);
  }

  await prisma.fAQ.update({
    where: { id },
    data: {
      views: {
        increment: 1
      }
    }
  });

  res.json({
    success: true,
    message: '浏览量已更新'
  });
});

// 联系信息相关API
export const getContactInfos = asyncHandler(async (req: Request, res: Response) => {
  const contactInfos = await prisma.contactInfo.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' }
  });

  res.json({
    success: true,
    data: contactInfos
  });
});

export const createContactInfo = asyncHandler(async (req: Request, res: Response) => {
  const { type, title, content, description, order, enabled } = req.body;

  if (!type || !title || !content) {
    throw createError('请提供必要的联系信息', 400);
  }

  const contactInfo = await prisma.contactInfo.create({
    data: {
      type,
      title,
      content,
      description,
      order: order || 0,
      enabled: enabled !== undefined ? enabled : true
    }
  });

  res.status(201).json({
    success: true,
    data: contactInfo,
    message: '联系信息创建成功'
  });
});

export const updateContactInfo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, title, content, description, qrCode, order, enabled } = req.body;

  const contactInfo = await prisma.contactInfo.findUnique({
    where: { id }
  });

  if (!contactInfo) {
    throw createError('联系信息不存在', 404);
  }

  const updatedContactInfo = await prisma.contactInfo.update({
    where: { id },
    data: {
      ...(type && { type }),
      ...(title && { title }),
      ...(content && { content }),
      ...(description !== undefined && { description }),
      ...(qrCode !== undefined && { qrCode }),
      ...(order !== undefined && { order }),
      ...(enabled !== undefined && { enabled })
    }
  });

  res.json({
    success: true,
    data: updatedContactInfo,
    message: '联系信息更新成功'
  });
});

export const deleteContactInfo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const contactInfo = await prisma.contactInfo.findUnique({
    where: { id }
  });

  if (!contactInfo) {
    throw createError('联系信息不存在', 404);
  }

  await prisma.contactInfo.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: '联系信息删除成功'
  });
});

// 意见反馈相关API
export const getFeedbacks = asyncHandler(async (req: Request, res: Response) => {
  const { status, type } = req.query;
  
  const where: any = {};
  if (status) where.status = status;
  if (type) where.type = type;
  
  const feedbacks = await prisma.feedback.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    success: true,
    data: feedbacks
  });
});

export const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { type, title, content, contact, rating } = req.body;

  if (!type || !title || !content || !contact) {
    throw createError('请提供必要的反馈信息', 400);
  }

  const feedback = await prisma.feedback.create({
    data: {
      type,
      title,
      content,
      contact,
      rating: rating || 5
    }
  });

  res.status(201).json({
    success: true,
    data: feedback,
    message: '反馈提交成功'
  });
});

export const updateFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, response } = req.body;

  const feedback = await prisma.feedback.findUnique({
    where: { id }
  });

  if (!feedback) {
    throw createError('反馈不存在', 404);
  }

  const updatedFeedback = await prisma.feedback.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(response !== undefined && { response })
    }
  });

  res.json({
    success: true,
    data: updatedFeedback,
    message: '反馈更新成功'
  });
});

export const deleteFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const feedback = await prisma.feedback.findUnique({
    where: { id }
  });

  if (!feedback) {
    throw createError('反馈不存在', 404);
  }

  await prisma.feedback.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: '反馈删除成功'
  });
});

// 上传联系信息图片（二维码等）
export const uploadContactImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw createError('请选择要上传的图片文件', 400);
  }

  const file = req.file;
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(fileExt)) {
    // 删除已上传的文件
    fs.unlinkSync(file.path);
    throw createError('只支持JPG、PNG、GIF、WEBP格式的图片文件', 400);
  }

  // 构建文件访问URL
  const fileUrl = `/uploads/${file.filename}`;

  res.json({
    success: true,
    message: '图片上传成功',
    data: {
      filename: file.filename,
      originalName: file.originalname,
      url: fileUrl,
      size: file.size
    }
  });
});