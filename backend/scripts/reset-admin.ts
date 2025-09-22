import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    console.log('重置管理员账户...');
    
    // 删除现有管理员账户
    await prisma.user.deleteMany({
      where: {
        email: 'admin@xiaoyao.com'
      }
    });
    
    // 创建新的管理员账户
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@xiaoyao.com',
        password: hashedPassword,
        name: '系统管理员',
        phone: '13800138000',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      }
    });
    
    console.log('管理员账户重置成功:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });
    
  } catch (error) {
    console.error('重置管理员账户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();