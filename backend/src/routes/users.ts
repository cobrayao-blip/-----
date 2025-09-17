import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateUser } from '../middleware/validation';
import { upload } from '../middleware/upload';

const router = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取用户资料
router.get('/profile', userController.getProfile);

// 更新用户资料
router.put('/profile', validateUser.updateProfile, userController.updateProfile);

// 上传简历
router.post('/upload-resume', upload.single('resume'), userController.uploadResume);

// 获取用户申请记录
router.get('/applications', userController.getApplications);

// 更新用户基本信息
router.put('/info', validateUser.updateInfo, userController.updateInfo);

// 修改密码
router.put('/change-password', validateUser.changePassword, userController.changePassword);

export default router;