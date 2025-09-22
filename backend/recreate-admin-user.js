const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function recreateAdminUser() {
  try {
    console.log('开始重新创建管理员用户和测试数据...');

    // 1. 创建管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@xiaoyao.com' },
      update: {},
      create: {
        email: 'admin@xiaoyao.com',
        password: hashedPassword,
        name: '系统管理员',
        phone: '13800138000',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log('✓ 管理员用户创建成功:', adminUser.name);

    // 2. 创建普通测试用户
    const testUserPassword = await bcrypt.hash('123456', 10);
    
    const testUser = await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        password: testUserPassword,
        name: '张三',
        phone: '13900139000',
        role: 'USER',
        status: 'ACTIVE'
      }
    });
    console.log('✓ 测试用户创建成功:', testUser.name);

    // 3. 为测试用户创建简历
    const testResume = await prisma.resume.upsert({
      where: { userId: testUser.id },
      update: {
        title: '我的简历',
        basicInfo: JSON.stringify({
          name: '张三',
          phone: '13900139000',
          email: 'user@test.com',
          hometown: '北京市',
          birthDate: '1990-01-01',
          maritalStatus: '未婚',
          employmentStatus: '在职',
          jobObjective: '寻找前端开发工程师职位',
          personalSummary: '具有5年前端开发经验，熟练掌握React、Vue等框架，有丰富的项目经验'
        }),
        education: JSON.stringify([
          {
            id: '1',
            school: '北京大学',
            major: '计算机科学与技术',
            degree: '本科',
            startDate: '2008-09',
            endDate: '2012-06',
            description: '主修计算机科学与技术，成绩优异，获得多项奖学金'
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
            description: '负责公司核心产品的前端开发工作，参与多个重要项目的架构设计和开发'
          },
          {
            id: '2',
            company: '阿里巴巴',
            position: '高级前端工程师',
            startDate: '2024-01',
            endDate: '2024-12',
            current: true,
            description: '负责电商平台前端架构优化，提升用户体验和系统性能'
          }
        ]),
        skills: JSON.stringify([
          {
            id: '1',
            name: 'React',
            category: '前端框架',
            description: '熟练掌握React开发，有丰富的项目经验，熟悉Hooks、Redux等'
          },
          {
            id: '2',
            name: 'TypeScript',
            category: '编程语言',
            description: '熟练使用TypeScript进行大型项目开发，提高代码质量'
          },
          {
            id: '3',
            name: 'Vue.js',
            category: '前端框架',
            description: '熟练掌握Vue.js框架，包括Vue3、Vuex、Vue Router等'
          }
        ]),
        certificates: JSON.stringify([
          {
            id: '1',
            name: '软件设计师',
            issueDate: '2020-05',
            description: '国家软考中级证书'
          },
          {
            id: '2',
            name: 'AWS认证开发者',
            issueDate: '2022-03',
            description: 'Amazon Web Services认证开发者证书'
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
          phone: '13900139000',
          email: 'user@test.com',
          hometown: '北京市',
          birthDate: '1990-01-01',
          maritalStatus: '未婚',
          employmentStatus: '在职',
          jobObjective: '寻找前端开发工程师职位',
          personalSummary: '具有5年前端开发经验，熟练掌握React、Vue等框架，有丰富的项目经验'
        }),
        education: JSON.stringify([
          {
            id: '1',
            school: '北京大学',
            major: '计算机科学与技术',
            degree: '本科',
            startDate: '2008-09',
            endDate: '2012-06',
            description: '主修计算机科学与技术，成绩优异，获得多项奖学金'
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
            description: '负责公司核心产品的前端开发工作，参与多个重要项目的架构设计和开发'
          },
          {
            id: '2',
            company: '阿里巴巴',
            position: '高级前端工程师',
            startDate: '2024-01',
            endDate: '2024-12',
            current: true,
            description: '负责电商平台前端架构优化，提升用户体验和系统性能'
          }
        ]),
        skills: JSON.stringify([
          {
            id: '1',
            name: 'React',
            category: '前端框架',
            description: '熟练掌握React开发，有丰富的项目经验，熟悉Hooks、Redux等'
          },
          {
            id: '2',
            name: 'TypeScript',
            category: '编程语言',
            description: '熟练使用TypeScript进行大型项目开发，提高代码质量'
          },
          {
            id: '3',
            name: 'Vue.js',
            category: '前端框架',
            description: '熟练掌握Vue.js框架，包括Vue3、Vuex、Vue Router等'
          }
        ]),
        certificates: JSON.stringify([
          {
            id: '1',
            name: '软件设计师',
            issueDate: '2020-05',
            description: '国家软考中级证书'
          },
          {
            id: '2',
            name: 'AWS认证开发者',
            issueDate: '2022-03',
            description: 'Amazon Web Services认证开发者证书'
          }
        ]),
        isComplete: true,
        isPublic: true
      }
    });
    console.log('✓ 测试用户简历创建成功');

    // 4. 创建一些测试职位
    const jobs = [
      {
        title: '高级前端开发工程师',
        company: '阿里巴巴',
        description: '负责前端架构设计和核心功能开发，要求熟练掌握React、Vue等框架',
        type: 'FULL_TIME',
        level: 'SENIOR',
        location: '杭州市',
        salary: '25K-40K',
        status: 'PUBLISHED'
      },
      {
        title: '全栈开发工程师',
        company: '腾讯科技',
        description: '负责前后端开发，要求熟悉Node.js、React等技术栈',
        type: 'FULL_TIME',
        level: 'MID',
        location: '深圳市',
        salary: '20K-35K',
        status: 'PUBLISHED'
      },
      {
        title: 'React开发工程师',
        company: '字节跳动',
        description: '专注于React生态系统开发，参与大型前端项目',
        type: 'FULL_TIME',
        level: 'JUNIOR',
        location: '北京市',
        salary: '15K-25K',
        status: 'PUBLISHED'
      }
    ];

    for (const jobData of jobs) {
      await prisma.jobOpportunity.create({
        data: jobData
      });
    }
    console.log('✓ 测试职位创建成功，共创建', jobs.length, '个职位');

    // 5. 创建一些测试项目
    const projects = [
      {
        title: '智能制造创新项目',
        description: '基于AI技术的智能制造解决方案',
        category: 'TECH',
        funding: 1000000,
        duration: 24,
        requirements: '具有AI、机器学习相关技术背景',
        benefits: '提供资金支持、技术指导、市场推广等',
        status: 'PUBLISHED'
      },
      {
        title: '绿色能源创业项目',
        description: '新能源技术研发与应用',
        category: 'ENERGY',
        funding: 500000,
        duration: 18,
        requirements: '新能源、环保技术相关背景',
        benefits: '资金扶持、政策支持、专家指导',
        status: 'PUBLISHED'
      }
    ];

    for (const projectData of projects) {
      await prisma.startupProject.create({
        data: projectData
      });
    }
    console.log('✓ 测试项目创建成功，共创建', projects.length, '个项目');

    console.log('\n✅ 数据重建完成！');
    console.log('📋 创建的账户信息：');
    console.log('管理员账户: admin@xiaoyao.com / admin123');
    console.log('测试用户账户: user@test.com / 123456');
    console.log('\n🎯 您现在可以使用这些账户登录系统进行测试');

  } catch (error) {
    console.error('❌ 数据重建失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateAdminUser();