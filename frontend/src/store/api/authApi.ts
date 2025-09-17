import { baseApi, ApiResponse } from './baseApi'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
    role: 'USER' | 'VIP' | 'ADMIN'
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'
  }
  token: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 登录
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // 注册
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // 获取当前用户信息
    getCurrentUser: builder.query<ApiResponse<AuthResponse['user']>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // 刷新token
    refreshToken: builder.mutation<ApiResponse<{ token: string }>, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    // 登出
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // 忘记密码
    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // 重置密码
    resetPassword: builder.mutation<ApiResponse, { token: string; password: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // 更新头像
    updateAvatar: builder.mutation<ApiResponse<{ avatar: string }>, { avatar: string }>({
      query: (data) => ({
        url: '/auth/update-avatar',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateAvatarMutation,
} = authApi