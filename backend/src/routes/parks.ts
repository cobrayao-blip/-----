import { Router } from 'express'
import { parkController } from '../controllers/parkController'

const router = Router()

// 获取所有园区
router.get('/', parkController.getParks)

// 获取园区详情
router.get('/:id', parkController.getParkById)

export default router