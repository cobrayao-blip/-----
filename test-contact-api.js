const fetch = require('node-fetch');

async function testContactAPI() {
  try {
    console.log('测试联系信息API...');
    const response = await fetch('http://localhost:5000/api/content/contacts');
    const data = await response.json();
    
    console.log('API响应状态:', response.status);
    console.log('API响应成功:', data.success);
    console.log('联系信息数量:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\n基本联系信息:');
      const basicTypes = ['phone', 'email', 'address', 'hours'];
      data.data
        .filter(info => basicTypes.includes(info.type))
        .forEach(info => {
          console.log(`- ${info.type}: ${info.title} - ${info.content}`);
        });
      
      console.log('\n社交媒体信息:');
      data.data
        .filter(info => info.type === 'social')
        .forEach(info => {
          console.log(`- ${info.title}: ${info.content} ${info.qrCode ? '(有二维码)' : ''}`);
        });
    }
    
  } catch (error) {
    console.error('API测试失败:', error.message);
  }
}

testContactAPI();