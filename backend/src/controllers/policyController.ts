import { Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';

class PolicyController {
  // 获取政策列表
  getPolicies = asyncHandler(async (req: Request, res: Response) => {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      type, 
      level, 
      province, 
      city 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {
      status: 'PUBLISHED'
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { content: { contains: search as string } }
      ];
    }

    if (type) where.type = type;
    if (level) where.level = level;
    if (province) where.province = province;
    if (city) where.city = city;

    const [policies, total] = await Promise.all([
      prisma.policy.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.policy.count({ where })
    ]);

    res.json({
      success: true,
      data: policies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  });

  // 获取政策详情
  getPolicyById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const policy = await prisma.policy.findUnique({
      where: { id }
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: '政策不存在'
      });
    }

    res.json({
      success: true,
      data: policy
    });
  });

  // 获取热门政策
  getPopularPolicies = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 6 } = req.query;

    const policies = await prisma.policy.findMany({
      where: { status: 'PUBLISHED' },
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: policies
    });
  });

  // 获取最新政策
  getLatestPolicies = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 6 } = req.query;

    const policies = await prisma.policy.findMany({
      where: { status: 'PUBLISHED' },
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: policies
    });
  });

  // 搜索政策
  searchPolicies = asyncHandler(async (req: Request, res: Response) => {
    const { keyword, type, province } = req.query;

    const where: any = {
      status: 'PUBLISHED'
    };

    if (keyword) {
      where.OR = [
        { title: { contains: keyword as string } },
        { content: { contains: keyword as string } }
      ];
    }

    if (type) where.type = type;
    if (province) where.province = province;

    const policies = await prisma.policy.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: policies
    });
  });
}

export const policyController = new PolicyController();