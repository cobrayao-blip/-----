import { authApi } from './authApi'
import { ApiResponse, PaginationParams } from './baseApi'

export interface Park {
  id: string
  name: string
  description?: string
  province: string
  city: string
  district?: string
  address?: string
  type: 'INDUSTRIAL' | 'TECH' | 'ECONOMIC' | 'HIGH_TECH' | 'BONDED' | 'OTHER'
  level: 'NATIONAL' | 'PROVINCIAL' | 'MUNICIPAL' | 'COUNTY'
  area?: number
  industries?: string[]
  policies?: string[]
  contact?: any
  images?: string[]
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface ParkFilters extends PaginationParams {
  province?: string
  city?: string
  type?: string
  level?: string
}

export const parkApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取园区列表
    getParks: builder.query<ApiResponse<Park[]>, ParkFilters>({
      query: (params) => ({
        url: '/parks',
        params,
      }),
      providesTags: ['Park'],
    }),

    // 获取园区详情
    getParkById: builder.query<ApiResponse<Park>, string>({
      query: (id) => `/parks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Park', id }],
    }),

    // 获取省份列表
    getProvinces: builder.query<ApiResponse<string[]>, void>({
      query: () => '/parks/provinces',
    }),

    // 获取城市列表
    getCities: builder.query<ApiResponse<string[]>, string>({
      query: (province) => `/parks/cities?province=${province}`,
    }),

    // 获取热门园区
    getPopularParks: builder.query<ApiResponse<Park[]>, { limit?: number }>({
      query: (params) => ({
        url: '/parks/popular',
        params,
      }),
      providesTags: ['Park'],
    }),
  }),
})

export const {
  useGetParksQuery,
  useGetParkByIdQuery,
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetPopularParksQuery,
} = parkApi