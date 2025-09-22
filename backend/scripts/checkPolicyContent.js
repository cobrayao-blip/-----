const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPolicyContent() {
  try {
    console.log('检查政策内容...');
    
    // 获取所有政策
    const policies = await prisma.policy.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        content: true,
        summary: true
      }
    });

    console.log(`总共有 ${policies.length} 个政策`);
    console.log('');

    for (const policy of policies) {
      console.log(`政策ID: ${policy.id}`);
      console.log(`标题: ${policy.title}`);
      console.log(`类型: ${policy.type}`);
      console.log(`内容长度: ${policy.content ? policy.content.length : 0} 字符`);
      console.log(`摘要长度: ${policy.summary ? policy.summary.length : 0} 字符`);
      
      if (policy.content) {
        console.log(`内容预览: ${policy.content.substring(0, 100)}...`);
      } else {
        console.log('内容: 空');
      }
      
      console.log('---');
    }

  } catch (error) {
    console.error('检查政策内容时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPolicyContent();