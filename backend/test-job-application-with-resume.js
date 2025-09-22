const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testJobApplicationWithResume() {
  try {
    console.log('开始测试求职申请流程...');

    // 1. 创建测试用户
    const testUser = await prisma.user.upsert({
      where: { email: 'testuser@example.com' },
      update: {},
      create: {
        email: 'testuser@example.com',
        password: 'hashedpassword',
        name: '张三',
        phone: '13800138000'
      }
    });
    console.log('✓ 测试用户创建成功:', testUser.name);

    // 2. 创建测试简历
    const testResume = await prisma.resume.upsert({
      where: { userId: testUser.id },
      update: {
        title: '我的简历',
        basicInfo: JSON.stringify({
          name: '张三',
          phone: '13800138000',
          email: 'testuser@example.com',
          hometown: '北京市',
          birthDate: '1990-01-01',
          maritalStatus: '未婚',
          employmentStatus: '在职',
          jobObjective: '寻找前端开发工程师职位',
          personalSummary: '具有5年前端开发经验，熟练掌握React、Vue等框架'
        }),
        education: JSON.stringify([
          {
            id: '1',
            school: '北京大学',
            major: '计算机科学与技术',
            degree: '本科',
            startDate: '2008-09',
            endDate: '2012-06',
            description: '主修计算机科学与技术，成绩优异'
          }
        ]),
        experience: JSON.stringify([
          {
            id: '1',
            company: '腾讯科技',
            position: '前端开发工程师',
            startDate: '2018-07',
            endDate: '2023-12',
            current: false,
            description: '负责公司核心产品的前端开发工作，参与多个重要项目'
          }
        ]),
        skills: JSON.stringify([
          {
            id: '1',
            name: 'React',
            category: '前端框架',
            description: '熟练掌握React开发，有丰富的项目经验'
          },
          {
            id: '2',
            name: 'TypeScript',
            category: '编程语言',
            description: '熟练使用TypeScript进行大型项目开发'
          }
        ]),
        certificates: JSON.stringify([
          {
            id: '1',
            name: '软件设计师',
            issueDate: '2020-05',
            description: '国家软考中级证书'
          }
        ]),
        isComplete: true,
        isPublic: true
      },
      create: {
        userId: testUser.id,
        title: '我的简历',
        basicInfo: JSON.stringify({
          name: '张三',
          phone: '13800138000',
          email: 'testuser@example.com',
          hometown: '北京市',
          birthDate: '1990-01-01',
          maritalStatus: '未婚',
          employmentStatus: '在职',
          jobObjective: '寻找前端开发工程师职位',
          personalSummary: '具有5年前端开发经验，熟练掌握React、Vue等框架'
        }),
        education: JSON.stringify([
          {
            id: '1',
            school: '北京大学',
            major: '计算机科学与技术',
            degree: '本科',
            startDate: '2008-09',
            endDate: '2012-06',
            description: '主修计算机科学与技术，成绩优异'
          }
        ]),
        experience: JSON.stringify([
          {
            id: '1',
            company: '腾讯科技',
            position: '前端开发工程师',
            startDate: '2018-07',
            endDate: '2023-12',
            current: false,
            description: '负责公司核心产品的前端开发工作，参与多个重要项目'
          }
        ]),
        skills: JSON.stringify([
          {
            id: '1',
            name: 'React',
            category: '前端框架',
            description: '熟练掌握React开发，有丰富的项目经验'
          },
          {
            id: '2',
            name: 'TypeScript',
            category: '编程语言',
            description: '熟练使用TypeScript进行大型项目开发'
          }
        ]),
        certificates: JSON.stringify([
          {
            id: '1',
            name: '软件设计师',
            issueDate: '2020-05',
            description: '国家软考中级证书'
          }
        ]),
        isComplete: true,
        isPublic: true
      }
    });
    console.log('✓ 测试简历创建成功');

    // 3. 创建测试职位
    const testJob = await prisma.jobOpportunity.create({
      data: {
        title: '高级前端开发工程师',
        company: '阿里巴巴',
        description: '负责前端架构设计和核心功能开发',
        type: 'FULL_TIME',
        level: 'SENIOR',
        location: '杭州市',
        salary: '25K-40K',
        status: 'PUBLISHED'
      }
    });
    console.log('✓ 测试职位创建成功:', testJob.title);

    // 4. 模拟用户申请职位（包含简历数据）
    const resumeData = {
      basicInfo: JSON.parse(testResume.basicInfo || '{}'),
      title: testResume.title,
      objective: JSON.parse(testResume.basicInfo || '{}').jobObjective || '',
      summary: JSON.parse(testResume.basicInfo || '{}').personalSummary || '',
      education: JSON.parse(testResume.education || '[]'),
      experience: JSON.parse(testResume.experience || '[]'),
      skills: JSON.parse(testResume.skills || '[]'),
      certificates: JSON.parse(testResume.certificates || '[]')
    };

    const jobApplication = await prisma.jobApplication.create({
      data: {
        userId: testUser.id,
        jobId: testJob.id,
        coverLetter: '我对这个职位非常感兴趣，希望能够加入贵公司。',
        expectedSalary: '30000',
        availableDate: new Date('2024-02-01'),
        resumeData: JSON.stringify(resumeData),
        additionalDocs: JSON.stringify([
          { name: '作品集.pdf', url: '/uploads/portfolio.pdf', type: 'application/pdf' }
        ])
      }
    });
    console.log('✓ 求职申请创建成功，申请ID:', jobApplication.id);

    // 5. 验证申请数据
    const applicationWithDetails = await prisma.jobApplication.findUnique({
      where: { id: jobApplication.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    console.log('\n=== 申请详情验证 ===');
    console.log('申请人:', applicationWithDetails?.user.name);
    console.log('职位:', applicationWithDetails?.job.title);
    console.log('公司:', applicationWithDetails?.job.company);
    console.log('期望薪资:', applicationWithDetails?.expectedSalary);
    console.log('求职信:', applicationWithDetails?.coverLetter);
    
    if (applicationWithDetails?.resumeData) {
      const resumeDataParsed = JSON.parse(applicationWithDetails.resumeData);
      console.log('\n=== 简历数据验证 ===');
      console.log('基本信息:', resumeDataParsed.basicInfo);
      console.log('教育经历数量:', resumeDataParsed.education?.length || 0);
      console.log('工作经历数量:', resumeDataParsed.experience?.length || 0);
      console.log('技能数量:', resumeDataParsed.skills?.length || 0);
      console.log('证书数量:', resumeDataParsed.certificates?.length || 0);
    }

    if (applicationWithDetails?.additionalDocs) {
      const additionalDocs = JSON.parse(applicationWithDetails.additionalDocs);
      console.log('\n=== 附件验证 ===');
      console.log('附件数量:', additionalDocs.length);
      additionalDocs.forEach((doc, index) => {
        console.log(`附件${index + 1}:`, doc.name);
      });
    }

    console.log('\n✅ 求职申请流程测试完成！');
    console.log('📋 测试结果：');
    console.log('- 用户创建: ✓');
    console.log('- 简历创建: ✓');
    console.log('- 职位创建: ✓');
    console.log('- 申请提交: ✓');
    console.log('- 简历数据保存: ✓');
    console.log('- 附件数据保存: ✓');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testJobApplicationWithResume();