const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 测试管理员登录API...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@xiaoyao.com',
      password: 'admin123456'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ 登录成功!');
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
    if (response.data.data && response.data.data.user) {
      const user = response.data.data.user;
      console.log('\n👤 用户信息:');
      console.log('ID:', user.id);
      console.log('邮箱:', user.email);
      console.log('姓名:', user.name);
      console.log('角色:', user.role);
      console.log('状态:', user.status);
    }

    if (response.data.data && response.data.data.token) {
      console.log('\n🔑 Token:', response.data.data.token.substring(0, 50) + '...');
    }

  } catch (error) {
    console.error('❌ 登录失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else {
      console.error('网络错误:', error.message);
    }
  }
}

testLogin();