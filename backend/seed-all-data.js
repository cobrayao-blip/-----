const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAllData() {
  try {
    console.log('开始填充所有板块的种子数据...');

    // 1. 创建用户数据
    console.log('\n=== 创建用户数据 ===');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('123456', 10);

    const users = [
      {
        email: 'admin@xiaoyao.com',
        password: hashedAdminPassword,
        name: '系统管理员',
        phone: '13800138000',
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      {
        email: 'user1@test.com',
        password: hashedUserPassword,
        name: '张三',
        phone: '13900139001',
        role: 'USER',
        status: 'ACTIVE'
      },
      {
        email: 'user2@test.com',
        password: hashedUserPassword,
        name: '李四',
        phone: '13900139002',
        role: 'USER',
        status: 'ACTIVE'
      },
      {
        email: 'user3@test.com',
        password: hashedUserPassword,
        name: '王五',
        phone: '13900139003',
        role: 'USER',
        status: 'ACTIVE'
      },
      {
        email: 'user4@test.com',
        password: hashedUserPassword,
        name: '赵六',
        phone: '13900139004',
        role: 'USER',
        status: 'ACTIVE'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
      createdUsers.push(user);
      console.log(`✓ 用户创建成功: ${user.name} (${user.email})`);
    }

    // 2. 创建产业园区数据
    console.log('\n=== 创建产业园区数据 ===');
    const parks = [
      {
        name: '中关村科技园',
        description: '中国最具影响力的高科技产业园区，汇聚了众多知名科技企业和创新团队',
        type: 'TECH',
        level: 'NATIONAL',
        province: '北京市',
        city: '北京市',
        district: '海淀区',
        address: '中关村大街1号',
        latitude: 39.9042,
        longitude: 116.4074,
        establishedYear: 1988,
        area: 488.0,
        industries: JSON.stringify(['信息技术', '生物医药', '新材料', '新能源']),
        policies: JSON.stringify(['税收优惠', '人才引进', '资金扶持', '创业孵化']),
        contact: JSON.stringify({
          phone: '010-82691188',
          email: 'info@zgc.gov.cn',
          website: 'http://www.zgc.gov.cn'
        }),
        images: JSON.stringify(['/images/parks/zgc1.jpg', '/images/parks/zgc2.jpg']),
        status: 'PUBLISHED'
      },
      {
        name: '张江高科技园区',
        description: '上海市重点发展的高科技产业园区，专注于集成电路、生物医药、人工智能等领域',
        type: 'TECH',
        level: 'NATIONAL',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        address: '张江路1388号',
        latitude: 31.2304,
        longitude: 121.4737,
        establishedYear: 1992,
        area: 25.0,
        industries: JSON.stringify(['集成电路', '生物医药', '人工智能', '软件信息']),
        policies: JSON.stringify(['研发费用加计扣除', '高新技术企业认定', '人才落户政策']),
        contact: JSON.stringify({
          phone: '021-50801188',
          email: 'service@zjpark.com',
          website: 'http://www.zjpark.com'
        }),
        images: JSON.stringify(['/images/parks/zj1.jpg', '/images/parks/zj2.jpg']),
        status: 'PUBLISHED'
      },
      {
        name: '深圳高新技术产业园',
        description: '深圳市核心的高新技术产业聚集区，是中国改革开放的重要窗口',
        type: 'TECH',
        level: 'NATIONAL',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        address: '高新中一道9号',
        latitude: 22.5431,
        longitude: 113.9344,
        establishedYear: 1996,
        area: 11.5,
        industries: JSON.stringify(['电子信息', '生物技术', '新材料', '互联网']),
        policies: JSON.stringify(['创业资助', '房租补贴', '人才奖励', '上市奖励']),
        contact: JSON.stringify({
          phone: '0755-86576000',
          email: 'info@szhitech.org',
          website: 'http://www.szhitech.org'
        }),
        images: JSON.stringify(['/images/parks/sz1.jpg', '/images/parks/sz2.jpg']),
        status: 'PUBLISHED'
      },
      {
        name: '杭州未来科技城',
        description: '以信息经济为主导的科技新城，阿里巴巴等知名企业总部所在地',
        type: 'TECH',
        level: 'PROVINCIAL',
        province: '浙江省',
        city: '杭州市',
        district: '余杭区',
        address: '文一西路969号',
        latitude: 30.2741,
        longitude: 120.1551,
        establishedYear: 2011,
        area: 123.1,
        industries: JSON.stringify(['互联网', '人工智能', '大数据', '云计算']),
        policies: JSON.stringify(['最多跑一次', '人才专项政策', '产业扶持基金']),
        contact: JSON.stringify({
          phone: '0571-89898000',
          email: 'service@futuretech.gov.cn',
          website: 'http://www.futuretech.gov.cn'
        }),
        images: JSON.stringify(['/images/parks/hz1.jpg', '/images/parks/hz2.jpg']),
        status: 'PUBLISHED'
      },
      {
        name: '苏州工业园区',
        description: '中新合作开发的现代化工业园区，是对外开放的重要窗口',
        type: 'MANUFACTURING',
        level: 'NATIONAL',
        province: '江苏省',
        city: '苏州市',
        district: '工业园区',
        address: '苏州大道西9号',
        latitude: 31.3017,
        longitude: 120.6632,
        establishedYear: 1994,
        area: 278.0,
        industries: JSON.stringify(['电子信息', '精密机械', '生物医药', '纳米技术']),
        policies: JSON.stringify(['外资优惠政策', '出口退税', '研发补贴']),
        contact: JSON.stringify({
          phone: '0512-67571200',
          email: 'info@sipac.gov.cn',
          website: 'http://www.sipac.gov.cn'
        }),
        images: JSON.stringify(['/images/parks/sz_park1.jpg', '/images/parks/sz_park2.jpg']),
        status: 'PUBLISHED'
      }
    ];

    for (const parkData of parks) {
      await prisma.park.create({ data: parkData });
      console.log(`✓ 产业园区创建成功: ${parkData.name}`);
    }

    // 3. 创建政策法规数据
    console.log('\n=== 创建政策法规数据 ===');
    const policies = [
      {
        title: '关于进一步支持大学生创新创业的若干措施',
        content: `为深入贯彻落实党中央、国务院关于促进大学生创新创业的决策部署，进一步激发大学生创新创业活力，现提出以下措施：

一、加强创新创业教育
1. 完善创新创业课程体系，将创新创业教育纳入人才培养全过程
2. 建设一批创新创业教育示范课程和优质在线开放课程
3. 加强创新创业师资队伍建设，提高教师创新创业教育能力

二、优化创新创业环境
1. 建设大学生创新创业孵化基地，提供场地、资金、技术等支持
2. 简化大学生创业注册流程，实行"一站式"服务
3. 建立创新创业项目库，为大学生提供项目对接平台

三、强化政策支持
1. 设立大学生创新创业专项资金，每年安排不少于1000万元
2. 对大学生创业项目给予最高50万元的无息贷款支持
3. 实施税收优惠政策，创业3年内免征相关税费

四、完善服务体系
1. 建立大学生创新创业导师库，提供专业指导
2. 定期举办创新创业大赛和路演活动
3. 建立创新创业成果转化机制，促进产学研合作`,
        summary: '为支持大学生创新创业，从教育、环境、政策、服务四个方面提出具体措施',
        type: 'ENTREPRENEURSHIP',
        level: 'NATIONAL',
        publishDate: new Date('2024-01-15'),
        effectiveDate: new Date('2024-02-01'),
        tags: JSON.stringify(['大学生创业', '创新教育', '政策支持', '孵化基地']),
        keywords: JSON.stringify(['创新创业', '大学生', '政策支持', '资金扶持']),
        department: '教育部、人力资源社会保障部',
        attachments: JSON.stringify([
          { name: '实施细则.pdf', url: '/attachments/policy1_detail.pdf' },
          { name: '申请表格.doc', url: '/attachments/policy1_form.doc' }
        ]),
        viewCount: 1250,
        status: 'PUBLISHED'
      },
      {
        title: '高新技术企业认定管理办法',
        content: `为加强高新技术企业认定管理工作，根据《中华人民共和国企业所得税法》及其实施条例、《中华人民共和国税收征收管理法》及其实施细则等有关规定，制定本办法。

第一章 总则
第一条 为加强高新技术企业认定管理工作，规范高新技术企业认定行为，根据相关法律法规，制定本办法。

第二条 本办法所称高新技术企业，是指在《国家重点支持的高新技术领域》内，持续进行研究开发与技术成果转化，形成企业核心自主知识产权，并以此为基础开展经营活动的居民企业。

第二章 认定条件
第三条 企业申请认定高新技术企业应当同时满足以下条件：
（一）企业申请认定时须注册成立一年以上；
（二）企业通过自主研发、受让、受赠、并购等方式，获得对其主要产品（服务）在技术上发挥核心支持作用的知识产权的所有权；
（三）对企业主要产品（服务）发挥核心支持作用的技术属于《国家重点支持的高新技术领域》规定的范围；
（四）企业从事研发和相关技术创新活动的科技人员占企业当年职工总数的比例不低于10%；
（五）企业近三个会计年度的研究开发费用总额占同期销售收入总额的比例符合相关要求；
（六）近一年高新技术产品（服务）收入占企业同期总收入的比例不低于60%；
（七）企业创新能力评价应达到相应要求；
（八）企业申请认定前一年内未发生重大安全、重大质量事故或严重环境违法行为。

第三章 认定程序
第四条 企业申请高新技术企业认定应当按照以下程序进行：
（一）企业对照本办法进行自我评价；
（二）企业登录"高新技术企业认定管理工作网"，填写《高新技术企业认定申请书》；
（三）企业向认定机构提交认定申请材料；
（四）认定机构组织专家评审；
（五）认定机构审查并公示；
（六）颁发证书。`,
        summary: '规范高新技术企业认定管理工作，明确认定条件和程序',
        type: 'TECH',
        level: 'NATIONAL',
        publishDate: new Date('2024-01-10'),
        effectiveDate: new Date('2024-01-10'),
        tags: JSON.stringify(['高新技术企业', '认定管理', '税收优惠', '研发费用']),
        keywords: JSON.stringify(['高新技术', '企业认定', '管理办法', '税收优惠']),
        department: '科技部、财政部、国家税务总局',
        attachments: JSON.stringify([
          { name: '申请书模板.pdf', url: '/attachments/hitech_application.pdf' },
          { name: '评分标准.xlsx', url: '/attachments/hitech_scoring.xlsx' }
        ]),
        viewCount: 2100,
        status: 'PUBLISHED'
      },
      {
        title: '关于实施小微企业普惠性税收减免政策的通知',
        content: `为进一步支持小微企业发展，现就实施小微企业普惠性税收减免政策有关事项通知如下：

一、对月销售额10万元以下（含本数）的增值税小规模纳税人，免征增值税。

二、对小型微利企业年应纳税所得额不超过100万元的部分，减按25%计入应纳税所得额，按20%的税率缴纳企业所得税；对年应纳税所得额超过100万元但不超过300万元的部分，减按50%计入应纳税所得额，按20%的税率缴纳企业所得税。

三、由省、自治区、直辖市人民政府根据本地区实际情况，以及宏观调控需要确定，对增值税小规模纳税人可以在50%的税额幅度内减征资源税、城市维护建设税、房产税、城镇土地使用税、印花税（不含证券交易印花税）、耕地占用税和教育费附加、地方教育附加。

四、增值税小规模纳税人已依法享受资源税、城市维护建设税、房产税、城镇土地使用税、印花税、耕地占用税、教育费附加、地方教育附加其他优惠政策的，可叠加享受本通知第三条规定的优惠政策。

五、本通知执行期限为2019年1月1日至2021年12月31日。`,
        summary: '对小微企业实施普惠性税收减免政策，减轻企业负担',
        type: 'FINANCE',
        level: 'NATIONAL',
        publishDate: new Date('2024-01-05'),
        effectiveDate: new Date('2019-01-01'),
        expiryDate: new Date('2021-12-31'),
        tags: JSON.stringify(['小微企业', '税收减免', '普惠政策', '增值税']),
        keywords: JSON.stringify(['小微企业', '税收减免', '增值税', '企业所得税']),
        department: '财政部、国家税务总局',
        attachments: JSON.stringify([
          { name: '政策解读.pdf', url: '/attachments/sme_tax_policy.pdf' }
        ]),
        viewCount: 3200,
        status: 'PUBLISHED'
      },
      {
        title: '人才引进和培养专项资金管理办法',
        content: `第一章 总则
第一条 为规范人才引进和培养专项资金的使用管理，提高资金使用效益，根据国家有关法律法规和财务管理制度，结合实际情况，制定本办法。

第二条 人才引进和培养专项资金（以下简称专项资金）是指市财政预算安排的用于支持人才引进、培养、激励和服务的专项资金。

第三条 专项资金使用应当遵循公开透明、竞争择优、注重实效的原则。

第二章 支持范围和标准
第四条 专项资金主要用于以下方面：
（一）高层次人才引进资助；
（二）优秀人才培养资助；
（三）人才创新创业项目资助；
（四）人才服务平台建设；
（五）其他人才工作相关支出。

第五条 高层次人才引进资助标准：
（一）顶尖人才：给予500万元资助；
（二）领军人才：给予200万元资助；
（三）拔尖人才：给予100万元资助；
（四）高级人才：给予50万元资助。

第六条 优秀人才培养资助标准：
（一）博士后研究人员：每人每年10万元生活补贴；
（二）青年拔尖人才：每人50万元培养资助；
（三）技能大师：每人20万元工作室建设资助。

第三章 申请和审批
第七条 申请专项资金应当具备以下基本条件：
（一）符合本市人才政策规定；
（二）申请材料真实完整；
（三）无违法违纪行为；
（四）其他相关条件。

第八条 专项资金申请审批程序：
（一）申请人提交申请材料；
（二）主管部门初审；
（三）专家评审；
（四）公示；
（五）批准拨付。`,
        summary: '规范人才引进和培养专项资金的使用管理，明确支持范围和标准',
        type: 'TALENT',
        level: 'MUNICIPAL',
        publishDate: new Date('2024-01-20'),
        effectiveDate: new Date('2024-02-01'),
        tags: JSON.stringify(['人才引进', '专项资金', '培养资助', '管理办法']),
        keywords: JSON.stringify(['人才引进', '专项资金', '资助标准', '申请审批']),
        department: '市人力资源和社会保障局、市财政局',
        attachments: JSON.stringify([
          { name: '申请表格.doc', url: '/attachments/talent_application.doc' },
          { name: '资助标准详表.xlsx', url: '/attachments/talent_standards.xlsx' }
        ]),
        viewCount: 1800,
        status: 'PUBLISHED'
      },
      {
        title: '绿色发展专项行动计划',
        content: `为深入贯彻习近平生态文明思想，全面落实碳达峰碳中和重大战略决策，推动经济社会发展全面绿色转型，制定本行动计划。

一、总体要求
（一）指导思想
以习近平新时代中国特色社会主义思想为指导，完整、准确、全面贯彻新发展理念，构建新发展格局，推动高质量发展。

（二）主要目标
到2025年，绿色发展取得显著成效：
1. 单位GDP能耗比2020年下降13.5%
2. 单位GDP二氧化碳排放比2020年下降18%
3. 非化石能源消费比重达到20%左右
4. 森林覆盖率达到24.1%

二、重点任务
（一）推进产业结构优化升级
1. 坚决遏制高耗能高排放项目盲目发展
2. 大力发展战略性新兴产业
3. 加快传统产业绿色改造

（二）加快能源绿色低碳转型
1. 大力发展可再生能源
2. 深入推进煤炭清洁高效利用
3. 加快建设新型电力系统

（三）提升生态系统碳汇能力
1. 巩固提升森林碳汇
2. 提升草原湿地碳汇
3. 加强海洋生态系统碳汇

（四）推进绿色低碳技术创新
1. 强化绿色低碳技术攻关
2. 加快先进适用技术推广应用
3. 完善绿色技术创新体系

三、保障措施
（一）加强组织领导
（二）完善政策体系
（三）强化资金保障
（四）严格监督考核`,
        summary: '推动经济社会发展全面绿色转型，实现碳达峰碳中和目标',
        type: 'ENVIRONMENT',
        level: 'NATIONAL',
        publishDate: new Date('2024-01-25'),
        effectiveDate: new Date('2024-01-25'),
        tags: JSON.stringify(['绿色发展', '碳达峰', '碳中和', '生态文明']),
        keywords: JSON.stringify(['绿色发展', '碳达峰', '碳中和', '能源转型']),
        department: '国家发展改革委、生态环境部',
        attachments: JSON.stringify([
          { name: '实施方案.pdf', url: '/attachments/green_development_plan.pdf' },
          { name: '考核指标.xlsx', url: '/attachments/green_indicators.xlsx' }
        ]),
        viewCount: 2800,
        status: 'PUBLISHED'
      }
    ];

    for (const policyData of policies) {
      await prisma.policy.create({ data: policyData });
      console.log(`✓ 政策法规创建成功: ${policyData.title}`);
    }

    // 4. 创建创业项目数据
    console.log('\n=== 创建创业项目数据 ===');
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
      console.log(`✓ 创业项目创建成功: ${projectData.title}`);
    }

    // 5. 创建职位机会数据
    console.log('\n=== 创建职位机会数据 ===');
    const jobs = [
      {
        title: '高级前端开发工程师',
        company: '阿里巴巴集团',
        description: `岗位职责：
1. 负责公司核心产品的前端开发工作，参与产品架构设计和技术选型
2. 与产品经理、设计师、后端工程师协作，完成高质量的前端功能开发
3. 优化前端性能，提升用户体验，解决浏览器兼容性问题
4. 参与前端技术规范制定，推动团队技术能力提升
5. 关注前端技术发展趋势，引入新技术提升开发效率

任职要求：
1. 本科及以上学历，计算机相关专业
2. 3年以上前端开发经验，熟练掌握HTML5、CSS3、JavaScript
3. 精通React、Vue等主流前端框架，熟悉相关生态系统
4. 熟悉TypeScript、Webpack、Babel等前端工具链
5. 了解Node.js，有全栈开发经验者优先
6. 具备良好的代码规范意识和团队协作能力`,
        type: 'FULL_TIME',
        level: 'SENIOR',
        department: '技术部',
        location: '杭州市',
        salary: '25K-40K',
        benefits: JSON.stringify(['五险一金', '年终奖', '股票期权', '带薪年假', '免费班车', '健身房']),
        requirements: JSON.stringify(['本科以上学历', '3年以上经验', 'React/Vue精通', 'TypeScript熟练']),
        companySize: '10000+',
        industry: '互联网',
        publishDate: new Date('2024-01-20'),
        validUntil: new Date('2024-04-20'),
        contact: JSON.stringify({
          person: 'HR小王',
          phone: '0571-12345678',
          email: 'hr.wang@alibaba.com'
        }),
        viewCount: 1250,
        applicationCount: 45,
        status: 'PUBLISHED'
      },
      {
        title: 'Java后端开发工程师',
        company: '腾讯科技',
        description: `岗位职责：
1. 负责后端服务的设计、开发和维护，确保系统的稳定性和高可用性
2. 参与系统架构设计，制定技术方案，解决技术难题
3. 优化系统性能，提升服务响应速度和并发处理能力
4. 与前端、产品、测试团队协作，保证项目按时高质量交付
5. 参与代码审查，维护代码质量和技术文档

任职要求：
1. 本科及以上学历，计算机相关专业
2. 3年以上Java开发经验，熟练掌握Java核心技术
3. 熟悉Spring、Spring Boot、MyBatis等主流框架
4. 熟悉MySQL、Redis等数据库技术
5. 了解分布式系统设计，有微服务架构经验者优先
6. 具备良好的问题分析和解决能力`,
        type: 'FULL_TIME',
        level: 'MID',
        department: '后端开发部',
        location: '深圳市',
        salary: '20K-35K',
        benefits: JSON.stringify(['五险一金', '年终奖', '股票期权', '弹性工作', '技术培训', '团建活动']),
        requirements: JSON.stringify(['本科以上学历', '3年以上Java经验', 'Spring框架熟练', '数据库技能']),
        companySize: '10000+',
        industry: '互联网',
        publishDate: new Date('2024-01-18'),
        validUntil: new Date('2024-04-18'),
        contact: JSON.stringify({
          person: 'HR小李',
          phone: '0755-87654321',
          email: 'hr.li@tencent.com'
        }),
        viewCount: 980,
        applicationCount: 38,
        status: 'PUBLISHED'
      },
      {
        title: '产品经理',
        company: '字节跳动',
        description: `岗位职责：
1. 负责产品规划和需求分析，制定产品发展策略和路线图
2. 深入了解用户需求，进行市场调研和竞品分析
3. 协调技术、设计、运营等团队，推动产品功能的设计和实现
4. 跟踪产品数据，分析用户行为，持续优化产品体验
5. 参与产品运营活动，提升产品的用户活跃度和留存率

任职要求：
1. 本科及以上学历，不限专业，有相关工作经验
2. 2年以上产品经理经验，有移动互联网产品经验者优先
3. 具备优秀的逻辑思维能力和数据分析能力
4. 熟练使用Axure、Sketch等产品设计工具
5. 具备良好的沟通协调能力和项目管理能力
6. 对用户体验有深刻理解，关注行业发展趋势`,
        type: 'FULL_TIME',
        level: 'MID',
        department: '产品部',
        location: '北京市',
        salary: '22K-38K',
        benefits: JSON.stringify(['五险一金', '年终奖', '股票期权', '免费三餐', '健身房', '员工旅游']),
        requirements: JSON.stringify(['本科以上学历', '2年以上产品经验', '数据分析能力', '沟通协调能力']),
        companySize: '10000+',
        industry: '互联网',
        publishDate: new Date('2024-01-22'),
        validUntil: new Date('2024-04-22'),
        contact: JSON.stringify({
          person: 'HR小张',
          phone: '010-98765432',
          email: 'hr.zhang@bytedance.com'
        }),
        viewCount: 1100,
        applicationCount: 52,
        status: 'PUBLISHED'
      },
      {
        title: 'UI/UX设计师',
        company: '美团',
        description: `岗位职责：
1. 负责移动端和Web端产品的UI设计，制定设计规范和标准
2. 深入理解用户需求，进行用户体验研究和交互设计
3. 与产品经理、开发工程师协作，确保设计方案的有效实施
4. 参与产品原型设计和用户测试，持续优化产品体验
5. 关注设计趋势，提升团队设计水平和创新能力

任职要求：
1. 本科及以上学历，设计相关专业
2. 3年以上UI/UX设计经验，有移动互联网产品设计经验
3. 熟练使用Sketch、Figma、Adobe Creative Suite等设计工具
4. 具备良好的视觉设计能力和用户体验意识
5. 了解前端技术，能够与开发团队有效沟通
6. 具备创新思维和团队合作精神`,
        type: 'FULL_TIME',
        level: 'MID',
        department: '设计部',
        location: '北京市',
        salary: '18K-30K',
        benefits: JSON.stringify(['五险一金', '年终奖', '设计津贴', '弹性工作', '培训机会', '团队建设']),
        requirements: JSON.stringify(['本科以上学历', '3年以上设计经验', '设计工具熟练', '用户体验意识']),
        companySize: '10000+',
        industry: '互联网',
        publishDate: new Date('2024-01-25'),
        validUntil: new Date('2024-04-25'),
        contact: JSON.stringify({
          person: 'HR小刘',
          phone: '010-11223344',
          email: 'hr.liu@meituan.com'
        }),
        viewCount: 850,
        applicationCount: 28,
        status: 'PUBLISHED'
      },
      {
        title: '数据分析师',
        company: '滴滴出行',
        description: `岗位职责：
1. 负责业务数据的收集、清洗、分析和挖掘工作
2. 建立数据分析模型，为业务决策提供数据支持
3. 制作数据报表和可视化图表，定期输出分析报告
4. 与业务团队密切合作，深入理解业务需求
5. 参与数据产品的设计和优化，提升数据分析效率

任职要求：
1. 本科及以上学历，统计学、数学、计算机相关专业
2. 2年以上数据分析经验，有互联网行业经验者优先
3. 熟练使用SQL、Python/R等数据分析工具
4. 熟悉Tableau、PowerBI等数据可视化工具
5. 具备良好的逻辑思维能力和业务理解能力
6. 具备良好的沟通表达能力和团队协作精神`,
        type: 'FULL_TIME',
        level: 'MID',
        department: '数据部',
        location: '北京市',
        salary: '16K-28K',
        benefits: JSON.stringify(['五险一金', '年终奖', '技能津贴', '培训机会', '弹性工作', '员工活动']),
        requirements: JSON.stringify(['本科以上学历', '2年以上经验', 'SQL/Python熟练', '数据可视化能力']),
        companySize: '10000+',
        industry: '互联网',
        publishDate: new Date('2024-01-28'),
        validUntil: new Date('2024-04-28'),
        contact: JSON.stringify({
          person: 'HR小陈',
          phone: '010-55667788',
          email: 'hr.chen@didichuxing.com'
        }),
        viewCount: 720,
        applicationCount: 35,
        status: 'PUBLISHED'
      },
      {
        title: '运维工程师',
        company: '京东',
        description: `岗位职责：
1. 负责服务器、网络设备的日常维护和故障处理
2. 参与系统架构设计，制定运维方案和应急预案
3. 监控系统运行状态，及时发现和解决性能问题
4. 自动化运维工具的开发和维护，提升运维效率
5. 参与容量规划和成本优化，确保系统稳定运行

任职要求：
1. 本科及以上学历，计算机相关专业
2. 3年以上运维经验，熟悉Linux系统管理
3. 熟悉Docker、Kubernetes等容器化技术
4. 了解云计算平台（AWS、阿里云等）的使用
5. 熟悉监控工具（Prometheus、Grafana等）
6. 具备良好的问题排查能力和应急处理能力`,
        type: 'FULL_TIME',
        level: 'MID',
        department: '运维部',
        location: '北京市',
        salary: '18K-32K',
        benefits: JSON.stringify(['五险一金', '年终奖', '值班补贴', '技术培训', '健康体检', '团队活动']),
        requirements: JSON.stringify(['本科以上学历', '3年以上运维经验', 'Linux系统熟练', '容器化技术']),
        companySize: '10000+',
        industry: '电商',
        publishDate: new Date('2024-01-30'),
        validUntil: new Date('2024-04-30'),
        contact: JSON.stringify({
          person: 'HR小赵',
          phone: '010-99887766',
          email: 'hr.zhao@jd.com'
        }),
        viewCount: 650,
        applicationCount: 22,
        status: 'PUBLISHED'
      },
      {
        title: '算法工程师',
        company: '百度',
        description: `岗位职责：
1. 负责机器学习、深度学习算法的研究和开发
2. 参与推荐系统、搜索算法、自然语言处理等项目
3. 优化算法性能，提升模型准确率和效率
4. 与产品和工程团队协作，将算法落地到实际产品中
5. 跟踪前沿技术发展，探索新的算法和模型

任职要求：
1. 硕士及以上学历，计算机、数学、统计学相关专业
2. 3年以上算法开发经验，有深度学习项目经验
3. 熟练掌握Python、TensorFlow/PyTorch等工具
4. 具备扎实的数学基础和算法理论知识
5. 有大规模数据处理和分布式计算经验者优先
6. 具备良好的研究能力和创新思维`,
        type: 'FULL_TIME',
        level: 'SENIOR',
        department: 'AI研究院',
        location: '北京市',
        salary: '30K-50K',
        benefits: JSON.stringify(['五险一金', '年终奖', '股票期权', '研究津贴', '学术会议', '技术培训']),
        requirements: JSON.stringify(['硕士以上学历', '3年以上算法经验', '深度学习熟练', '数学基础扎实']),
        companySize: '10000+',
        industry: '互联网',
        publishDate: new Date('2024-02-01'),
        validUntil: new Date('2024-05-01'),
        contact: JSON.stringify({
          person: 'HR小孙',
          phone: '010-12121212',
          email: 'hr.sun@baidu.com'
        }),
        viewCount: 1350,
        applicationCount: 18,
        status: 'PUBLISHED'
      },
      {
        title: '市场营销专员',
        company: '小米科技',
        description: `岗位职责：
1. 负责品牌推广活动的策划和执行，提升品牌知名度
2. 管理社交媒体账号，制作营销内容，与用户互动
3. 分析市场趋势和竞品动态，制定营销策略
4. 协调内外部资源，推进营销项目的实施
5. 跟踪营销效果，分析数据并优化营销方案

任职要求：
1. 本科及以上学历，市场营销、广告学相关专业
2. 1-3年市场营销经验，有消费电子行业经验者优先
3. 熟悉数字营销工具和社交媒体运营
4. 具备良好的文案写作能力和创意思维
5. 熟练使用Office办公软件和数据分析工具
6. 具备良好的沟通能力和执行力`,
        type: 'FULL_TIME',
        level: 'JUNIOR',
        department: '市场部',
        location: '北京市',
        salary: '12K-20K',
        benefits: JSON.stringify(['五险一金', '年终奖', '员工购机优惠', '弹性工作', '培训机会', '团队建设']),
        requirements: JSON.stringify(['本科以上学历', '1-3年营销经验', '数字营销熟悉', '文案写作能力']),
        companySize: '10000+',
        industry: '消费电子',
        publishDate: new Date('2024-02-03'),
        validUntil: new Date('2024-05-03'),
        contact: JSON.stringify({
          person: 'HR小周',
          phone: '010-34343434',
          email: 'hr.zhou@xiaomi.com'
        }),
        viewCount: 580,
        applicationCount: 42,
        status: 'PUBLISHED'
      }
    ];

    for (const jobData of jobs) {
      await prisma.jobOpportunity.create({ data: jobData });
      console.log(`✓ 职位机会创建成功: ${jobData.title} - ${jobData.company}`);
    }

    // 6. 创建指南数据
    console.log('\n=== 创建指南数据 ===');
    const guides = [
      {
        category: 'STARTUP',
        title: '创业项目申报指南',
        content: `# 创业项目申报指南

## 申报条件
1. 申请人为在校大学生或毕业5年内的高校毕业生
2. 项目具有创新性和可行性
3. 团队结构合理，核心成员不少于3人
4. 项目符合国家产业政策导向

## 申报材料
1. 项目申报书
2. 商业计划书
3. 团队成员简历
4. 相关证明材料

## 申报流程
1. 在线填写申报表
2. 上传申报材料
3. 初审筛选
4. 专家评审
5. 公示结果
6. 签约立项

## 注意事项
- 申报材料必须真实有效
- 项目描述要详细具体
- 财务预算要合理可行`,
        steps: JSON.stringify([
          '准备申报材料',
          '在线提交申请',
          '等待初审结果',
          '参加专家评审',
          '查看公示结果',
          '签约立项'
        ]),
        order: 1,
        enabled: true
      },
      {
        category: 'JOB',
        title: '求职申请指南',
        content: `# 求职申请指南

## 申请准备
1. 完善个人简历信息
2. 准备相关证明材料
3. 了解目标企业和职位
4. 准备面试常见问题

## 申请流程
1. 浏览职位信息
2. 选择合适职位
3. 在线提交申请
4. 等待企业回复
5. 参加面试
6. 签订劳动合同

## 简历制作要点
- 信息真实完整
- 突出个人优势
- 匹配职位要求
- 格式清晰美观

## 面试技巧
- 提前了解企业文化
- 准备自我介绍
- 展示专业能力
- 保持自信态度`,
        steps: JSON.stringify([
          '完善个人简历',
          '搜索目标职位',
          '提交求职申请',
          '准备面试材料',
          '参加面试',
          '签订合同'
        ]),
        order: 2,
        enabled: true
      },
      {
        category: 'POLICY',
        title: '政策申请指南',
        content: `# 政策申请指南

## 政策类型
1. 创业扶持政策
2. 人才引进政策
3. 税收优惠政策
4. 资金补贴政策

## 申请条件
- 符合政策适用范围
- 满足基本申请条件
- 提供完整申请材料
- 无违法违规记录

## 申请流程
1. 查看政策详情
2. 确认申请条件
3. 准备申请材料
4. 提交申请
5. 等待审核
6. 获得政策支持

## 常见问题
- 如何查看政策详情？
- 申请材料有哪些？
- 审核周期多长？
- 如何查询申请进度？`,
        steps: JSON.stringify([
          '了解政策内容',
          '确认申请资格',
          '准备申请材料',
          '提交政策申请',
          '配合审核工作',
          '享受政策支持'
        ]),
        order: 3,
        enabled: true
      },
      {
        category: 'PARK',
        title: '园区入驻指南',
        content: `# 园区入驻指南

## 入驻条件
1. 企业注册资本符合要求
2. 经营范围符合园区定位
3. 具备相应的技术实力
4. 无不良信用记录

## 入驻优势
- 优惠的租金政策
- 完善的配套设施
- 专业的服务团队
- 良好的产业生态

## 申请流程
1. 了解园区信息
2. 提交入驻申请
3. 园区实地考察
4. 签订入驻协议
5. 办理入驻手续
6. 正式入驻运营

## 服务支持
- 政策咨询服务
- 融资对接服务
- 人才招聘服务
- 市场推广服务`,
        steps: JSON.stringify([
          '选择目标园区',
          '提交入驻申请',
          '实地考察园区',
          '签订入驻协议',
          '办理相关手续',
          '正式入驻运营'
        ]),
        order: 4,
        enabled: true
      }
    ];

    for (const guideData of guides) {
      await prisma.guide.create({ data: guideData });
      console.log(`✓ 指南创建成功: ${guideData.title}`);
    }

    // 7. 创建FAQ数据
    console.log('\n=== 创建FAQ数据 ===');
    const faqs = [
      {
        category: 'STARTUP',
        question: '如何申请创业项目资助？',
        answer: '申请创业项目资助需要满足以下条件：1）申请人为在校大学生或毕业5年内的高校毕业生；2）项目具有创新性和市场前景；3）团队结构合理。申请流程包括在线提交申报材料、专家评审、公示等环节。',
        order: 1,
        enabled: true,
        views: 450
      },
      {
        category: 'STARTUP',
        question: '创业项目资助金额是多少？',
        answer: '创业项目资助金额根据项目类型和评审等级确定：优秀项目可获得50-200万元资助，良好项目可获得20-50万元资助，一般项目可获得5-20万元资助。具体金额以评审结果为准。',
        order: 2,
        enabled: true,
        views: 380
      },
      {
        category: 'JOB',
        question: '如何提高求职成功率？',
        answer: '提高求职成功率的关键在于：1）完善个人简历，突出专业技能和项目经验；2）深入了解目标企业和职位要求；3）准备充分的面试材料；4）保持积极的求职态度；5）持续提升专业技能。',
        order: 3,
        enabled: true,
        views: 520
      },
      {
        category: 'JOB',
        question: '简历应该包含哪些内容？',
        answer: '完整的简历应包含：1）基本信息（姓名、联系方式、教育背景）；2）工作经历和项目经验；3）专业技能和证书；4）个人优势和特长；5）求职意向。简历要真实、简洁、重点突出。',
        order: 4,
        enabled: true,
        views: 680
      },
      {
        category: 'POLICY',
        question: '有哪些创业扶持政策？',
        answer: '主要的创业扶持政策包括：1）创业资金支持（无息贷款、创业补贴）；2）税收优惠政策；3）场地租金减免；4）创业培训和指导；5）人才引进政策；6）知识产权保护支持等。',
        order: 5,
        enabled: true,
        views: 720
      },
      {
        category: 'POLICY',
        question: '如何申请税收优惠政策？',
        answer: '申请税收优惠政策需要：1）确认企业是否符合优惠条件；2）准备相关申请材料；3）向税务部门提交申请；4）配合税务部门审核；5）获得优惠资格认定。建议咨询专业税务顾问。',
        order: 6,
        enabled: true,
        views: 590
      },
      {
        category: 'PARK',
        question: '入驻产业园区有什么优势？',
        answer: '入驻产业园区的优势包括：1）享受优惠的租金和税收政策；2）完善的基础设施和配套服务；3）良好的产业生态和合作机会；4）专业的管理和服务团队；5）便利的融资和人才服务。',
        order: 7,
        enabled: true,
        views: 420
      },
      {
        category: 'PARK',
        question: '园区入驻费用如何计算？',
        answer: '园区入驻费用通常包括：1）租金费用（根据面积和位置确定）；2）物业管理费；3）公共设施使用费；4）其他服务费用。具体费用标准因园区而异，建议直接咨询目标园区。',
        order: 8,
        enabled: true,
        views: 350
      },
      {
        category: 'GENERAL',
        question: '如何联系客服？',
        answer: '您可以通过以下方式联系我们：1）客服热线：400-123-4567（工作日9:00-18:00）；2）在线客服：网站右下角聊天窗口；3）邮箱：service@xiaoyao.com；4）微信公众号：逍遥人才网。',
        order: 9,
        enabled: true,
        views: 280
      },
      {
        category: 'GENERAL',
        question: '忘记密码怎么办？',
        answer: '忘记密码可以通过以下方式找回：1）点击登录页面的"忘记密码"链接；2）输入注册邮箱或手机号；3）接收验证码；4）设置新密码。如仍有问题，请联系客服协助处理。',
        order: 10,
        enabled: true,
        views: 320
      }
    ];

    for (const faqData of faqs) {
      await prisma.fAQ.create({ data: faqData });
      console.log(`✓ FAQ创建成功: ${faqData.question}`);
    }

    // 8. 创建联系信息数据
    console.log('\n=== 创建联系信息数据 ===');
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

    // 9. 创建用户评价数据
    console.log('\n=== 创建用户评价数据 ===');
    const testimonials = [
      {
        name: '张创业者',
        role: '科技创业公司CEO',
        avatar: '/avatars/zhang.jpg',
        content: '通过逍遥人才网，我成功申请到了50万元的创业资助，并且在平台上找到了优秀的技术合伙人。平台的服务非常专业，政策信息及时准确，为我们创业提供了很大帮助。',
        rating: 5,
        order: 1,
        enabled: true
      },
      {
        name: '李工程师',
        role: '高级前端开发工程师',
        avatar: '/avatars/li.jpg',
        content: '在逍遥人才网找到了心仪的工作，整个求职过程很顺利。平台上的职位信息真实可靠，企业回复及时。特别是简历管理功能很实用，让我能够更好地展示自己的技能和经验。',
        rating: 5,
        order: 2,
        enabled: true
      },
      {
        name: '王产品经理',
        role: '互联网产品经理',
        avatar: '/avatars/wang.jpg',
        content: '作为产品经理，我经常需要了解最新的行业政策和市场动态。逍遥人才网的政策法规板块内容丰富，更新及时，为我的工作提供了很好的参考。',
        rating: 4,
        order: 3,
        enabled: true
      },
      {
        name: '陈企业家',
        role: '制造业企业董事长',
        avatar: '/avatars/chen.jpg',
        content: '我们公司通过逍遥人才网入驻了高新技术产业园区，享受到了很多优惠政策。园区的配套设施完善，服务团队专业，为企业发展提供了良好的环境。',
        rating: 5,
        order: 4,
        enabled: true
      },
      {
        name: '刘设计师',
        role: 'UI/UX设计师',
        avatar: '/avatars/liu.jpg',
        content: '平台的用户体验很好，界面设计简洁美观，功能操作便捷。作为设计师，我很欣赏这样的产品设计。在这里不仅找到了工作，还学到了很多职场经验。',
        rating: 4,
        order: 5,
        enabled: true
      }
    ];

    for (const testimonialData of testimonials) {
      await prisma.testimonial.create({ data: testimonialData });
      console.log(`✓ 用户评价创建成功: ${testimonialData.name}`);
    }

    console.log('\n✅ 所有板块种子数据填充完成！');
    console.log('\n📊 数据统计：');
    console.log(`- 用户数据: ${users.length} 条`);
    console.log(`- 产业园区: ${parks.length} 条`);
    console.log(`- 政策法规: ${policies.length} 条`);
    console.log(`- 创业项目: ${projects.length} 条`);
    console.log(`- 职位机会: ${jobs.length} 条`);
    console.log(`- 使用指南: ${guides.length} 条`);
    console.log(`- 常见问题: ${faqs.length} 条`);
    console.log(`- 联系信息: ${contacts.length} 条`);
    console.log(`- 用户评价: ${testimonials.length} 条`);

    console.log('\n🎯 测试账户信息：');
    console.log('管理员账户: admin@xiaoyao.com / admin123');
    console.log('测试用户1: user1@test.com / 123456 (张三)');
    console.log('测试用户2: user2@test.com / 123456 (李四)');
    console.log('测试用户3: user3@test.com / 123456 (王五)');
    console.log('测试用户4: user4@test.com / 123456 (赵六)');

  } catch (error) {
    console.error('❌ 种子数据填充失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAllData();