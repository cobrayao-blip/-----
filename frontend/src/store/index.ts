import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'

// 导入slice
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'

// 导入API
import { authApi } from './api/authApi'
import { adminApi } from './api/adminApi'
import { api } from '../services/api'
import { resumeApi } from '../services/resumeApi'

export const store = configureStore({
  reducer: {
    // 状态slice
    auth: authSlice,
    user: userSlice,
    
    // API slice - 使用baseApi作为主要的API reducer
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [api.reducerPath]: api.reducer,
    [resumeApi.reducerPath]: resumeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      adminApi.middleware,
      api.middleware,
      resumeApi.middleware,
    ),
})

// 启用refetchOnFocus/refetchOnReconnect行为
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 导出 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector