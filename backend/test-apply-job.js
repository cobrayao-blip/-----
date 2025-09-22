const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testApplyJob() {
  try {
    // 获取用户和职位信息
    const user = await prisma.user.findUnique({
      where: { email: 'wenqiu@xiaoyao.com' }
    });
    
    if (!user) {
      console.log('❌ 用户不存在');
      return;
    }
    
    const job = await prisma.jobOpportunity.findFirst({
      where: { status: 'PUBLISHED' }
    });
    
    if (!job) {
      console.log('❌ 没有可申请的职位');
      return;
    }
    
    console.log('✅ 用户ID:', user.id);
    console.log('✅ 职位ID:', job.id);
    console.log('✅ 职位标题:', job.title);
    
    // 获取用户简历
    const resume = await prisma.resume.findUnique({
      where: { userId: user.id }
    });
    
    if (!resume) {
      console.log('❌ 用户没有简历');
      return;
    }
    
    console.log('✅ 简历存在:', resume.title);
    console.log('✅ 简历完整性:', resume.isComplete);
    
    // 模拟申请数据
    const mockApplicationData = {
      userId: user.id,
      jobId: job.id,
      coverLetter: '测试求职信',
      expectedSalary: '15000',
      availableDate: new Date('2024-01-01'),
      includeResume: true
    };
    
    // 构建简历数据（模拟后端逻辑）
    let resumeDataString = null;
    
    if (mockApplicationData.includeResume && resume && resume.isComplete) {
      // 解析JSON字符串字段
      const basicInfo = resume.basicInfo ? JSON.parse(resume.basicInfo) : {};
      const education = resume.education ? JSON.parse(resume.education) : [];
      const experience = resume.experience ? JSON.parse(resume.experience) : [];
      const projects = resume.projects ? JSON.parse(resume.projects) : [];
      const skills = resume.skills ? JSON.parse(resume.skills) : [];
      const certificates = resume.certificates ? JSON.parse(resume.certificates) : [];
      const languages = resume.languages ? JSON.parse(resume.languages) : [];
      const attachments = resume.attachments ? JSON.parse(resume.attachments) : [];
      
      // 构建完整的简历数据
      const fullResumeData = {
        basicInfo: basicInfo,
        title: resume.title,
        objective: basicInfo.jobObjective || '',
        summary: basicInfo.personalSummary || '',
        awards: basicInfo.awards || '',
        hobbies: basicInfo.hobbies || '',
        education: education,
        experience: experience,
        projects: projects,
        skills: skills,
        certificates: certificates,
        languages: languages,
        attachments: attachments
      };
      
      resumeDataString = JSON.stringify(fullResumeData);
      console.log('✅ 简历数据长度:', resumeDataString.length);
      console.log('✅ 简历数据预览:', resumeDataString.substring(0, 200) + '...');
    }
    
    // 创建测试申请
    const testApplication = await prisma.jobApplication.create({
      data: {
        userId: mockApplicationData.userId,
        jobId: mockApplicationData.jobId,
        coverLetter: mockApplicationData.coverLetter,
        resumeUrl: `/api/resume/preview/${user.id}`,
        resumeData: resumeDataString,
        expectedSalary: mockApplicationData.expectedSalary,
        availableDate: mockApplicationData.availableDate,
        additionalDocs: null
      }
    });
    
    console.log('✅ 测试申请创建成功:', testApplication.id);
    console.log('✅ 申请包含简历数据:', !!testApplication.resumeData);
    console.log('✅ 简历数据长度:', testApplication.resumeData?.length || 0);
    
    // 验证申请记录
    const savedApplication = await prisma.jobApplication.findUnique({
      where: { id: testApplication.id },
      select: {
        id: true,
        resumeData: true,
        additionalDocs: true,
        coverLetter: true,
        expectedSalary: true
      }
    });
    
    console.log('✅ 保存的申请记录验证:');
    console.log('  - ID:', savedApplication.id);
    console.log('  - 有简历数据:', !!savedApplication.resumeData);
    console.log('  - 简历数据长度:', savedApplication.resumeData?.length || 0);
    console.log('  - 求职信:', savedApplication.coverLetter);
    console.log('  - 期望薪资:', savedApplication.expectedSalary);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApplyJob();