import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

// 定义简历相关接口类型
export interface BasicInfo {
  name?: string
  birthDate?: string
  hometown?: string
  phone?: string
  email?: string
  maritalStatus?: string
  employmentStatus?: string
  jobObjective?: string
  personalSummary?: string
  awards?: string
  hobbies?: string
}

export interface Resume {
  id: string
  userId: string
  title: string
  basicInfo?: BasicInfo
  objective?: string
  summary?: string
  education?: any[]
  experience?: any[]
  projects?: any[]
  skills?: any[]
  certificates?: any[]
  languages?: any[]
  hobbies?: string
  awards?: any[]
  attachments?: any[]
  isPublic: boolean
  isComplete: boolean
  createdAt: string
  updatedAt: string
}

export interface ResumeUpdateData {
  title?: string
  basicInfo?: BasicInfo
  objective?: string
  summary?: string
  education?: any[]
  experience?: any[]
  projects?: any[]
  skills?: any[]
  certificates?: any[]
  languages?: any[]
  hobbies?: string
  awards?: string | any[]
  attachments?: any[]
  isPublic?: boolean
  name?: string
  birthDate?: string
  hometown?: string
  phone?: string
  email?: string
  maritalStatus?: string
  employmentStatus?: string
}

export interface AttachmentUploadData {
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
}

// 创建简历API
export const resumeApi = createApi({
  reducerPath: 'resumeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/resume',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Resume'],
  endpoints: (builder) => ({
    // 获取用户简历
    getResume: builder.query<Resume, void>({
      query: () => '/',
      transformResponse: (response: any) => {
        console.log('API响应:', response);
        if (response.success && response.data) {
          return response.data;
        }
        // 兼容直接返回数据的情况
        return response;
      },
      providesTags: ['Resume'],
    }),

    // 更新简历
    updateResume: builder.mutation<Resume, ResumeUpdateData>({
      query: (resumeData) => ({
        url: '/',
        method: 'PUT',
        body: resumeData,
      }),
      invalidatesTags: ['Resume'],
    }),

    // 上传附件
    uploadAttachment: builder.mutation<any, AttachmentUploadData>({
      query: (attachmentData) => ({
        url: '/attachments',
        method: 'POST',
        body: attachmentData,
      }),
      invalidatesTags: ['Resume'],
    }),

    // 删除附件
    deleteAttachment: builder.mutation<any, string>({
      query: (attachmentId) => ({
        url: `/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),

    // 导出简历
    exportResume: builder.mutation<any, void>({
      query: () => ({
        url: '/export',
        method: 'GET',
      }),
    }),

    // 获取简历预览（管理员功能）
    getResumePreview: builder.query<Resume, string>({
      query: (userId) => `/preview/${userId}`,
    }),
  }),
})

// 导出hooks
export const {
  useGetResumeQuery,
  useUpdateResumeMutation,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useExportResumeMutation,
  useGetResumePreviewQuery,
} = resumeApi