const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPolicyContent() {
  try {
    console.log('开始检查和修复政策内容...');
    
    // 获取所有政策
    const policies = await prisma.policy.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        status: true
      }
    });
    
    console.log(`总共找到 ${policies.length} 个政策`);
    
    let emptyContentCount = 0;
    let fixedCount = 0;
    
    for (const policy of policies) {
      // 检查content是否为空或null
      if (!policy.content || policy.content.trim() === '') {
        emptyContentCount++;
        console.log(`\n政策 "${policy.title}" (ID: ${policy.id}) 的内容为空`);
        console.log(`状态: ${policy.status}`);
        console.log(`摘要: ${policy.summary ? policy.summary.substring(0, 100) + '...' : '无摘要'}`);
        
        // 如果有摘要但没有内容，使用摘要作为内容
        if (policy.summary && policy.summary.trim() !== '') {
          const newContent = `${policy.summary}\n\n详细内容待完善...`;
          
          await prisma.policy.update({
            where: { id: policy.id },
            data: { content: newContent }
          });
          
          console.log(`✅ 已使用摘要为政策 "${policy.title}" 生成内容`);
          fixedCount++;
        } else {
          // 如果连摘要都没有，生成一个基本内容
          const basicContent = `${policy.title}\n\n本政策的详细内容正在完善中，请关注后续更新。\n\n如需了解更多信息，请联系相关部门。`;
          
          await prisma.policy.update({
            where: { id: policy.id },
            data: { content: basicContent }
          });
          
          console.log(`✅ 已为政策 "${policy.title}" 生成基本内容`);
          fixedCount++;
        }
      } else {
        console.log(`✓ 政策 "${policy.title}" 内容正常 (${policy.content.length} 字符)`);
      }
    }
    
    console.log(`\n=== 修复完成 ===`);
    console.log(`总政策数: ${policies.length}`);
    console.log(`内容为空的政策数: ${emptyContentCount}`);
    console.log(`已修复的政策数: ${fixedCount}`);
    
    // 验证修复结果
    console.log('\n=== 验证修复结果 ===');
    const updatedPolicies = await prisma.policy.findMany({
      where: {
        OR: [
          { content: null },
          { content: '' }
        ]
      }
    });
    
    if (updatedPolicies.length === 0) {
      console.log('✅ 所有政策都有内容了！');
    } else {
      console.log(`❌ 还有 ${updatedPolicies.length} 个政策内容为空`);
    }
    
  } catch (error) {
    console.error('修复过程中出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPolicyContent();