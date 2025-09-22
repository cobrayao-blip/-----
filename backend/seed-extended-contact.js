const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('开始添加扩展联系信息数据...\n');

    // 添加社交媒体信息
    const socialMediaData = [
      {
        type: 'social',
        title: '微信客服',
        content: 'xiaoyao_service',
        description: '工作时间在线，扫码添加',
        order: 20,
        enabled: true
      },
      {
        type: 'social',
        title: 'QQ交流群',
        content: '123456789',
        description: '技术交流、问题咨询',
        order: 21,
        enabled: true
      },
      {
        type: 'social',
        title: '微信公众号',
        content: '逍遥人才网',
        description: '最新政策、活动资讯',
        order: 22,
        enabled: true
      }
    ];

    // 添加位置信息
    const locationData = [
      {
        type: 'location',
        title: '总部位置',
        content: '北京市海淀区中关村科技园区创业大街15号逍遥大厦8层',
        description: '地铁4号线中关村站A出口步行5分钟',
        order: 30,
        enabled: true
      },
      {
        type: 'location',
        title: '分部地址',
        content: '上海市浦东新区张江高科技园区科苑路399号',
        description: '地铁2号线张江高科站B出口',
        order: 31,
        enabled: true
      }
    ];

    // 添加交通指南
    const transportData = [
      {
        type: 'transport',
        title: '地铁',
        content: '4号线中关村站A出口，步行5分钟',
        description: '最便捷的交通方式',
        order: 40,
        enabled: true
      },
      {
        type: 'transport',
        title: '公交',
        content: '302、307、320、332、355路中关村站',
        description: '多条线路可达',
        order: 41,
        enabled: true
      },
      {
        type: 'transport',
        title: '自驾',
        content: '中关村大街与北四环交叉口东南角',
        description: '大厦地下有停车场',
        order: 42,
        enabled: true
      },
      {
        type: 'transport',
        title: '打车',
        content: '导航至"中关村创业大街15号"',
        description: '滴滴、快的等均可到达',
        order: 43,
        enabled: true
      }
    ];

    // 添加周边设施
    const nearbyData = [
      {
        type: 'nearby',
        title: '中关村创业大街',
        content: '中关村创业大街',
        description: '步行2分钟，创业氛围浓厚',
        order: 50,
        enabled: true
      },
      {
        type: 'nearby',
        title: '清华大学',
        content: '清华大学',
        description: '步行10分钟，学术资源丰富',
        order: 51,
        enabled: true
      },
      {
        type: 'nearby',
        title: '北京大学',
        content: '北京大学',
        description: '步行15分钟，人才荟萃',
        order: 52,
        enabled: true
      },
      {
        type: 'nearby',
        title: '中科院',
        content: '中国科学院',
        description: '步行8分钟，科研院所集中',
        order: 53,
        enabled: true
      },
      {
        type: 'nearby',
        title: '中关村软件园',
        content: '中关村软件园',
        description: '车程10分钟，IT企业聚集地',
        order: 54,
        enabled: true
      },
      {
        type: 'nearby',
        title: '海淀图书城',
        content: '海淀图书城',
        description: '步行5分钟，学习资源丰富',
        order: 55,
        enabled: true
      }
    ];

    // 合并所有数据
    const allData = [...socialMediaData, ...locationData, ...transportData, ...nearbyData];

    // 批量创建数据
    for (const contactInfo of allData) {
      await prisma.contactInfo.create({
        data: contactInfo
      });
      console.log(`✓ ${contactInfo.type} 信息创建成功: ${contactInfo.title}`);
    }

    console.log('\n✅ 扩展联系信息数据填充完成！');
    console.log(`📊 共创建 ${allData.length} 条扩展联系信息记录`);

    console.log('\n📋 数据分类统计：');
    const typeCount = allData.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(typeCount).forEach(([type, count]) => {
      const typeNames = {
        'social': '社交媒体',
        'location': '位置信息',
        'transport': '交通指南',
        'nearby': '周边设施'
      };
      console.log(`- ${typeNames[type] || type}: ${count} 条`);
    });

    console.log('\n🎯 现在管理员可以在后台"页面内容管理" → "联系信息"中编辑：');
    console.log('- 社交媒体（微信、QQ、公众号等）');
    console.log('- 位置信息（总部、分部地址等）');
    console.log('- 交通指南（地铁、公交、自驾、打车）');
    console.log('- 周边设施（大学、科研院所、商业设施等）');

  } catch (error) {
    console.error('填充扩展联系信息数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();