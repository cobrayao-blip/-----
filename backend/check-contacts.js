const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkContacts() {
  try {
    const contacts = await prisma.contactInfo.findMany({
      orderBy: { order: 'asc' }
    });
    
    console.log('数据库中的联系信息:');
    contacts.forEach(contact => {
      console.log('ID:', contact.id, 'Type:', contact.type, 'Title:', contact.title, 'Content:', contact.content);
    });
    
    console.log('总共', contacts.length, '条联系信息');
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContacts();