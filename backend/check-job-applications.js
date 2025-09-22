const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkJobApplications() {
  try {
    console.log('查询JobApplication表...');
    const jobApplications = await prisma.jobApplication.findMany({
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
    
    console.log('JobApplications数量:', jobApplications.length);
    console.log('JobApplications详情:', JSON.stringify(jobApplications, null, 2));
    
    // 也查询一下用户表，看看大刀王五的ID
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: '大刀王五'
        }
      }
    });
    
    console.log('大刀王五用户信息:', JSON.stringify(users, null, 2));
    
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkJobApplications();