import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials, logout } from '../store/slices/authSlice'

const AuthChecker: React.FC = () => {
  const dispatch = useAppDispatch()
  const { token, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // 如果有token但没有用户信息，尝试从token中解析用户信息
    if (token && !user) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        
        // 检查token是否过期
        const currentTime = Date.now() / 1000
        if (payload.exp && payload.exp < currentTime) {
          console.log('Token已过期，清除认证信息')
          dispatch(logout())
          return
        }
        
        // 从localStorage恢复头像数据
        const savedAvatar = localStorage.getItem('userAvatar')
        
        const userData = {
          id: payload.userId,
          email: payload.email,
          name: payload.name || payload.email,
          avatar: savedAvatar || undefined,
          role: payload.role as 'USER' | 'VIP' | 'ADMIN' | 'SUPER_ADMIN',
          status: 'ACTIVE' as 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'
        }
        
        console.log('从token恢复用户信息:', userData)
        dispatch(setCredentials({ user: userData, token }))
      } catch (error) {
        console.error('解析token失败:', error)
        dispatch(logout())
      }
    }
  }, [token, user, dispatch])

  return null
}

export default AuthChecker