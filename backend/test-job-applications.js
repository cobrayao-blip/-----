const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testJobApplications() {
  try {
    console.log('=== 检查职位申请数据 ===');
    
    const applications = await prisma.jobApplication.findMany({
      select: {
        id: true,
        userId: true,
        jobId: true,
        coverLetter: true,
        resumeData: true,
        additionalDocs: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        job: {
          select: {
            title: true,
            company: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`总申请数量: ${applications.length}`);
    
    if (applications.length === 0) {
      console.log('❌ 数据库中没有职位申请数据');
      return;
    }
    
    applications.forEach((app, index) => {
      console.log(`\n--- 申请 ${index + 1} ---`);
      console.log(`申请ID: ${app.id}`);
      console.log(`申请人: ${app.user.name} (${app.user.email})`);
      console.log(`职位: ${app.job.title} - ${app.job.company}`);
      console.log(`状态: ${app.status}`);
      console.log(`求职信: ${app.coverLetter ? '有' : '无'}`);
      console.log(`简历数据: ${app.resumeData ? '有 (' + app.resumeData.length + ' 字符)' : '无'}`);
      console.log(`附件数据: ${app.additionalDocs ? '有 (' + app.additionalDocs.length + ' 字符)' : '无'}`);
      
      // 解析简历数据
      if (app.resumeData) {
        try {
          const resumeData = JSON.parse(app.resumeData);
          console.log(`简历包含: 基本信息${resumeData.basicInfo ? '✓' : '✗'}, 教育经历${resumeData.education?.length || 0}条, 工作经历${resumeData.experience?.length || 0}条`);
        } catch (e) {
          console.log('简历数据解析失败');
        }
      }
      
      // 解析附件数据
      if (app.additionalDocs) {
        try {
          const docs = JSON.parse(app.additionalDocs);
          if (Array.isArray(docs)) {
            console.log(`附件包含: ${docs.length}个文件`);
            docs.forEach((doc, i) => {
              console.log(`  文件${i+1}: ${doc.name} (${doc.type})`);
            });
          }
        } catch (e) {
          console.log('附件数据解析失败');
        }
      }
    });
    
  } catch (error) {
    console.error('检查职位申请数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testJobApplications();