const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createSuperAdmin(email, password, name, phone) {
  try {
    // 检查是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log(`用户 ${email} 已存在，正在升级为超级管理员...`);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { 
          role: 'SUPER_ADMIN',
          name: name || '超级管理员'
        }
      });
      console.log('升级成功:', updatedUser);
      return updatedUser;
    }

    // 创建新的超级管理员
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || '超级管理员',
        phone: phone || null,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      }
    });

    console.log('超级管理员创建成功:', superAdmin);
    return superAdmin;
  } catch (error) {
    console.error('操作失败:', error);
    throw error;
  }
}

async function listAllAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'SUPER_ADMIN' },
          { role: 'ADMIN' }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    console.log('\n=== 所有管理员账户 ===');
    admins.forEach(admin => {
      console.log(`
ID: ${admin.id}
邮箱: ${admin.email}
姓名: ${admin.name}
电话: ${admin.phone || '未设置'}
角色: ${admin.role === 'SUPER_ADMIN' ? '超级管理员' : '普通管理员'}
状态: ${admin.status}
创建时间: ${admin.createdAt.toLocaleString('zh-CN')}
${'='.repeat(50)}`);
    });

    return admins;
  } catch (error) {
    console.error('查询失败:', error);
    throw error;
  }
}

async function upgradeToSuperAdmin(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error(`用户 ${email} 不存在`);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'SUPER_ADMIN' }
    });

    console.log(`用户 ${email} 已升级为超级管理员`);
    return updatedUser;
  } catch (error) {
    console.error('升级失败:', error);
    throw error;
  }
}

async function downgradeToAdmin(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error(`用户 ${email} 不存在`);
    }

    if (user.role !== 'SUPER_ADMIN') {
      throw new Error(`用户 ${email} 不是超级管理员`);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });

    console.log(`用户 ${email} 已降级为普通管理员`);
    return updatedUser;
  } catch (error) {
    console.error('降级失败:', error);
    throw error;
  }
}

// 命令行参数处理
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'create':
        if (args.length < 3) {
          console.log('用法: node manage-super-admin.js create <email> <password> [name] [phone]');
          process.exit(1);
        }
        await createSuperAdmin(args[1], args[2], args[3], args[4]);
        break;

      case 'list':
        await listAllAdmins();
        break;

      case 'upgrade':
        if (args.length < 2) {
          console.log('用法: node manage-super-admin.js upgrade <email>');
          process.exit(1);
        }
        await upgradeToSuperAdmin(args[1]);
        break;

      case 'downgrade':
        if (args.length < 2) {
          console.log('用法: node manage-super-admin.js downgrade <email>');
          process.exit(1);
        }
        await downgradeToAdmin(args[1]);
        break;

      default:
        console.log(`
超级管理员管理工具

用法:
  node manage-super-admin.js create <email> <password> [name] [phone]  - 创建超级管理员
  node manage-super-admin.js list                                      - 列出所有管理员
  node manage-super-admin.js upgrade <email>                          - 升级为超级管理员
  node manage-super-admin.js downgrade <email>                        - 降级为普通管理员

示例:
  node manage-super-admin.js create super@xiaoyao.com 123456 "超级管理员" "13800138000"
  node manage-super-admin.js list
  node manage-super-admin.js upgrade admin@xiaoyao.com
        `);
    }
  } catch (error) {
    console.error('执行失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();