import { Router } from 'express'
import { jobController } from '../controllers/jobController'
import { authenticateToken as auth } from '../middleware/auth'
import { upload, handleUploadError } from '../middleware/upload'

const router = Router()

// 获取所有职位
router.get('/', jobController.getJobs)

// 获取职位详情
router.get('/:id', jobController.getJobById)

// 获取热门职位
router.get('/popular', jobController.getPopularJobs)

// 获取推荐职位
router.get('/recommended', jobController.getRecommendedJobs)

// 搜索职位
router.get('/search', jobController.searchJobs)

// 申请职位 (需要认证) - 修复路由匹配前端API，支持文件上传
router.post('/apply', auth, upload.array('additionalDocs', 5), handleUploadError, jobController.applyJob)

// 获取用户申请记录 (需要认证) - 修复路由匹配前端API
router.get('/my-applications', auth, jobController.getUserApplications)

// 撤回申请 (需要认证)
router.put('/applications/:id/withdraw', auth, jobController.withdrawApplication)

export default router