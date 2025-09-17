import { authApi } from './authApi'
import { ApiResponse, PaginationParams } from './baseApi'

export interface StartupProject {
  id: string
  title: string
  description: string
  category: string
  fundingAmount?: number
  duration?: number
  requirements?: string[]
  benefits?: string[]
  province: string
  city: string
  district?: string
  applicationStart?: string
  applicationEnd?: string
  maxApplicants?: number
  currentApplicants: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  views: number
  createdAt: string
  updatedAt: string
}

export interface ProjectApplication {
  id: string
  projectId: string
  project: StartupProject
  businessPlanUrl?: string
  additionalDocs?: any[]
  message?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'
  reviewNote?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFilters extends PaginationParams {
  category?: string
  province?: string
  city?: string
  fundingMin?: number
  fundingMax?: number
}

export interface ApplyProjectRequest {
  projectId: string
  businessPlanUrl?: string
  additionalDocs?: any[]
  message?: string
}

export const projectApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取创业项目列表
    getProjects: builder.query<ApiResponse<StartupProject[]>, ProjectFilters>({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Project'],
    }),

    // 获取项目详情
    getProjectById: builder.query<ApiResponse<StartupProject>, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    // 申请项目
    applyProject: builder.mutation<ApiResponse<ProjectApplication>, ApplyProjectRequest>({
      query: (data) => ({
        url: '/projects/apply',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Application', 'Project'],
    }),

    // 上传创业计划书
    uploadBusinessPlan: builder.mutation<ApiResponse<{ url: string }>, FormData>({
      query: (formData) => ({
        url: '/projects/upload-business-plan',
        method: 'POST',
        body: formData,
      }),
    }),

    // 获取用户项目申请
    getUserProjectApplications: builder.query<ApiResponse<ProjectApplication[]>, void>({
      query: () => '/projects/my-applications',
      providesTags: ['Application'],
    }),

    // 撤回项目申请
    withdrawProjectApplication: builder.mutation<ApiResponse, string>({
      query: (applicationId) => ({
        url: `/projects/applications/${applicationId}/withdraw`,
        method: 'PUT',
      }),
      invalidatesTags: ['Application'],
    }),

    // 获取热门项目
    getPopularProjects: builder.query<ApiResponse<StartupProject[]>, { limit?: number }>({
      query: (params) => ({
        url: '/projects/popular',
        params,
      }),
      providesTags: ['Project'],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useApplyProjectMutation,
  useUploadBusinessPlanMutation,
  useGetUserProjectApplicationsQuery,
  useWithdrawProjectApplicationMutation,
  useGetPopularProjectsQuery,
} = projectApi