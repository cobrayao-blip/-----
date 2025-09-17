import { Router } from 'express'
import { policyController } from '../controllers/policyController'

const router = Router()

// 获取所有政策
router.get('/', policyController.getPolicies)

// 获取政策详情
router.get('/:id', policyController.getPolicyById)

// 获取热门政策
router.get('/popular', policyController.getPopularPolicies)

export default router