const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkContactData() {
  try {
    console.log('检查联系信息数据...')
    
    const socialContacts = await prisma.contactInfo.findMany({
      where: { type: 'social' }
    })
    
    console.log('社交媒体联系信息:')
    socialContacts.forEach(item => {
      console.log(`ID: ${item.id}`)
      console.log(`标题: ${item.title}`)
      console.log(`内容: ${item.content}`)
      console.log(`二维码: ${item.qrCode}`)
      console.log(`启用: ${item.enabled}`)
      console.log('---')
    })
    
    console.log(`总共找到 ${socialContacts.length} 条社交媒体联系信息`)
    
  } catch (error) {
    console.error('检查数据失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkContactData()