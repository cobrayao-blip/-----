const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showData() {
  try {
    const users = await prisma.user.findMany();
    const projects = await prisma.startupProject.findMany();
    const jobs = await prisma.jobOpportunity.findMany();
    
    console.log('=== 用户列表 ===');
    users.forEach(user => {
      console.log(`邮箱: ${user.email} | 角色: ${user.role} | 创建时间: ${user.createdAt.toISOString().split('T')[0]}`);
    });
    
    console.log('\n=== 项目列表 ===');
    projects.forEach(project => {
      const desc = project.description ? project.description.substring(0, 50) + '...' : '无描述';
      console.log(`项目名称: ${project.name} | 描述: ${desc} | 创建时间: ${project.createdAt.toISOString().split('T')[0]}`);
    });
    
    console.log('\n=== 职位列表 ===');
    jobs.forEach(job => {
      console.log(`职位: ${job.title} | 公司: ${job.company} | 创建时间: ${job.createdAt.toISOString().split('T')[0]}`);
    });
    
  } catch (error) {
    console.error('查询数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showData();