const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearContacts() {
  try {
    console.log('清除旧的联系信息数据...');
    
    // 删除所有联系信息
    await prisma.contactInfo.deleteMany();
    console.log('✓ 旧联系信息数据已清除');
    
    // 重新创建正确的联系信息
    const contacts = [
      {
        type: 'phone',
        title: '客服热线',
        content: '400-123-4567',
        description: '工作日 9:00-18:00，节假日 10:00-16:00',
        order: 1,
        enabled: true
      },
      {
        type: 'email',
        title: '邮箱联系',
        content: 'service@xiaoyao.com',
        description: '我们会在24小时内回复您的邮件',
        order: 2,
        enabled: true
      },
      {
        type: 'address',
        title: '办公地址',
        content: '北京市海淀区中关村大街1号',
        description: '欢迎预约到访，工作日 9:00-18:00',
        order: 3,
        enabled: true
      },
      {
        type: 'social',
        title: '微信公众号',
        content: '逍遥人才网',
        description: '关注公众号获取最新资讯和政策信息',
        order: 4,
        enabled: true
      },
      {
        type: 'social',
        title: 'QQ客服群',
        content: '123456789',
        description: '加入QQ群与其他用户交流经验',
        order: 5,
        enabled: true
      }
    ];

    for (const contactData of contacts) {
      await prisma.contactInfo.create({ data: contactData });
      console.log(`✓ 联系信息创建成功: ${contactData.title}`);
    }
    
    console.log('✅ 联系信息数据更新完成！');
    
  } catch (error) {
    console.error('❌ 更新联系信息失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearContacts();