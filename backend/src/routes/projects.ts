import { Router } from 'express'
import { projectController } from '../controllers/projectController'
import { authenticateToken as auth } from '../middleware/auth'

const router = Router()

// 获取所有项目
router.get('/', projectController.getProjects)

// 获取项目详情
router.get('/:id', projectController.getProjectById)

// 获取热门项目
router.get('/popular', projectController.getPopularProjects)

// 申请项目 (需要认证)
router.post('/:id/apply', auth, projectController.applyProject)

// 获取用户申请记录 (需要认证)
router.get('/applications/my', auth, projectController.getUserApplications)

export default router