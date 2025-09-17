// 认证工具函数
export const getStoredUser = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    
    // 解析JWT token获取用户信息
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    }
  } catch (error) {
    console.error('解析token失败:', error)
    return null
  }
}

export const isAdmin = () => {
  const user = getStoredUser()
  return user?.role === 'ADMIN'
}

export const clearAuth = () => {
  localStorage.removeItem('token')
}