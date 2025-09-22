import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteApplication() {
  try {
    console.log('删除申请记录...');
    
    // 删除指定的申请记录
    const result = await prisma.projectApplication.delete({
      where: {
        id: 'cmfq0dr6u00017vofozd1ha58'
      }
    });
    
    console.log('申请记录删除成功:', result.id);
    
  } catch (error) {
    console.error('删除申请记录失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteApplication();