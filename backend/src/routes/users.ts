import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateUser } from '../middleware/validation';
import { upload, handleUploadError } from '../middleware/upload';

const router = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取用户资料
router.get('/profile', userController.getProfile);

// 更新用户资料
router.put('/profile', validateUser.updateProfile, userController.updateProfile);

// 上传简历
router.post('/upload-resume', upload.single('resume'), handleUploadError, userController.uploadResume);

// 项目申报文件上传
router.post('/upload-project-files', upload.array('files', 10), handleUploadError, userController.uploadProjectFiles);

// 获取用户申请记录
router.get('/applications', userController.getApplications);

// 获取项目申报详情
router.get('/applications/projects/:id', userController.getProjectApplicationDetail);

// 更新项目申报
router.put('/applications/projects/:id', userController.updateProjectApplication);

// 获取工作申请详情
router.get('/applications/jobs/:id', userController.getJobApplicationDetail);

// 更新工作申请
router.put('/applications/jobs/:id', userController.updateJobApplication);

// 更新用户基本信息
router.put('/info', validateUser.updateInfo, userController.updateInfo);

// 修改密码
router.put('/change-password', validateUser.changePassword, userController.changePassword);

export default router;