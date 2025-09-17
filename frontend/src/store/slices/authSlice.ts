import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'USER' | 'VIP' | 'ADMIN' | 'SUPER_ADMIN'
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// 从localStorage恢复用户信息的辅助函数
const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token') && !!getUserFromStorage(),
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userAvatar')
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        // 更新localStorage中的用户信息
        localStorage.setItem('user', JSON.stringify(state.user))
        // 如果更新了头像，保存到localStorage
        if (action.payload.avatar) {
          localStorage.setItem('userAvatar', action.payload.avatar)
        }
      }
    },
  },
})

export const { setCredentials, logout, setLoading, updateUser } = authSlice.actions
export default authSlice.reducer