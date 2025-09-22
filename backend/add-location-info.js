const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addLocationInfo() {
  try {
    // 添加位置信息
    const locationData = [
      {
        type: 'location',
        title: '公司地址',
        content: '北京市海淀区中关村大街1号',
        description: '位于中关村核心区域，交通便利',
        order: 10,
        enabled: true
      },
      {
        type: 'transport',
        title: '地铁',
        content: '4号线中关村站A出口',
        description: '步行约5分钟到达',
        order: 11,
        enabled: true
      },
      {
        type: 'transport',
        title: '公交',
        content: '302、307、320路中关村站',
        description: '多条公交线路直达',
        order: 12,
        enabled: true
      },
      {
        type: 'transport',
        title: '自驾',
        content: '中关村大街与北四环交叉口',
        description: '周边有多个停车场',
        order: 13,
        enabled: true
      },
      {
        type: 'nearby',
        title: '中关村创业大街',
        content: '中关村创业大街',
        description: '创新创业聚集地',
        order: 14,
        enabled: true
      },
      {
        type: 'nearby',
        title: '清华大学',
        content: '清华大学',
        description: '步行约10分钟',
        order: 15,
        enabled: true
      },
      {
        type: 'nearby',
        title: '北京大学',
        content: '北京大学',
        description: '步行约15分钟',
        order: 16,
        enabled: true
      },
      {
        type: 'nearby',
        title: '中科院',
        content: '中科院',
        description: '科研院所聚集区',
        order: 17,
        enabled: true
      }
    ];

    console.log('开始添加位置相关信息...');
    
    for (const data of locationData) {
      const result = await prisma.contactInfo.create({
        data: data
      });
      console.log(`✅ 已添加: ${data.title} (${data.type})`);
    }

    console.log('✅ 所有位置信息添加完成');
    
    // 查询所有联系信息
    const allContacts = await prisma.contactInfo.findMany({
      orderBy: { order: 'asc' }
    });
    
    console.log(`\n现在总共有 ${allContacts.length} 条联系信息:`);
    allContacts.forEach(contact => {
      console.log(`- ${contact.type}: ${contact.title} - ${contact.content}`);
    });

  } catch (error) {
    console.error('添加位置信息失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addLocationInfo();