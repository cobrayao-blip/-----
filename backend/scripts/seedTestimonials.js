const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedTestimonials() {
  try {
    console.log('正在创建用户评价数据...')
    
    const testimonials = [
      {
        name: '张创业',
        role: '科技公司CEO',
        avatar: 'https://via.placeholder.com/64x64?text=张',
        content: '通过逍遥人才网，我们成功入驻了理想的科技园区，享受到了优质的政策支持。',
        rating: 5,
        order: 1,
        enabled: true
      },
      {
        name: '李工程师',
        role: '高级工程师',
        avatar: 'https://via.placeholder.com/64x64?text=李',
        content: '平台提供的职位信息很精准，帮助我找到了心仪的工作机会。',
        rating: 5,
        order: 2,
        enabled: true
      },
      {
        name: '王投资人',
        role: '投资经理',
        avatar: 'https://via.placeholder.com/64x64?text=王',
        content: '这里有很多优质的创业项目，是我们寻找投资标的的重要渠道。',
        rating: 5,
        order: 3,
        enabled: true
      }
    ]

    // 清空现有数据
    await prisma.testimonial.deleteMany({})
    console.log('已清空现有用户评价数据')

    // 创建新数据
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({
        data: testimonial
      })
      console.log(`创建用户评价: ${testimonial.name} - ${testimonial.role}`)
    }

    console.log('用户评价数据创建完成！')
    
  } catch (error) {
    console.error('创建用户评价数据失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTestimonials()