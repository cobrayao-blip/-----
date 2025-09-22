import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../index'

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Park', 'Policy', 'Project', 'Job', 'Application', 'Dashboard'],
  endpoints: () => ({}),
})