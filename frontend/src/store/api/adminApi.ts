import { baseApi, ApiResponse, PaginationParams } from './baseApi'
import type { RootState } from '../index'

// 定义接口类型
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'USER' | 'VIP' | 'ADMIN' | 'SUPER_ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface Park {
  id: string
  name: string
  description?: string
  type: string
  level: string
  province: string
  city: string
  district?: string
  address?: string
  latitude?: number
  longitude?: number
  establishedYear?: number
  area?: number
  industries?: string
  policies?: string
  contact?: string
  images?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface Policy {
  id: string
  title: string
  content: string
  summary?: string
  type: string
  level: string
  publishDate: string
  effectiveDate?: string
  expiryDate?: string
  tags?: string
  keywords?: string
  department?: string
  attachments?: string
  viewCount: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  category: string
  funding?: number
  duration?: number
  requirements?: string
  benefits?: string
  applicationStart?: string
  applicationEnd?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  viewCount: number
  applicationCount: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface Job {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  salary: {
    min: number
    max: number
  }
  location: string
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT'
  status: 'OPEN' | 'CLOSED' | 'DRAFT'
  createdAt: string
  updatedAt: string
}

export interface Application {
  id: string
  type: 'PROJECT' | 'JOB'
  applicantId: string
  applicantName: string
  applicantEmail: string
  targetId: string
  targetTitle: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  submitTime: string
  reviewTime?: string
  reviewer?: string
  reviewComment?: string
  documents: string[]
}

export interface DashboardStats {
  totalUsers: number
  totalProjects: number
  totalPolicies: number
  totalParks: number
  totalJobs: number
  pendingApplications: number
  approvedApplications: number
  totalViews: number
  activeUsers: number
}

// 创建API - 使用baseApi来确保认�?
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 仪表盘统�?
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Dashboard'],
    }),

    // 用户管理
    getUsers: builder.query<{ users: User[], total: number, currentUserRole?: string }, { page?: number, limit?: number, search?: string, role?: string, status?: string }>({
      query: ({ page = 1, limit = 10, search, role, status }) => ({
        url: '/admin/users',
        params: { page, limit, search, role, status },
      }),
      transformResponse: (response: any) => {
        // 处理后端返回的数据结�?
        if (response.success && response.data) {
          return {
            users: response.data.users || [],
            total: response.data.total || 0,
            currentUserRole: response.data.currentUserRole
          }
        }
        return { users: [], total: 0 }
      },
      providesTags: ['User'],
    }),
    
    createUser: builder.mutation<User, { name: string, email: string, phone?: string, role: string, password: string }>({
      query: (userData) => ({
        url: '/admin/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<User, { id: string, name?: string, email?: string, phone?: string, role?: string, status?: string }>({
      query: ({ id, ...userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    updateUserStatus: builder.mutation<User, { id: string, status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // 园区管理
    getParks: builder.query<{ parks: Park[], total: number }, { page?: number, limit?: number, search?: string, status?: string }>({
      query: ({ page = 1, limit = 10, search, status }) => ({
        url: '/admin/parks',
        params: { page, limit, search, status },
      }),
      transformResponse: (response: any) => {
        console.log('园区API响应:', response)
        // 处理后端返回的数据结�?
        if (response.success && response.data) {
          const parks = Array.isArray(response.data) ? response.data : []
          return {
            parks,
            total: parks.length
          }
        }
        return { parks: [], total: 0 }
      },
      providesTags: ['Park'],
    }),

    createPark: builder.mutation<Park, Partial<Park>>({
      query: (park) => ({
        url: '/admin/parks',
        method: 'POST',
        body: park,
      }),
      invalidatesTags: ['Park'],
    }),

    updatePark: builder.mutation<Park, { id: string } & Partial<Park>>({
      query: ({ id, ...park }) => ({
        url: `/admin/parks/${id}`,
        method: 'PUT',
        body: park,
      }),
      invalidatesTags: ['Park'],
    }),

    deletePark: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/parks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Park'],
    }),

    // 政策管理
    getPolicies: builder.query<{ policies: Policy[], total: number }, { page?: number, limit?: number, search?: string, status?: string, category?: string }>({
      query: ({ page = 1, limit = 10, search, status, category }) => ({
        url: '/admin/policies',
        params: { page, limit, search, status, category },
      }),
      transformResponse: (response: any) => {
        console.log('政策API响应:', response)
        // 处理后端返回的数据结�?
        if (response.success && response.data) {
          const policies = Array.isArray(response.data) ? response.data : []
          return {
            policies,
            total: policies.length
          }
        }
        return { policies: [], total: 0 }
      },
      providesTags: ['Policy'],
    }),

    createPolicy: builder.mutation<Policy, Partial<Policy>>({
      query: (policy) => ({
        url: '/admin/policies',
        method: 'POST',
        body: policy,
      }),
      invalidatesTags: ['Policy'],
    }),

    updatePolicy: builder.mutation<Policy, { id: string } & Partial<Policy>>({
      query: ({ id, ...policy }) => ({
        url: `/admin/policies/${id}`,
        method: 'PUT',
        body: policy,
      }),
      invalidatesTags: ['Policy'],
    }),

    deletePolicy: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/policies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Policy'],
    }),

    // 项目管理
    getProjects: builder.query<{ projects: Project[], total: number }, { page?: number, limit?: number, search?: string, status?: string, category?: string }>({
      query: ({ page = 1, limit = 10, search, status, category }) => ({
        url: '/admin/projects',
        params: { page, limit, search, status, category },
      }),
      transformResponse: (response: any) => {
        console.log('项目API响应:', response)
        // 处理后端返回的数据结�?
        if (response.success && response.data) {
          const projects = Array.isArray(response.data) ? response.data : []
          return {
            projects,
            total: projects.length
          }
        }
        return { projects: [], total: 0 }
      },
      providesTags: ['Project'],
    }),

    createProject: builder.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: '/admin/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),

    updateProject: builder.mutation<Project, { id: string } & Partial<Project>>({
      query: ({ id, ...project }) => ({
        url: `/admin/projects/${id}`,
        method: 'PUT',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),

    // 工作管理
    getJobs: builder.query<{ jobs: Job[], total: number }, { page?: number, limit?: number, search?: string, status?: string, type?: string }>({
      query: ({ page = 1, limit = 10, search, status, type }) => ({
        url: '/admin/jobs',
        params: { page, limit, search, status, type },
      }),
      providesTags: ['Job'],
    }),

    createJob: builder.mutation<Job, Partial<Job>>({
      query: (job) => ({
        url: '/admin/jobs',
        method: 'POST',
        body: job,
      }),
      invalidatesTags: ['Job'],
    }),

    updateJob: builder.mutation<Job, { id: string } & Partial<Job>>({
      query: ({ id, ...job }) => ({
        url: `/jobs/${id}`,
        method: 'PUT',
        body: job,
      }),
      invalidatesTags: ['Job'],
    }),

    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),

    // 申请管理
    getProjectApplications: builder.query<{ applications: Application[], total: number }, { page?: number, limit?: number, status?: string }>({
      query: ({ page = 1, limit = 10, status }) => ({
        url: '/admin/applications/projects',
        params: { page, limit, status },
      }),
      providesTags: ['Application'],
    }),

    getJobApplications: builder.query<{ applications: Application[], total: number }, { page?: number, limit?: number, status?: string }>({
      query: ({ page = 1, limit = 10, status }) => ({
        url: '/admin/applications/jobs',
        params: { page, limit, status },
      }),
      providesTags: ['Application'],
    }),

    reviewProjectApplication: builder.mutation<Application, { id: string, status: string, comment?: string }>({
      query: ({ id, status, comment }) => ({
        url: `/applications/projects/${id}`,
        method: 'PUT',
        body: { status, comment },
      }),
      invalidatesTags: ['Application'],
    }),

    reviewJobApplication: builder.mutation<Application, { id: string, status: string, comment?: string }>({
      query: ({ id, status, comment }) => ({
        url: `/applications/jobs/${id}`,
        method: 'PUT',
        body: { status, comment },
      }),
      invalidatesTags: ['Application'],
    }),
  }),
})

// 导出hooks
export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetParksQuery,
  useCreateParkMutation,
  useUpdateParkMutation,
  useDeleteParkMutation,
  useGetPoliciesQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetProjectApplicationsQuery,
  useGetJobApplicationsQuery,
  useReviewProjectApplicationMutation,
  useReviewJobApplicationMutation,
} = adminApi
