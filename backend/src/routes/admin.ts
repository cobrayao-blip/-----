import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { upload, handleUploadError } from '../middleware/upload';

const router = Router();

// 所有管理员路由都需要认证和管理员权限
router.use(authenticateToken);
router.use(requireAdmin);

// 仪表盘统计
router.get('/dashboard/stats', adminController.getDashboardStats);

// 用户管理
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// 园区管理
router.get('/parks', adminController.getParks);
router.post('/parks', adminController.createPark);
router.put('/parks/:id', adminController.updatePark);
router.delete('/parks/:id', adminController.deletePark);

// 政策管理
router.get('/policies', adminController.getPolicies);
router.post('/policies', adminController.createPolicy);
router.put('/policies/:id', adminController.updatePolicy);
router.delete('/policies/:id', adminController.deletePolicy);

// 项目管理
router.get('/projects', adminController.getProjects);
router.post('/projects', adminController.createProject);
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);

// 工作管理
router.get('/jobs', adminController.getJobs);
router.post('/jobs', adminController.createJob);
router.put('/jobs/:id', adminController.updateJob);
router.delete('/jobs/:id', adminController.deleteJob);

// 申请审核
router.get('/applications/projects', adminController.getProjectApplications);
router.put('/applications/projects/:id', adminController.reviewProjectApplication);
router.get('/applications/jobs', adminController.getJobApplications);
router.put('/applications/jobs/:id', adminController.reviewJobApplication);

// 文件上传
router.post('/upload', upload.array('files', 10), handleUploadError, adminController.uploadFiles);

export default router;