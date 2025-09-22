import express from 'express'
import {
  getTestimonials,
  getTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialOrder,
  toggleTestimonialStatus
} from '../controllers/testimonialController'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = express.Router()

// 公开路由 - 获取启用的用户评价
router.get('/', getTestimonials)

// 管理员路由
router.use(authenticateToken, requireAdmin)

router.get('/admin', getTestimonialsAdmin)
router.post('/', createTestimonial)
router.put('/:id', updateTestimonial)
router.delete('/:id', deleteTestimonial)
router.put('/:id/toggle', toggleTestimonialStatus)
router.put('/batch/order', updateTestimonialOrder)

export default router