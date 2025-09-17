import { Routes, Route, Navigate } from 'react-router-dom'

// 导入页面组件
import HomePage from './pages/Home'
import AboutPage from './pages/About'
import GuidePage from './pages/Guide'
import FAQPage from './pages/FAQ'
import ContactPage from './pages/Contact'
import FeedbackPage from './pages/Feedback'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import ChangePassword from './pages/ChangePassword'
import ParksPage from './pages/Parks'
import ParkDetailPage from './pages/ParkDetail'
import PoliciesPage from './pages/Policies'
import ProjectsPage from './pages/Projects'
import ProjectDetailPage from './pages/ProjectDetail'
import ProjectApplicationPage from './pages/ProjectApplication'
import ApplicationSuccessPage from './pages/ApplicationSuccess'
import MyApplicationsPage from './pages/MyApplications'
import JobsPage from './pages/Jobs'
import ProfilePage from './pages/Profile'
import ResumePage from './pages/Resume'
import TestLoginPage from './pages/TestLogin'
import AdminTestPage from './pages/AdminTest'

// 导入管理后台组件
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/Admin/Dashboard'
import UserManagement from './pages/Admin/UserManagementNew'
import ApplicationManagement from './pages/Admin/ApplicationManagement'
import ContentManagement from './pages/Admin/ContentManagement'
import PageContentManagement from './pages/Admin/PageContentManagement'
import SystemSettings from './pages/Admin/SystemSettings'

// 导入布局组件
import MainLayout from './components/Layout/MainLayout'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AuthChecker from './components/AuthChecker'

function App() {
  return (
    <div className="App">
      <AuthChecker />
      <Routes>
        {/* 公共路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/test-login" element={<TestLoginPage />} />
        <Route path="/admin-test" element={<AdminTestPage />} />
        
        {/* 主要页面路由 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="parks" element={<ParksPage />} />
          <Route path="parks/:id" element={<ParkDetailPage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="projects/:id/apply" element={
            <ProtectedRoute>
              <ProjectApplicationPage />
            </ProtectedRoute>
          } />
          <Route path="projects/:id/application/success" element={
            <ProtectedRoute>
              <ApplicationSuccessPage />
            </ProtectedRoute>
          } />
          <Route path="my-applications" element={
            <ProtectedRoute>
              <MyApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="jobs" element={<JobsPage />} />
          
          {/* 需要登录的路由 */}
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="resume" element={
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
          } />
        </Route>

        {/* 管理后台路由 */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="applications" element={<ApplicationManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="page-content" element={<PageContentManagement />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App