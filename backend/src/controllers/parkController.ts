import { Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';

class ParkController {
  // 获取园区列表
  getParks = asyncHandler(async (req: Request, res: Response) => {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      province, 
      city, 
      type, 
      level 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {
      status: 'PUBLISHED'
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }

    if (province) where.province = province;
    if (city) where.city = city;
    if (type) where.type = type;
    if (level) where.level = level;

    const [parks, total] = await Promise.all([
      prisma.park.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.park.count({ where })
    ]);

    res.json({
      success: true,
      data: parks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  });

  // 获取园区详情
  getParkById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const park = await prisma.park.findUnique({
      where: { id }
    });

    if (!park) {
      return res.status(404).json({
        success: false,
        message: '园区不存在'
      });
    }

    res.json({
      success: true,
      data: park
    });
  });

  // 获取省份列表
  getProvinces = asyncHandler(async (req: Request, res: Response) => {
    const provinces = await prisma.park.findMany({
      where: { status: 'PUBLISHED' },
      select: { province: true },
      distinct: ['province']
    });

    res.json({
      success: true,
      data: provinces.map(p => p.province)
    });
  });

  // 获取城市列表
  getCities = asyncHandler(async (req: Request, res: Response) => {
    const { province } = req.query;

    const cities = await prisma.park.findMany({
      where: { 
        status: 'PUBLISHED',
        ...(province && { province: province as string })
      },
      select: { city: true },
      distinct: ['city']
    });

    res.json({
      success: true,
      data: cities.map(c => c.city)
    });
  });

  // 获取热门园区
  getPopularParks = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 6 } = req.query;

    const parks = await prisma.park.findMany({
      where: { status: 'PUBLISHED' },
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: parks
    });
  });
}

export const parkController = new ParkController();