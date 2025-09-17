import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserProfile {
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

interface UserState {
  profile: UserProfile | null
  applications: {
    projects: any[]
    jobs: any[]
  }
  isProfileComplete: boolean
}

const initialState: UserState = {
  profile: null,
  applications: {
    projects: [],
    jobs: [],
  },
  isProfileComplete: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
      state.isProfileComplete = checkProfileComplete(action.payload)
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
        state.isProfileComplete = checkProfileComplete(state.profile)
      }
    },
    setApplications: (state, action: PayloadAction<{ projects: any[]; jobs: any[] }>) => {
      state.applications = action.payload
    },
    addProjectApplication: (state, action: PayloadAction<any>) => {
      state.applications.projects.push(action.payload)
    },
    addJobApplication: (state, action: PayloadAction<any>) => {
      state.applications.jobs.push(action.payload)
    },
    clearUserData: (state) => {
      state.profile = null
      state.applications = { projects: [], jobs: [] }
      state.isProfileComplete = false
    },
  },
})

// 检查用户资料是否完整
function checkProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.gender &&
    profile.birthDate &&
    profile.nationality &&
    profile.currentLocation &&
    profile.education &&
    profile.education.length > 0 &&
    profile.workExperience &&
    profile.workExperience.length > 0 &&
    profile.researchField
  )
}

export const {
  setProfile,
  updateProfile,
  setApplications,
  addProjectApplication,
  addJobApplication,
  clearUserData,
} = userSlice.actions

export default userSlice.reducer