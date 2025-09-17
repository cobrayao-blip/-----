import { authApi } from './authApi'
import { ApiResponse, PaginationParams } from './baseApi'

export interface Policy {
  id: string
  title: string
  content: string
  summary?: string
  type: 'TALENT' | 'INVESTMENT' | 'STARTUP' | 'TAX' | 'HOUSING' | 'EDUCATION' | 'OTHER'
  level: 'NATIONAL' | 'PROVINCIAL' | 'MUNICIPAL' | 'COUNTY'
  province?: string
  city?: string
  district?: string
  validFrom?: string
  validTo?: string
  department?: string
  attachments?: any[]
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  views: number
  createdAt: string
  updatedAt: string
}

export interface PolicyFilters extends PaginationParams {
  type?: string
  level?: string
  province?: string
  city?: string
}

export const policyApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取政策列表
    getPolicies: builder.query<ApiResponse<Policy[]>, PolicyFilters>({
      query: (params) => ({
        url: '/policies',
        params,
      }),
      providesTags: ['Policy'],
    }),

    // 获取政策详情
    getPolicyById: builder.query<ApiResponse<Policy>, string>({
      query: (id) => `/policies/${id}`,
      providesTags: (result, error, id) => [{ type: 'Policy', id }],
    }),

    // 获取热门政策
    getPopularPolicies: builder.query<ApiResponse<Policy[]>, { limit?: number }>({
      query: (params) => ({
        url: '/policies/popular',
        params,
      }),
      providesTags: ['Policy'],
    }),

    // 获取最新政策
    getLatestPolicies: builder.query<ApiResponse<Policy[]>, { limit?: number }>({
      query: (params) => ({
        url: '/policies/latest',
        params,
      }),
      providesTags: ['Policy'],
    }),

    // 搜索政策
    searchPolicies: builder.query<ApiResponse<Policy[]>, {
      keyword: string
      type?: string
      province?: string
    }>({
      query: (params) => ({
        url: '/policies/search',
        params,
      }),
    }),
  }),
})

export const {
  useGetPoliciesQuery,
  useGetPolicyByIdQuery,
  useGetPopularPoliciesQuery,
  useGetLatestPoliciesQuery,
  useSearchPoliciesQuery,
} = policyApi