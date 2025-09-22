const axios = require('axios');

async function testAdminPolicyApi() {
  try {
    console.log('测试管理员政策API...');
    
    // 首先登录获取token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'superadmin@example.com',
      password: 'admin123'
    });
    
    if (!loginResponse.data.success) {
      console.error('登录失败:', loginResponse.data);
      return;
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ 登录成功，获得token');
    
    // 调用管理员政策API
    const policiesResponse = await axios.get('http://localhost:5000/api/admin/policies', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!policiesResponse.data.success) {
      console.error('获取政策失败:', policiesResponse.data);
      return;
    }
    
    const policies = policiesResponse.data.data;
    console.log(`\n✅ 成功获取 ${policies.length} 个政策`);
    
    // 检查每个政策的内容
    policies.forEach((policy, index) => {
      console.log(`\n--- 政策 ${index + 1} ---`);
      console.log(`ID: ${policy.id}`);
      console.log(`标题: ${policy.title}`);
      console.log(`状态: ${policy.status}`);
      console.log(`内容长度: ${policy.content ? policy.content.length : 0} 字符`);
      console.log(`内容预览: ${policy.content ? policy.content.substring(0, 100) + '...' : '无内容'}`);
      console.log(`摘要: ${policy.summary ? policy.summary.substring(0, 50) + '...' : '无摘要'}`);
    });
    
    // 对比普通API
    console.log('\n=== 对比普通API ===');
    const publicPoliciesResponse = await axios.get('http://localhost:5000/api/policies');
    
    if (publicPoliciesResponse.data.success) {
      const publicPolicies = publicPoliciesResponse.data.data;
      console.log(`普通API返回 ${publicPolicies.length} 个政策`);
      
      // 找到相同的政策进行对比
      const firstAdminPolicy = policies[0];
      const matchingPublicPolicy = publicPolicies.find(p => p.id === firstAdminPolicy.id);
      
      if (matchingPublicPolicy) {
        console.log('\n--- 同一政策对比 ---');
        console.log(`管理员API内容长度: ${firstAdminPolicy.content ? firstAdminPolicy.content.length : 0}`);
        console.log(`普通API内容长度: ${matchingPublicPolicy.content ? matchingPublicPolicy.content.length : 0}`);
        console.log(`内容是否相同: ${firstAdminPolicy.content === matchingPublicPolicy.content}`);
      }
    }
    
  } catch (error) {
    console.error('测试过程中出错:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

testAdminPolicyApi();