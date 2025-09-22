const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testJobApply() {
  try {
    const userId = 'cmfrlodp800029fzsq6gj2jcs'; // 大刀王五的ID
    const jobId = 'cmfrlz90500031se4lvg9zv36'; // 高级前端开发工程师
    
    console.log('测试职位申请...');
    console.log('用户ID:', userId);
    console.log('职位ID:', jobId);
    
    // 检查是否已申请
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId
        }
      }
    });
    
    if (existingApplication) {
      console.log('已存在申请记录:', existingApplication);
      return;
    }
    
    // 创建申请
    const application = await prisma.jobApplication.create({
      data: {
        userId,
        jobId,
        coverLetter: '我对这个职位很感兴趣，希望能够加入贵公司。',
        expectedSalary: '15000',
        availableDate: new Date('2025-10-01'),
        status: 'PENDING'
      },
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
            email: true
          }
        }
      }
    });
    
    console.log('申请创建成功:', JSON.stringify(application, null, 2));
    
    // 验证申请是否保存成功
    const savedApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId
        }
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        }
      }
    });
    
    console.log('验证保存的申请:', JSON.stringify(savedApplication, null, 2));
    
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testJobApply();