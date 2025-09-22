const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findSpecificUsers() {
  try {
    // 查找所有用户
    const allUsers = await prisma.user.findMany();
    console.log('=== 所有用户列表 ===');
    allUsers.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`邮箱: ${user.email}`);
      console.log(`角色: ${user.role}`);
      console.log(`创建时间: ${user.createdAt}`);
      console.log('---');
    });
    
    // 查找用户资料
    const profiles = await prisma.userProfile.findMany();
    console.log('\n=== 用户资料列表 ===');
    profiles.forEach(profile => {
      console.log(`用户ID: ${profile.userId}`);
      console.log(`姓名: ${profile.name}`);
      console.log(`电话: ${profile.phone || '无'}`);
      console.log(`创建时间: ${profile.createdAt}`);
      console.log('---');
    });
    
    // 查找项目申请
    const applications = await prisma.projectApplication.findMany();
    console.log('\n=== 项目申请列表 ===');
    applications.forEach(app => {
      console.log(`申请ID: ${app.id}`);
      console.log(`用户ID: ${app.userId}`);
      console.log(`项目ID: ${app.projectId}`);
      console.log(`状态: ${app.status}`);
      console.log(`创建时间: ${app.createdAt}`);
      console.log('---');
    });
    
    // 特别查找大刀王五和洪波
    console.log('\n=== 查找特定用户 ===');
    const dadaoUser = profiles.find(p => p.name && p.name.includes('大刀王五'));
    const hongboUser = profiles.find(p => p.name && p.name.includes('洪波'));
    
    if (dadaoUser) {
      console.log('✓ 找到用户: 大刀王五');
      console.log(`  用户ID: ${dadaoUser.userId}`);
      console.log(`  创建时间: ${dadaoUser.createdAt}`);
    } else {
      console.log('✗ 未找到用户: 大刀王五');
    }
    
    if (hongboUser) {
      console.log('✓ 找到用户: 洪波');
      console.log(`  用户ID: ${hongboUser.userId}`);
      console.log(`  创建时间: ${hongboUser.createdAt}`);
    } else {
      console.log('✗ 未找到用户: 洪波');
    }
    
  } catch (error) {
    console.error('查询数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findSpecificUsers();