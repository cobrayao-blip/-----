import { Router } from 'express'
import { jobController } from '../controllers/jobController'
import { authenticateToken as auth } from '../middleware/auth'

const router = Router()

// 获取所有职位
router.get('/', jobController.getJobs)

// 获取职位详情
router.get('/:id', jobController.getJobById)

// 获取热门职位
router.get('/popular', jobController.getPopularJobs)

// 申请职位 (需要认证)
router.post('/:id/apply', auth, jobController.applyJob)

// 获取用户申请记录 (需要认证)
router.get('/applications/my', auth, jobController.getUserApplications)

export default router