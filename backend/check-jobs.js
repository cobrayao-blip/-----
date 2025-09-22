const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkJobs() {
  try {
    console.log('查询JobOpportunity表...');
    const jobs = await prisma.jobOpportunity.findMany({
      select: {
        id: true,
        title: true,
        company: true,
        status: true
      }
    });
    
    console.log('Jobs数量:', jobs.length);
    console.log('Jobs详情:', JSON.stringify(jobs, null, 2));
    
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkJobs();