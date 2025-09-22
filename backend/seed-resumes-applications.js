const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedResumesAndApplications() {
  console.log('开始填充简历和申请记录数据...\n');

  try {
    // 获取用户数据
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['user1@test.com', 'user2@test.com', 'user3@test.com', 'user4@test.com']
        }
      }
    });

    // 获取职位和项目数据
    const jobs = await prisma.job.findMany();
    const projects = await prisma.project.findMany();

    console.log('=== 创建用户简历数据 ===');

    // 为每个用户创建简历
    const resumeData = [
      {
        userId: users[0].id, // 张三
        basicInfo: JSON.stringify({
          name: '张三',
          gender: '男',
          age: 28,
          phone: '13800138001',
          email: 'user1@test.com',
          address: '北京市朝阳区'
        }),
        jobIntention: JSON.stringify({
          position: '前端开发工程师',
          industry: 'IT互联网',
          salary: '15000-25000',
          workLocation: '北京',
          workType: '全职'
        }),
        personalSummary: '5年前端开发经验，熟练掌握React、Vue等主流框架，具有丰富的移动端和PC端开发经验。',
        education: JSON.stringify([
          {
            school: '北京理工大学',
            major: '计算机科学与技术',
            degree: '本科',
            startDate: '2016-09',
            endDate: '2020-06',
            description: '主修计算机科学与技术，GPA 3.8/4.0'
          }
        ]),
        workExperience: JSON.stringify([
          {
            company: '字节跳动',
            position: '前端开发工程师',
            startDate: '2020-07',
            endDate: '2023-12',
            description: '负责今日头条Web端开发，参与多个核心功能模块的设计与实现'
          },
          {
            company: '美团',
            position: '初级前端工程师',
            startDate: '2020-03',
            endDate: '2020-06',
            description: '实习期间参与美团外卖前端页面开发'
          }
        ]),
        skills: JSON.stringify([
          { name: 'JavaScript', level: '精通' },
          { name: 'React', level: '精通' },
          { name: 'Vue.js', level: '熟练' },
          { name: 'TypeScript', level: '熟练' },
          { name: 'Node.js', level: '了解' }
        ]),
        certificates: JSON.stringify([
          {
            name: '软件设计师',
            issuer: '工信部',
            date: '2021-05',
            description: '中级软件设计师资格证书'
          }
        ])
      },
      {
        userId: users[1].id, // 李四
        basicInfo: JSON.stringify({
          name: '李四',
          gender: '女',
          age: 26,
          phone: '13800138002',
          email: 'user2@test.com',
          address: '上海市浦东新区'
        }),
        jobIntention: JSON.stringify({
          position: 'Java后端开发工程师',
          industry: 'IT互联网',
          salary: '12000-20000',
          workLocation: '上海',
          workType: '全职'
        }),
        personalSummary: '3年Java后端开发经验，熟悉Spring Boot、微服务架构，有大型项目开发经验。',
        education: JSON.stringify([
          {
            school: '上海交通大学',
            major: '软件工程',
            degree: '硕士',
            startDate: '2019-09',
            endDate: '2022-06',
            description: '软件工程专业，研究方向为分布式系统'
          }
        ]),
        workExperience: JSON.stringify([
          {
            company: '阿里巴巴',
            position: 'Java开发工程师',
            startDate: '2022-07',
            endDate: '至今',
            description: '负责淘宝后端服务开发，参与高并发系统设计'
          }
        ]),
        skills: JSON.stringify([
          { name: 'Java', level: '精通' },
          { name: 'Spring Boot', level: '精通' },
          { name: 'MySQL', level: '熟练' },
          { name: 'Redis', level: '熟练' },
          { name: 'Docker', level: '了解' }
        ]),
        certificates: JSON.stringify([
          {
            name: 'Oracle认证Java程序员',
            issuer: 'Oracle',
            date: '2022-03',
            description: 'OCP Java SE 11 Developer'
          }
        ])
      },
      {
        userId: users[2].id, // 王五
        basicInfo: JSON.stringify({
          name: '王五',
          gender: '男',
          age: 30,
          phone: '13800138003',
          email: 'user3@test.com',
          address: '深圳市南山区'
        }),
        jobIntention: JSON.stringify({
          position: '产品经理',
          industry: 'IT互联网',
          salary: '20000-30000',
          workLocation: '深圳',
          workType: '全职'
        }),
        personalSummary: '6年产品经验，擅长用户体验设计和数据分析，成功主导过多个千万级用户产品。',
        education: JSON.stringify([
          {
            school: '清华大学',
            major: '工商管理',
            degree: '硕士',
            startDate: '2016-09',
            endDate: '2018-06',
            description: 'MBA工商管理硕士'
          }
        ]),
        workExperience: JSON.stringify([
          {
            company: '腾讯',
            position: '高级产品经理',
            startDate: '2020-01',
            endDate: '至今',
            description: '负责微信小程序产品规划，用户量增长200%'
          },
          {
            company: '百度',
            position: '产品经理',
            startDate: '2018-07',
            endDate: '2019-12',
            description: '负责百度地图功能优化，提升用户满意度'
          }
        ]),
        skills: JSON.stringify([
          { name: '产品设计', level: '精通' },
          { name: '用户研究', level: '精通' },
          { name: '数据分析', level: '熟练' },
          { name: 'Axure', level: '熟练' },
          { name: 'Figma', level: '熟练' }
        ]),
        certificates: JSON.stringify([
          {
            name: 'PMP项目管理',
            issuer: 'PMI',
            date: '2020-08',
            description: '项目管理专业人士认证'
          }
        ])
      },
      {
        userId: users[3].id, // 赵六
        basicInfo: JSON.stringify({
          name: '赵六',
          gender: '女',
          age: 25,
          phone: '13800138004',
          email: 'user4@test.com',
          address: '杭州市西湖区'
        }),
        jobIntention: JSON.stringify({
          position: 'UI/UX设计师',
          industry: '设计',
          salary: '10000-18000',
          workLocation: '杭州',
          workType: '全职'
        }),
        personalSummary: '2年UI/UX设计经验，擅长移动端界面设计，注重用户体验和视觉效果。',
        education: JSON.stringify([
          {
            school: '中国美术学院',
            major: '视觉传达设计',
            degree: '本科',
            startDate: '2018-09',
            endDate: '2022-06',
            description: '视觉传达设计专业，专注于数字媒体设计'
          }
        ]),
        workExperience: JSON.stringify([
          {
            company: '网易',
            position: 'UI设计师',
            startDate: '2022-07',
            endDate: '至今',
            description: '负责网易云音乐移动端界面设计'
          }
        ]),
        skills: JSON.stringify([
          { name: 'Sketch', level: '精通' },
          { name: 'Figma', level: '精通' },
          { name: 'Adobe XD', level: '熟练' },
          { name: 'Photoshop', level: '熟练' },
          { name: 'Illustrator', level: '熟练' }
        ]),
        certificates: JSON.stringify([
          {
            name: 'Adobe认证设计师',
            issuer: 'Adobe',
            date: '2022-10',
            description: 'Adobe Certified Expert in Photoshop'
          }
        ])
      }
    ];

    // 创建简历
    for (const resume of resumeData) {
      await prisma.resume.create({
        data: resume
      });
      const user = users.find(u => u.id === resume.userId);
      console.log(`✓ 简历创建成功: ${JSON.parse(resume.basicInfo).name}`);
    }

    console.log('\n=== 创建职位申请记录 ===');

    // 创建职位申请记录
    const jobApplications = [
      {
        userId: users[0].id, // 张三申请前端职位
        jobId: jobs.find(j => j.title.includes('前端'))?.id,
        coverLetter: '我对贵公司的前端开发职位非常感兴趣，我有5年的前端开发经验，熟练掌握React、Vue等技术栈。',
        expectedSalary: '20000',
        availableDate: '2024-02-01',
        attachments: ['https://example.com/portfolio.pdf'],
        resumeData: JSON.stringify({
          basicInfo: {
            name: '张三',
            gender: '男',
            age: 28,
            phone: '13800138001',
            email: 'user1@test.com',
            address: '北京市朝阳区'
          },
          jobIntention: {
            position: '前端开发工程师',
            industry: 'IT互联网',
            salary: '15000-25000',
            workLocation: '北京',
            workType: '全职'
          },
          personalSummary: '5年前端开发经验，熟练掌握React、Vue等主流框架。',
          education: [
            {
              school: '北京理工大学',
              major: '计算机科学与技术',
              degree: '本科',
              startDate: '2016-09',
              endDate: '2020-06'
            }
          ],
          workExperience: [
            {
              company: '字节跳动',
              position: '前端开发工程师',
              startDate: '2020-07',
              endDate: '2023-12'
            }
          ],
          skills: [
            { name: 'JavaScript', level: '精通' },
            { name: 'React', level: '精通' }
          ]
        }),
        status: 'pending'
      },
      {
        userId: users[1].id, // 李四申请Java职位
        jobId: jobs.find(j => j.title.includes('Java'))?.id,
        coverLetter: '我是一名经验丰富的Java后端开发工程师，希望能加入贵公司继续发展。',
        expectedSalary: '18000',
        availableDate: '2024-01-15',
        attachments: ['https://example.com/projects.pdf'],
        resumeData: JSON.stringify({
          basicInfo: {
            name: '李四',
            gender: '女',
            age: 26,
            phone: '13800138002',
            email: 'user2@test.com',
            address: '上海市浦东新区'
          },
          jobIntention: {
            position: 'Java后端开发工程师',
            industry: 'IT互联网',
            salary: '12000-20000'
          },
          personalSummary: '3年Java后端开发经验，熟悉Spring Boot、微服务架构。',
          education: [
            {
              school: '上海交通大学',
              major: '软件工程',
              degree: '硕士'
            }
          ]
        }),
        status: 'reviewing'
      },
      {
        userId: users[2].id, // 王五申请产品经理
        jobId: jobs.find(j => j.title.includes('产品经理'))?.id,
        coverLetter: '作为一名资深产品经理，我希望能为贵公司的产品发展贡献力量。',
        expectedSalary: '25000',
        availableDate: '2024-03-01',
        attachments: ['https://example.com/product-cases.pdf'],
        resumeData: JSON.stringify({
          basicInfo: {
            name: '王五',
            gender: '男',
            age: 30,
            phone: '13800138003',
            email: 'user3@test.com',
            address: '深圳市南山区'
          },
          jobIntention: {
            position: '产品经理',
            industry: 'IT互联网',
            salary: '20000-30000'
          },
          personalSummary: '6年产品经验，擅长用户体验设计和数据分析。'
        }),
        status: 'approved'
      }
    ];

    for (const application of jobApplications) {
      if (application.jobId) {
        await prisma.jobApplication.create({
          data: application
        });
        const user = users.find(u => u.id === application.userId);
        const job = jobs.find(j => j.id === application.jobId);
        console.log(`✓ 职位申请创建成功: ${user.name} 申请 ${job.title}`);
      }
    }

    console.log('\n=== 创建项目申请记录 ===');

    // 创建项目申请记录
    const projectApplications = [
      {
        userId: users[0].id, // 张三申请AI项目
        projectId: projects.find(p => p.title.includes('人工智能'))?.id,
        coverLetter: '我对人工智能医疗诊断系统项目非常感兴趣，希望能参与其中。',
        expectedRole: '前端开发',
        availableTime: '每周20小时',
        attachments: ['https://example.com/ai-experience.pdf'],
        status: 'pending'
      },
      {
        userId: users[1].id, // 李四申请区块链项目
        projectId: projects.find(p => p.title.includes('区块链'))?.id,
        coverLetter: '我有丰富的后端开发经验，希望参与区块链项目开发。',
        expectedRole: '后端开发',
        availableTime: '全职',
        attachments: ['https://example.com/blockchain-demo.pdf'],
        status: 'reviewing'
      },
      {
        userId: users[2].id, // 王五申请教育平台项目
        projectId: projects.find(p => p.title.includes('教育'))?.id,
        coverLetter: '作为产品经理，我希望能为在线教育平台的产品设计贡献经验。',
        expectedRole: '产品经理',
        availableTime: '每周30小时',
        attachments: ['https://example.com/education-product.pdf'],
        status: 'approved'
      }
    ];

    for (const application of projectApplications) {
      if (application.projectId) {
        await prisma.projectApplication.create({
          data: application
        });
        const user = users.find(u => u.id === application.userId);
        const project = projects.find(p => p.id === application.projectId);
        console.log(`✓ 项目申请创建成功: ${user.name} 申请 ${project.title}`);
      }
    }

    console.log('\n✅ 简历和申请记录数据填充完成！');
    
    console.log('\n📊 数据统计：');
    console.log(`- 用户简历: ${resumeData.length} 条`);
    console.log(`- 职位申请: ${jobApplications.filter(app => app.jobId).length} 条`);
    console.log(`- 项目申请: ${projectApplications.filter(app => app.projectId).length} 条`);

  } catch (error) {
    console.error('填充数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedResumesAndApplications();