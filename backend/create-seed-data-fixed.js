const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSeedData() {
  try {
    console.log('开始创建种子数据...\n');

    // 1. 创建园区数据
    console.log('创建园区数据...');
    const park = await prisma.park.create({
      data: {
        name: '逍遥科技产业园',
        description: '专注于高新技术产业发展的综合性科技园区，提供完善的创业孵化服务和产业配套设施。',
        type: '科技园区',
        level: '国家级',
        province: '北京市',
        city: '北京市',
        district: '海淀区',
        address: '北京市海淀区中关村科技园',
        area: 500000, // 50万平方米
        establishedYear: 2018,
        industries: JSON.stringify([
          '人工智能',
          '大数据',
          '云计算',
          '物联网',
          '生物医药'
        ]),
        policies: JSON.stringify([
          '税收优惠政策',
          '人才引进政策',
          '创业扶持政策'
        ]),
        contact: JSON.stringify({
          phone: '010-88888888',
          email: 'info@xiaoyaopark.com',
          website: 'https://www.xiaoyaopark.com'
        }),
        status: 'PUBLISHED'
      }
    });
    console.log('✅ 园区创建成功:', park.name);

    // 2. 创建政策数据
    console.log('\n创建政策数据...');
    const policy = await prisma.policy.create({
      data: {
        title: '高新技术企业创业扶持政策',
        content: `
## 政策概述
为支持高新技术企业创新创业，促进科技成果转化，特制定本扶持政策。

## 扶持对象
- 新注册的高新技术企业
- 科技型中小企业
- 创新创业团队

## 扶持措施
### 1. 资金扶持
- 创业启动资金：最高50万元
- 研发补贴：研发投入的30%，最高100万元
- 房租补贴：前两年房租的50%

### 2. 税收优惠
- 企业所得税减免：前三年减半征收
- 增值税优惠：符合条件的技术转让免征增值税

### 3. 人才支持
- 高层次人才引进补贴
- 员工培训费用补贴
- 社保缴费优惠

## 申请条件
1. 企业注册地在本园区
2. 符合高新技术企业认定标准
3. 具有自主知识产权
4. 研发人员占比不低于30%

## 申请流程
1. 在线提交申请材料
2. 专家评审
3. 现场核查
4. 公示
5. 资金拨付

## 联系方式
- 咨询电话：010-12345678
- 邮箱：policy@xiaoyao.com
        `,
        summary: '为高新技术企业提供资金、税收、人才等全方位扶持的综合性政策',
        type: '扶持政策',
        level: '国家级',
        publishDate: new Date('2024-01-01'),
        effectiveDate: new Date('2024-01-01'),
        expiryDate: new Date('2026-12-31'),
        tags: JSON.stringify(['创业扶持', '高新技术', '资金补贴', '税收优惠']),
        keywords: '高新技术,创业扶持,资金补贴,税收优惠',
        department: '科技部',
        viewCount: 0,
        status: 'PUBLISHED'
      }
    });
    console.log('✅ 政策创建成功:', policy.title);

    // 3. 创建项目数据
    console.log('\n创建项目数据...');
    const project = await prisma.startupProject.create({
      data: {
        title: '智能物联网监控系统',
        description: '基于人工智能和物联网技术的智能监控解决方案，适用于智慧城市、工业4.0等场景。',
        category: '人工智能',
        funding: 5000000, // 500万
        duration: 36, // 36个月
        requirements: '具备人工智能、物联网相关技术背景，有相关项目经验优先',
        benefits: '提供资金支持、技术指导、市场推广等全方位服务',
        applicationStart: new Date('2024-01-01'),
        applicationEnd: new Date('2025-12-31'),
        contactPerson: '张经理',
        contactPhone: '138-0000-1234',
        contactEmail: 'contact@iot-monitor.com',
        viewCount: 0,
        applicationCount: 0,
        status: 'PUBLISHED'
      }
    });
    console.log('✅ 项目创建成功:', project.title);

    // 4. 创建职位数据
    console.log('\n创建职位数据...');
    const job = await prisma.jobOpportunity.create({
      data: {
        title: '高级前端开发工程师',
        company: '逍遥科技有限公司',
        description: `
## 职位描述
我们正在寻找一位经验丰富的高级前端开发工程师，负责公司核心产品的前端开发工作。

## 工作职责
- 负责Web前端产品的设计、开发和维护
- 与产品经理、UI设计师协作，实现产品功能
- 优化前端性能，提升用户体验
- 参与技术方案设计和代码审查
- 指导初级开发人员

## 任职要求
- 本科及以上学历，计算机相关专业
- 5年以上前端开发经验
- 精通React、Vue等主流前端框架
- 熟悉TypeScript、ES6+语法
- 熟悉前端工程化工具（Webpack、Vite等）
- 具备良好的代码规范和团队协作能力

## 加分项
- 有移动端开发经验
- 熟悉Node.js后端开发
- 有开源项目贡献经验
- 有团队管理经验

## 福利待遇
- 薪资：25K-35K
- 五险一金 + 补充商业保险
- 年终奖 + 股权激励
- 弹性工作时间
- 免费午餐和下午茶
- 年度体检和团建活动
        `,
        requirements: JSON.stringify([
          '本科及以上学历',
          '5年以上前端开发经验',
          '精通React、Vue框架',
          '熟悉TypeScript',
          '良好的团队协作能力'
        ]),
        benefits: JSON.stringify([
          '25K-35K薪资',
          '五险一金',
          '年终奖',
          '股权激励',
          '弹性工作时间',
          '免费午餐'
        ]),
        location: '北京市海淀区',
        salaryRange: '25000-35000',
        workType: '全职',
        experience: '5年以上',
        education: '本科',
        contactEmail: 'hr@xiaoyao-tech.com',
        contactPhone: '010-66666666',
        deadline: new Date('2025-12-31'),
        isActive: true,
        views: 0
      }
    });
    console.log('✅ 职位创建成功:', job.title);

    // 统计创建结果
    console.log('\n📊 种子数据创建完成！');
    console.log('='.repeat(50));
    
    const counts = await Promise.all([
      prisma.park.count(),
      prisma.policy.count(),
      prisma.startupProject.count(),
      prisma.jobOpportunity.count()
    ]);
    
    console.log(`园区数量: ${counts[0]}`);
    console.log(`政策数量: ${counts[1]}`);
    console.log(`项目数量: ${counts[2]}`);
    console.log(`职位数量: ${counts[3]}`);
    
  } catch (error) {
    console.error('❌ 创建种子数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSeedData();