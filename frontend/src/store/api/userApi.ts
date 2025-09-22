import { authApi } from './authApi'
import { ApiResponse } from './baseApi'

export interface UserProfile {
  id: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  birthDate?: string
  nationality?: string
  currentLocation?: string
  isOverseas: boolean
  education?: any[]
  workExperience?: any[]
  researchField?: string
  achievements?: any[]
  resumeUrl?: string
}

export interface UpdateProfileRequest {
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  birthDate?: string
  nationality?: string
  currentLocation?: string
  isOverseas?: boolean
  education?: any[]
  workExperience?: any[]
  researchField?: string
  achievements?: any[]
}

export const userApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取用户资料
    getUserProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    // 更新用户资料
    updateUserProfile: builder.mutation<ApiResponse<UserProfile>, UpdateProfileRequest>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // 上传简历
    uploadResume: builder.mutation<ApiResponse<{ url: string }>, FormData>({
      query: (formData) => ({
        url: '/users/upload-resume',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    // 获取用户申请记录
    getUserApplications: builder.query<ApiResponse<{
      projects: any[]
      jobs: any[]
    }>, void>({
      query: () => '/users/applications',
      providesTags: ['Application'],
    }),

    // 更新用户基本信息
    updateUserInfo: builder.mutation<ApiResponse, {
      name?: string
      phone?: string
      avatar?: string
    }>({
      query: (data) => ({
        url: '/users/info',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // 修改密码
    changePassword: builder.mutation<ApiResponse, {
      currentPassword: string
      newPassword: string
    }>({
      query: (data) => ({
        url: '/users/change-password',
        method: 'PUT',
        body: data,
      }),
    }),

    // 获取项目申报详情
    getProjectApplicationDetail: builder.query<ApiResponse<any>, string>({
      query: (id) => `/users/applications/projects/${id}`,
      providesTags: ['Application'],
    }),

    // 更新项目申报
    updateProjectApplication: builder.mutation<ApiResponse<any>, {
      id: string
      personalInfo?: any
      projectInfo?: any
      resumeUrl?: string
      businessPlanUrl?: string
      financialReportUrl?: string
      otherDocsUrl?: string
      message?: string
    }>({
      query: ({ id, ...data }) => ({
        url: `/users/applications/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),

    // 获取工作申请详情
    getJobApplicationDetail: builder.query<ApiResponse<any>, string>({
      query: (id) => `/users/applications/jobs/${id}`,
      providesTags: ['Application'],
    }),

    // 更新工作申请
    updateJobApplication: builder.mutation<ApiResponse<any>, {
      id: string
      coverLetter?: string
      resumeUrl?: string
      expectedSalary?: string
      availableDate?: string
      additionalDocs?: string
    }>({
      query: ({ id, ...data }) => ({
        url: `/users/applications/jobs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),
  }),
})

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadResumeMutation,
  useGetUserApplicationsQuery,
  useUpdateUserInfoMutation,
  useChangePasswordMutation,
  useGetProjectApplicationDetailQuery,
  useUpdateProjectApplicationMutation,
  useGetJobApplicationDetailQuery,
  useUpdateJobApplicationMutation,
} = userApi