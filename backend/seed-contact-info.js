const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('开始填充联系信息数据...\n');

    // 清除现有的联系信息数据
    await prisma.contactInfo.deleteMany({});
    console.log('已清除现有联系信息数据');

    // 创建联系信息数据
    const contactInfoData = [
      {
        type: 'phone',
        title: '客服热线',
        content: '400-888-8888',
        description: '7×24小时服务热线',
        order: 1,
        enabled: true
      },
      {
        type: 'email',
        title: '邮箱地址',
        content: 'contact@xiaoyao.com',
        description: '商务合作与意见建议',
        order: 2,
        enabled: true
      },
      {
        type: 'address',
        title: '公司地址',
        content: '北京市海淀区中关村科技园区创业大街15号',
        description: '欢迎预约实地参观',
        order: 3,
        enabled: true
      },
      {
        type: 'hours',
        title: '工作时间',
        content: '周一至周五 9:00-18:00',
        description: '节假日客服在线',
        order: 4,
        enabled: true
      },
      {
        type: 'department',
        title: '客户服务部',
        content: '400-888-8888 转 1',
        description: '账户问题、使用咨询、技术支持',
        order: 5,
        enabled: true
      },
      {
        type: 'department',
        title: '商务合作部',
        content: '400-888-8888 转 2',
        description: '园区合作、政策对接、项目孵化',
        order: 6,
        enabled: true
      },
      {
        type: 'department',
        title: '市场推广部',
        content: '400-888-8888 转 3',
        description: '媒体合作、活动策划、品牌推广',
        order: 7,
        enabled: true
      },
      {
        type: 'department',
        title: '技术支持部',
        content: '400-888-8888 转 4',
        description: '系统故障、功能建议、技术咨询',
        order: 8,
        enabled: true
      },
      {
        type: 'email',
        title: '商务合作邮箱',
        content: 'business@xiaoyao.com',
        description: '商务洽谈、合作咨询',
        order: 9,
        enabled: true
      },
      {
        type: 'email',
        title: '技术支持邮箱',
        content: 'tech@xiaoyao.com',
        description: '技术问题、系统反馈',
        order: 10,
        enabled: true
      }
    ];

    // 批量创建联系信息
    for (const contactInfo of contactInfoData) {
      await prisma.contactInfo.create({
        data: contactInfo
      });
      console.log(`✓ 联系信息创建成功: ${contactInfo.title} (${contactInfo.type})`);
    }

    console.log('\n✅ 联系信息数据填充完成！');
    console.log(`📊 共创建 ${contactInfoData.length} 条联系信息记录`);

    console.log('\n📋 数据分类统计：');
    const typeCount = contactInfoData.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(typeCount).forEach(([type, count]) => {
      const typeNames = {
        'phone': '电话',
        'email': '邮箱',
        'address': '地址',
        'hours': '工作时间',
        'department': '部门联系'
      };
      console.log(`- ${typeNames[type] || type}: ${count} 条`);
    });

  } catch (error) {
    console.error('填充联系信息数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();