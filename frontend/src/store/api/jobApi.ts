import { authApi } from './authApi'
import { ApiResponse, PaginationParams } from './baseApi'

export interface JobOpportunity {
  id: string
  title: string
  company: string
  description: string
  category: string
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE'
  level: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'DIRECTOR' | 'EXECUTIVE'
  salary?: string
  benefits?: string[]
  requirements?: string[]
  province: string
  city: string
  district?: string
  address?: string
  positions: number
  validUntil?: string
  contact?: any
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  views: number
  createdAt: string
  updatedAt: string
}

export interface JobApplication {
  id: string
  jobId: string
  job: JobOpportunity
  coverLetter?: string
  expectedSalary?: string
  availableDate?: string
  additionalDocs?: any[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'
  reviewNote?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface JobFilters extends PaginationParams {
  category?: string
  type?: string
  level?: string
  province?: string
  city?: string
  company?: string
}

export interface ApplyJobRequest {
  jobId: string
  coverLetter?: string
  expectedSalary?: string
  availableDate?: string
  includeResume?: boolean
  resumeData?: {
    basicInfo?: any
    title?: string
    objective?: string
    summary?: string
    awards?: string
    hobbies?: string
    education?: any[]
    experience?: any[]
    projects?: any[]
    skills?: any[]
    certificates?: any[]
    languages?: any[]
    attachments?: any[]
  }
  additionalDocs?: any[]
}

export const jobApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取工作机会列表
    getJobs: builder.query<ApiResponse<JobOpportunity[]>, JobFilters>({
      query: (params) => ({
        url: '/jobs',
        params,
      }),
      providesTags: ['Job'],
    }),

    // 获取工作详情
    getJobById: builder.query<ApiResponse<JobOpportunity>, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),

    // 申请工作
    applyJob: builder.mutation<ApiResponse<JobApplication>, ApplyJobRequest>({
      query: (data) => ({
        url: '/jobs/apply',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Application', 'Job'],
    }),

    // 申请工作（带文件上传）
    applyJobWithFiles: builder.mutation<ApiResponse<JobApplication>, FormData>({
      query: (formData) => ({
        url: '/jobs/apply',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Application', 'Job'],
    }),

    // 获取用户工作申请
    getUserJobApplications: builder.query<ApiResponse<JobApplication[]>, void>({
      query: () => '/jobs/my-applications',
      providesTags: ['Application'],
    }),

    // 撤回工作申请
    withdrawJobApplication: builder.mutation<ApiResponse, string>({
      query: (applicationId) => ({
        url: `/jobs/applications/${applicationId}/withdraw`,
        method: 'PUT',
      }),
      invalidatesTags: ['Application'],
    }),

    // 获取热门工作
    getPopularJobs: builder.query<ApiResponse<JobOpportunity[]>, { limit?: number }>({
      query: (params) => ({
        url: '/jobs/popular',
        params,
      }),
      providesTags: ['Job'],
    }),

    // 获取推荐工作
    getRecommendedJobs: builder.query<ApiResponse<JobOpportunity[]>, { limit?: number }>({
      query: (params) => ({
        url: '/jobs/recommended',
        params,
      }),
      providesTags: ['Job'],
    }),

    // 搜索工作
    searchJobs: builder.query<ApiResponse<JobOpportunity[]>, {
      keyword: string
      category?: string
      type?: string
      province?: string
    }>({
      query: (params) => ({
        url: '/jobs/search',
        params,
      }),
    }),
  }),
})

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useApplyJobMutation,
  useApplyJobWithFilesMutation,
  useGetUserJobApplicationsQuery,
  useWithdrawJobApplicationMutation,
  useGetPopularJobsQuery,
  useGetRecommendedJobsQuery,
  useSearchJobsQuery,
} = jobApi