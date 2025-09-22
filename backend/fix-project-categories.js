const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProjectCategories() {
  try {
    console.log('=== 修复项目分类数据 ===\n');

    // 删除现有的项目数据
    console.log('1. 清除现有项目数据...');
    await prisma.startupProject.deleteMany({});
    console.log('✅ 项目数据清除完成');

    // 重新创建正确的项目数据
    console.log('\n2. 重新创建项目数据...');
    const projects = [
      {
        title: '人工智能医疗诊断系统',
        description: '基于深度学习技术的智能医疗诊断系统，能够辅助医生进行疾病诊断，提高诊断准确率和效率。项目已完成核心算法开发，正在进行临床试验验证。',
        category: 'TECH',
        funding: 2000000,
        duration: 36,
        requirements: '具有人工智能、医疗器械或相关技术背景，有医疗行业经验者优先。团队需要包含技术开发、产品设计、市场营销等关键岗位人员。',
        benefits: '提供启动资金200万元，免费提供办公场地3年，协助申请相关资质认证，提供专业导师指导，优先推荐参与政府采购项目。',
        applicationStart: new Date('2024-02-01'),
        applicationEnd: new Date('2024-04-30'),
        contactPerson: '李博士',
        contactPhone: '13800001001',
        contactEmail: 'li.doctor@aimedical.com',
        viewCount: 450,
        applicationCount: 12,
        status: 'PUBLISHED'
      },
      {
        title: '新能源汽车充电桩智能管理平台',
        description: '开发新一代智能充电桩管理系统，集成物联网、大数据、云计算技术，实现充电桩的智能调度、远程监控、故障预警等功能，提升充电效率和用户体验。',
        category: 'ENERGY',
        funding: 1500000,
        duration: 24,
        requirements: '具有物联网、云计算、新能源汽车相关技术背景。熟悉充电桩行业标准和规范，有相关项目经验者优先。',
        benefits: '提供启动资金150万元，提供技术研发实验室，协助对接新能源汽车企业和充电运营商，提供市场推广支持。',
        applicationStart: new Date('2024-01-15'),
        applicationEnd: new Date('2024-03-15'),
        contactPerson: '王工程师',
        contactPhone: '13800001002',
        contactEmail: 'wang.engineer@evcharge.com',
        viewCount: 380,
        applicationCount: 8,
        status: 'PUBLISHED'
      },
      {
        title: '智慧农业物联网解决方案',
        description: '构建基于物联网技术的智慧农业管理系统，通过传感器网络实时监测土壤、气候、作物生长状况，结合AI算法提供精准农业指导，提高农业生产效率和质量。',
        category: 'AGRICULTURE',
        funding: 1000000,
        duration: 30,
        requirements: '具有物联网、农业技术、数据分析相关背景。了解现代农业发展趋势，有农业科技项目经验者优先。',
        benefits: '提供启动资金100万元，协助建设农业示范基地，提供农业专家技术指导，协助申请农业科技项目补贴。',
        applicationStart: new Date('2024-02-15'),
        applicationEnd: new Date('2024-05-15'),
        contactPerson: '张农艺师',
        contactPhone: '13800001003',
        contactEmail: 'zhang.agri@smartfarm.com',
        viewCount: 320,
        applicationCount: 15,
        status: 'PUBLISHED'
      },
      {
        title: '区块链供应链金融平台',
        description: '利用区块链技术构建透明、可信的供应链金融服务平台，解决中小企业融资难问题，提高供应链金融效率，降低风险成本。',
        category: 'FINTECH',
        funding: 3000000,
        duration: 42,
        requirements: '具有区块链技术、金融科技、供应链管理相关背景。熟悉金融监管政策，有金融科技项目经验者优先。',
        benefits: '提供启动资金300万元，协助申请金融科技创新监管沙盒，提供法律合规指导，协助对接银行和金融机构。',
        applicationStart: new Date('2024-01-01'),
        applicationEnd: new Date('2024-06-30'),
        contactPerson: '陈总监',
        contactPhone: '13800001004',
        contactEmail: 'chen.director@blockfinance.com',
        viewCount: 520,
        applicationCount: 6,
        status: 'PUBLISHED'
      },
      {
        title: '环保材料回收再利用技术',
        description: '开发新型环保材料回收处理技术，实现废弃塑料、电子垃圾等的高效回收和再利用，减少环境污染，创造经济价值。',
        category: 'ENVIRONMENT',
        funding: 800000,
        duration: 18,
        requirements: '具有材料科学、环境工程、化学工程相关背景。了解环保政策法规，有环保项目实施经验者优先。',
        benefits: '提供启动资金80万元，协助申请环保专项补贴，提供环保技术认证支持，协助对接环保企业和政府部门。',
        applicationStart: new Date('2024-03-01'),
        applicationEnd: new Date('2024-07-31'),
        contactPerson: '刘研究员',
        contactPhone: '13800001005',
        contactEmail: 'liu.researcher@ecorecycle.com',
        viewCount: 280,
        applicationCount: 10,
        status: 'PUBLISHED'
      },
      {
        title: '在线教育个性化学习平台',
        description: '基于人工智能技术的个性化在线教育平台，通过学习行为分析和知识图谱构建，为每个学生提供定制化的学习路径和内容推荐。',
        category: 'EDUCATION',
        funding: 1200000,
        duration: 24,
        requirements: '具有教育技术、人工智能、软件开发相关背景。了解在线教育行业发展趋势，有教育产品开发经验者优先。',
        benefits: '提供启动资金120万元，协助对接教育机构和学校，提供教育内容资源支持，协助申请教育科技项目认定。',
        applicationStart: new Date('2024-02-01'),
        applicationEnd: new Date('2024-05-31'),
        contactPerson: '赵老师',
        contactPhone: '13800001006',
        contactEmail: 'zhao.teacher@eduai.com',
        viewCount: 410,
        applicationCount: 18,
        status: 'PUBLISHED'
      }
    ];

    for (const projectData of projects) {
      await prisma.startupProject.create({ data: projectData });
      console.log(`✓ 项目创建成功: ${projectData.title} (${projectData.category})`);
    }

    console.log('\n=== 项目分类修复完成 ===');
    console.log('✅ 所有项目现在都使用正确的分类标识');

  } catch (error) {
    console.error('修复失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProjectCategories();