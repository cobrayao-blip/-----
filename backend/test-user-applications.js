const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUserApplications() {
  try {
    const userId = 'cmfrlodp800029fzsq6gj2jcs'; // 大刀王五的ID
    
    console.log('测试用户申请记录API...');
    console.log('用户ID:', userId);
    
    // 模拟userController.getApplications方法
    const [projectApplications, jobApplications] = await Promise.all([
      prisma.projectApplication.findMany({
        where: { userId },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.jobApplication.findMany({
        where: { userId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const result = {
      success: true,
      data: {
        projects: projectApplications,
        jobs: jobApplications
      }
    };

    console.log('API返回结果:', JSON.stringify(result, null, 2));
    console.log('项目申请数量:', projectApplications.length);
    console.log('职位申请数量:', jobApplications.length);
    
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserApplications();