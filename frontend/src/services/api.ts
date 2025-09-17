import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// 定义API基础配置
export const api = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      // 从localStorage获取token
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Park', 'Policy', 'Project', 'Job'],
  endpoints: (builder) => ({
    // 认证相关
    login: builder.mutation<
      { success: boolean; data: { user: any; token: string } },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<
      { success: boolean; data: { user: any; token: string } },
      { name: string; email: string; password: string; phone?: string }
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // 园区相关
    getParks: builder.query<
      { success: boolean; data: any[] },
      { search?: string; province?: string; city?: string; type?: string }
    >({
      query: (params) => ({
        url: '/parks',
        params,
      }),
      providesTags: ['Park'],
    }),

    getParkById: builder.query<
      { success: boolean; data: any },
      string
    >({
      query: (id) => `/parks/${id}`,
      providesTags: ['Park'],
    }),

    // 政策相关
    getPolicies: builder.query<
      { success: boolean; data: any[] },
      { search?: string; type?: string; level?: string }
    >({
      query: (params) => ({
        url: '/policies',
        params,
      }),
      providesTags: ['Policy'],
    }),

    getPolicyById: builder.query<
      { success: boolean; data: any },
      string
    >({
      query: (id) => `/policies/${id}`,
      providesTags: ['Policy'],
    }),

    getPopularPolicies: builder.query<
      { success: boolean; data: any[] },
      { limit?: number }
    >({
      query: (params) => ({
        url: '/policies/popular',
        params,
      }),
      providesTags: ['Policy'],
    }),

    // 项目相关
    getProjects: builder.query<
      { success: boolean; data: any[] },
      { search?: string; category?: string; stage?: string; industry?: string }
    >({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Project'],
    }),

    getProjectById: builder.query<
      { success: boolean; data: any },
      string
    >({
      query: (id) => `/projects/${id}`,
      providesTags: ['Project'],
    }),

    getPopularProjects: builder.query<
      { success: boolean; data: any[] },
      { limit?: number }
    >({
      query: (params) => ({
        url: '/projects/popular',
        params,
      }),
      providesTags: ['Project'],
    }),

    applyProject: builder.mutation<
      { success: boolean; message: string },
      { projectId: string; coverLetter?: string }
    >({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/apply`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Project'],
    }),

    // 职位相关
    getJobs: builder.query<
      { success: boolean; data: any[] },
      { 
        search?: string; 
        location?: string; 
        salaryMin?: number; 
        salaryMax?: number;
        experience?: string;
        type?: string;
      }
    >({
      query: (params) => ({
        url: '/jobs',
        params,
      }),
      providesTags: ['Job'],
    }),

    getJobById: builder.query<
      { success: boolean; data: any },
      string
    >({
      query: (id) => `/jobs/${id}`,
      providesTags: ['Job'],
    }),

    getPopularJobs: builder.query<
      { success: boolean; data: any[] },
      { limit?: number }
    >({
      query: (params) => ({
        url: '/jobs/popular',
        params,
      }),
      providesTags: ['Job'],
    }),

    applyJob: builder.mutation<
      { success: boolean; message: string },
      { jobId: string; coverLetter?: string }
    >({
      query: ({ jobId, ...body }) => ({
        url: `/jobs/${jobId}/apply`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Job'],
    }),

    // 用户相关
    getUserProfile: builder.query<
      { success: boolean; data: any },
      void
    >({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<
      { success: boolean; data: any },
      any
    >({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),

    getUserApplications: builder.query<
      { success: boolean; data: { projectApplications: any[]; jobApplications: any[] } },
      void
    >({
      query: () => '/users/applications',
      providesTags: ['User'],
    }),
  }),
})

// 导出hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetParksQuery,
  useGetParkByIdQuery,
  useGetPoliciesQuery,
  useGetPolicyByIdQuery,
  useGetPopularPoliciesQuery,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetPopularProjectsQuery,
  useApplyProjectMutation,
  useGetJobsQuery,
  useGetJobByIdQuery,
  useGetPopularJobsQuery,
  useApplyJobMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserApplicationsQuery,
} = api