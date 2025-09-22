const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkExistingApplications() {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { 
        user: { email: 'wenqiu@xiaoyao.com' }
      },
      select: {
        id: true,
        coverLetter: true,
        resumeData: true,
        additionalDocs: true,
        createdAt: true,
        job: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('用户申请记录总数:', applications.length);
    
    applications.forEach((app, index) => {
      console.log(`\n申请 ${index + 1}:`);
      console.log('  - ID:', app.id);
      console.log('  - 职位:', app.job.title);
      console.log('  - 创建时间:', app.createdAt);
      console.log('  - 有简历数据:', !!app.resumeData);
      console.log('  - 简历数据长度:', app.resumeData?.length || 0);
      console.log('  - 有附件:', !!app.additionalDocs);
      console.log('  - 求职信长度:', app.coverLetter?.length || 0);
    });
    
  } catch (error) {
    console.error('检查申请记录失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkExistingApplications();