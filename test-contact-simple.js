const http = require('http');

function testContactAPI() {
  console.log('测试联系信息API...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/content/contacts',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('API响应状态:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('API响应成功:', jsonData.success);
        console.log('联系信息数量:', jsonData.data?.length || 0);
        
        if (jsonData.data && jsonData.data.length > 0) {
          console.log('\n基本联系信息:');
          const basicTypes = ['phone', 'email', 'address', 'hours'];
          jsonData.data
            .filter(info => basicTypes.includes(info.type))
            .forEach(info => {
              console.log(`- ${info.type}: ${info.title} - ${info.content}`);
            });
          
          console.log('\n社交媒体信息:');
          jsonData.data
            .filter(info => info.type === 'social')
            .forEach(info => {
              console.log(`- ${info.title}: ${info.content} ${info.qrCode ? '(有二维码)' : ''}`);
            });
        }
      } catch (error) {
        console.error('解析JSON失败:', error.message);
        console.log('原始响应:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('API测试失败:', error.message);
  });

  req.end();
}

testContactAPI();