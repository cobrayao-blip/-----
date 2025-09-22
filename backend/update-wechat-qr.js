const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateWechatQR() {
  try {
    console.log('开始更新微信客服二维码...')

    // 查找微信客服记录
    const wechatContact = await prisma.contactInfo.findFirst({
      where: {
        type: 'social',
        title: {
          contains: '微信'
        }
      }
    })

    if (wechatContact) {
      // 更新微信客服，添加二维码（这里使用一个示例二维码图片URL）
      await prisma.contactInfo.update({
        where: { id: wechatContact.id },
        data: {
          qrCode: 'https://via.placeholder.com/200x200/4CAF50/white?text=WeChat+QR'
        }
      })
      console.log('✅ 微信客服二维码更新成功')
    } else {
      // 如果没有找到，创建一个新的微信客服记录
      await prisma.contactInfo.create({
        data: {
          type: 'social',
          title: '微信客服',
          content: 'xiaoyao_service',
          description: '工作时间：9:00-18:00',
          qrCode: 'https://via.placeholder.com/200x200/4CAF50/white?text=WeChat+QR',
          order: 1,
          enabled: true
        }
      })
      console.log('✅ 创建微信客服记录成功')
    }

    // 也为QQ群添加一个二维码
    const qqContact = await prisma.contactInfo.findFirst({
      where: {
        type: 'social',
        title: {
          contains: 'QQ'
        }
      }
    })

    if (qqContact) {
      await prisma.contactInfo.update({
        where: { id: qqContact.id },
        data: {
          qrCode: 'https://via.placeholder.com/200x200/1976D2/white?text=QQ+Group'
        }
      })
      console.log('✅ QQ交流群二维码更新成功')
    }

    console.log('🎉 所有二维码更新完成！')

  } catch (error) {
    console.error('❌ 更新二维码失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateWechatQR()