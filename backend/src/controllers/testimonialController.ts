import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// 获取所有用户评价（公开接口）
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        enabled: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    res.json({
      success: true,
      testimonials
    })
  } catch (error) {
    console.error('获取评价列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取评价列表失败'
    })
  }
}

// 获取所有用户评价（管理员接口）
export const getTestimonialsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { role: { contains: search as string } },
        { content: { contains: search as string } }
      ]
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.testimonial.count({ where })
    ])

    res.json({
      success: true,
      data: {
        testimonials,
        total
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('获取管理员评价列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取评价列表失败'
    })
  }
}

// 创建用户评价
export const createTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, avatar, content, rating = 5, order = 0, enabled = true } = req.body

    if (!name || !role || !content) {
      return res.status(400).json({
        success: false,
        message: '姓名、职位和评价内容为必填项'
      })
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        avatar,
        content,
        rating: Number(rating),
        order: Number(order),
        enabled: Boolean(enabled)
      }
    })

    res.status(201).json({
      success: true,
      data: testimonial,
      message: '用户评价创建成功'
    })
  } catch (error) {
    console.error('创建评价失败:', error)
    res.status(500).json({
      success: false,
      message: '创建评价失败'
    })
  }
}

// 更新用户评价
export const updateTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name, role, avatar, content, rating, order, enabled } = req.body

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: '用户评价不存在'
      })
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        role,
        avatar,
        content,
        rating: rating ? Number(rating) : undefined,
        order: order !== undefined ? Number(order) : undefined,
        enabled: enabled !== undefined ? Boolean(enabled) : undefined
      }
    })

    res.json({
      success: true,
      data: testimonial,
      message: '用户评价更新成功'
    })
  } catch (error) {
    console.error('更新评价失败:', error)
    res.status(500).json({
      success: false,
      message: '更新评价失败'
    })
  }
}

// 删除用户评价
export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: '用户评价不存在'
      })
    }

    await prisma.testimonial.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: '用户评价删除成功'
    })
  } catch (error) {
    console.error('删除评价失败:', error)
    res.status(500).json({
      success: false,
      message: '删除评价失败'
    })
  }
}

// 批量更新排序
export const updateTestimonialOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: '无效的排序数据'
      })
    }

    // 批量更新排序
    const updatePromises = items.map((item: { id: string; order: number }) =>
      prisma.testimonial.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    )

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: '排序更新成功'
    })
  } catch (error) {
    console.error('更新排序失败:', error)
    res.status(500).json({
      success: false,
      message: '更新排序失败'
    })
  }
}

// 切换启用状态
export const toggleTestimonialStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: '用户评价不存在'
      })
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        enabled: !existingTestimonial.enabled
      }
    })

    res.json({
      success: true,
      data: testimonial,
      message: `用户评价已${testimonial.enabled ? '启用' : '禁用'}`
    })
  } catch (error) {
    console.error('切换状态失败:', error)
    res.status(500).json({
      success: false,
      message: '切换状态失败'
    })
  }
}