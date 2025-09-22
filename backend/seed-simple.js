const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('开始填充简历和申请记录数据...\n');

    // 获取用户数据
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['user1@test.com', 'user2@test.com', 'user3@test.com', 'user4@test.com']
        }
      }
    });

    console.log(`找到 ${users.length} 个用户`);

    if (users.length === 0) {
      console.log('没有找到测试用户，请先运行 seed-all-data.js');
      return;
    }

    // 获取职位和项目数据
    const jobs = await prisma.job.findMany();
    const projects = await prisma.project.findMany();

    console.log(`找到 ${jobs.length} 个职位，${projects.length} 个项目`);

    console.log('\n=== 创建用户简历数据 ===');

    // 为张三创建简历
    if (users[0]) {
      const resume1 = await prisma.resume.create({
        data: {
          userId: users[0].id,
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
            }
          ]),
          skills: JSON.stringify([
            { name: 'JavaScript', level: '精通' },
            { name: 'React', level: '精通' },
            { name: 'Vue.js', level: '熟练' },
            { name: 'TypeScript', level: '熟练' }
          ]),
          certificates: JSON.stringify([
            {
              name: '软件设计师',
              issuer: '工信部',
              date: '2021-05',
              description: '中级软件设计师资格证书'
            }
          ])
        }
      });
      console.log('✓ 简历创建成功: 张三');
    }

    // 为李四创建简历
    if (users[1]) {
      const resume2 = await prisma.resume.create({
        data: {
          userId: users[1].id,
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
            { name: 'Redis', level: '熟练' }
          ]),
          certificates: JSON.stringify([
            {
              name: 'Oracle认证Java程序员',
              issuer: 'Oracle',
              date: '2022-03',
              description: 'OCP Java SE 11 Developer'
            }
          ])
        }
      });
      console.log('✓ 简历创建成功: 李四');
    }

    console.log('\n=== 创建职位申请记录 ===');

    // 创建职位申请
    if (users[0] && jobs.length > 0) {
      const frontendJob = jobs.find(j => j.title.includes('前端'));
      if (frontendJob) {
        await prisma.jobApplication.create({
          data: {
            userId: users[0].id,
            jobId: frontendJob.id,
            coverLetter: '我对贵公司的前端开发职位非常感兴趣，我有5年的前端开发经验，熟练掌握React、Vue等技术栈。',
            expectedSalary: '20000',
            availableDate: '2024-02-01',
            attachments: JSON.stringify(['https://example.com/portfolio.pdf']),
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
                salary: '15000-25000'
              },
              personalSummary: '5年前端开发经验，熟练掌握React、Vue等主流框架。'
            }),
            status: 'pending'
          }
        });
        console.log('✓ 职位申请创建成功: 张三 申请前端职位');
      }
    }

    if (users[1] && jobs.length > 0) {
      const javaJob = jobs.find(j => j.title.includes('Java'));
      if (javaJob) {
        await prisma.jobApplication.create({
          data: {
            userId: users[1].id,
            jobId: javaJob.id,
            coverLetter: '我是一名经验丰富的Java后端开发工程师，希望能加入贵公司继续发展。',
            expectedSalary: '18000',
            availableDate: '2024-01-15',
            attachments: JSON.stringify(['https://example.com/projects.pdf']),
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
              personalSummary: '3年Java后端开发经验，熟悉Spring Boot、微服务架构。'
            }),
            status: 'reviewing'
          }
        });
        console.log('✓ 职位申请创建成功: 李四 申请Java职位');
      }
    }

    console.log('\n=== 创建项目申请记录 ===');

    // 创建项目申请
    if (users[0] && projects.length > 0) {
      const aiProject = projects.find(p => p.title.includes('人工智能'));
      if (aiProject) {
        await prisma.projectApplication.create({
          data: {
            userId: users[0].id,
            projectId: aiProject.id,
            coverLetter: '我对人工智能医疗诊断系统项目非常感兴趣，希望能参与其中。',
            expectedRole: '前端开发',
            availableTime: '每周20小时',
            attachments: JSON.stringify(['https://example.com/ai-experience.pdf']),
            status: 'pending'
          }
        });
        console.log('✓ 项目申请创建成功: 张三 申请AI项目');
      }
    }

    console.log('\n✅ 简历和申请记录数据填充完成！');

  } catch (error) {
    console.error('填充数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();