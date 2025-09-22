import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initContentData() {
  try {
    console.log('开始初始化内容数据...');

    // 清空现有数据
    await prisma.guide.deleteMany();
    await prisma.fAQ.deleteMany();
    await prisma.contactInfo.deleteMany();

    // 初始化使用指南数据
    const guides = [
      {
        category: 'register',
        title: '新用户注册指南',
        content: '详细的用户注册流程说明，包括注册步骤、注意事项等。',
        steps: JSON.stringify([
          '点击页面右上角"立即注册"按钮',
          '填写手机号码并获取验证码',
          '设置登录密码（8-20位，包含字母和数字）',
          '完善个人基本信息',
          '上传身份证明文件（可选）',
          '提交注册申请，等待审核'
        ]),
        order: 1,
        enabled: true
      },
      {
        category: 'park',
        title: '园区服务使用指南',
        content: '如何使用园区服务的详细说明，包括申请流程、审核标准等。',
        steps: JSON.stringify([
          '登录后进入"园区服务"页面',
          '浏览各园区的详细信息和优惠政策',
          '根据行业类型和地理位置筛选合适园区',
          '点击"申请入驻"提交入驻申请',
          '上传企业相关资质文件',
          '等待园区方审核并安排实地考察'
        ]),
        order: 2,
        enabled: true
      },
      {
        category: 'policy',
        title: '政策咨询指南',
        content: '政策查询和申请的详细流程说明。',
        steps: JSON.stringify([
          '访问"政策咨询"页面查看最新政策',
          '使用搜索功能查找特定政策类型',
          '点击政策标题查看详细内容',
          '如有疑问可点击"在线咨询"',
          '填写咨询表单并提交',
          '专业顾问将在24小时内回复'
        ]),
        order: 3,
        enabled: true
      },
      {
        category: 'project',
        title: '项目申报指南',
        content: '项目孵化申请的详细流程说明。',
        steps: JSON.stringify([
          '进入"项目孵化"页面浏览项目信息',
          '选择符合条件的项目类型',
          '仔细阅读项目申报要求',
          '准备相关申报材料',
          '在线填写申报表单',
          '上传支撑材料并提交申请'
        ]),
        order: 4,
        enabled: true
      }
    ];

    for (const guide of guides) {
      await prisma.guide.create({ data: guide });
    }

    // 初始化FAQ数据
    const faqs = [
      {
        category: 'account',
        question: '如何注册逍遥人才网账户？',
        answer: '您可以点击页面右上角的"立即注册"按钮，填写手机号码获取验证码，设置密码后完善个人信息即可完成注册。注册过程简单快捷，通常只需要3-5分钟。',
        order: 1,
        enabled: true,
        views: 1250
      },
      {
        category: 'account',
        question: '忘记密码怎么办？',
        answer: '在登录页面点击"忘记密码"，输入注册时的手机号码，系统会发送验证码到您的手机，验证成功后可以重新设置密码。',
        order: 2,
        enabled: true,
        views: 890
      },
      {
        category: 'account',
        question: '如何修改个人信息？',
        answer: '登录后进入"个人中心"，点击"编辑资料"即可修改姓名、联系方式、工作经历等个人信息。修改后需要重新审核，通常1-2个工作日完成。',
        order: 3,
        enabled: true,
        views: 650
      },
      {
        category: 'park',
        question: '如何申请入驻园区？',
        answer: '浏览园区列表，选择合适的园区后点击"申请入驻"，填写企业基本信息、业务范围、预期入驻时间等，上传相关资质文件后提交申请。园区方会在5个工作日内回复。',
        order: 4,
        enabled: true,
        views: 890
      },
      {
        category: 'park',
        question: '园区入驻有什么条件？',
        answer: '不同园区的入驻条件不同，一般要求：1）企业注册资本达到一定标准；2）符合园区产业定位；3）具备相应的技术实力或市场前景；4）无不良信用记录。具体条件请查看各园区详情页面。',
        order: 5,
        enabled: true,
        views: 720
      },
      {
        category: 'park',
        question: '园区服务费用如何收取？',
        answer: '园区服务费用包括：租金、物业费、服务费等。具体标准因园区而异，部分园区对初创企业有优惠政策。详细费用信息请咨询具体园区或联系我们的客服。',
        order: 6,
        enabled: true,
        views: 560
      },
      {
        category: 'policy',
        question: '如何查询最新的人才政策？',
        answer: '进入"政策咨询"页面，可以按地区、政策类型、发布时间等条件筛选查看最新政策。我们会及时更新各地的人才引进、创业扶持、税收优惠等政策信息。',
        order: 7,
        enabled: true,
        views: 980
      },
      {
        category: 'policy',
        question: '政策申请需要什么材料？',
        answer: '不同政策需要的材料不同，一般包括：身份证明、学历证明、工作证明、企业营业执照、项目计划书等。具体材料清单请查看各政策的详细说明。',
        order: 8,
        enabled: true,
        views: 650
      },
      {
        category: 'policy',
        question: '政策申请多久能有结果？',
        answer: '政策申请的审核周期因政策类型而异，一般为15-30个工作日。我们会及时跟进申请进度，并通过短信、邮件等方式通知您审核结果。',
        order: 9,
        enabled: true,
        views: 430
      },
      {
        category: 'project',
        question: '什么样的项目可以申请孵化？',
        answer: '我们主要孵化科技创新类项目，包括：人工智能、大数据、物联网、生物医药、新材料、新能源等领域。项目应具有一定的技术含量和市场前景。',
        order: 10,
        enabled: true,
        views: 780
      },
      {
        category: 'project',
        question: '项目孵化提供哪些服务？',
        answer: '项目孵化服务包括：办公场地、资金支持、技术指导、市场推广、法律咨询、财务管理、人才招聘等全方位服务。具体服务内容根据项目需求定制。',
        order: 11,
        enabled: true,
        views: 620
      },
      {
        category: 'project',
        question: '项目孵化的成功率如何？',
        answer: '我们的项目孵化成功率约为70%，远高于行业平均水平。成功的关键在于：项目筛选严格、导师团队专业、服务体系完善、资源整合能力强。',
        order: 12,
        enabled: true,
        views: 540
      },
      {
        category: 'payment',
        question: '平台服务是否收费？',
        answer: '基础的信息浏览、政策查询等服务免费。部分增值服务如专业咨询、项目孵化、定制服务等会收取相应费用。具体收费标准请咨询客服。',
        order: 13,
        enabled: true,
        views: 890
      },
      {
        category: 'payment',
        question: '支持哪些付款方式？',
        answer: '我们支持多种付款方式：支付宝、微信支付、银行转账、企业对公转账等。大额付款建议使用银行转账，安全可靠。',
        order: 14,
        enabled: true,
        views: 340
      },
      {
        category: 'payment',
        question: '如何申请退款？',
        answer: '如需退款，请联系客服说明原因。符合退款条件的，我们会在3-5个工作日内处理。退款将原路返回到您的付款账户。',
        order: 15,
        enabled: true,
        views: 280
      }
    ];

    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq });
    }

    // 初始化联系信息数据
    const contactInfos = [
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
        content: '北京市海淀区中关村科技园',
        description: '欢迎预约实地参观',
        order: 3,
        enabled: true
      },
      {
        type: 'hours',
        title: '工作时间',
        content: '周一至周五 9:00-18:00',
        description: '节假日客服值班',
        order: 4,
        enabled: true
      }
    ];

    for (const contactInfo of contactInfos) {
      await prisma.contactInfo.create({ data: contactInfo });
    }

    console.log('内容数据初始化完成！');
    console.log(`- 创建了 ${guides.length} 条使用指南`);
    console.log(`- 创建了 ${faqs.length} 条常见问题`);
    console.log(`- 创建了 ${contactInfos.length} 条联系信息`);

  } catch (error) {
    console.error('初始化内容数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initContentData();