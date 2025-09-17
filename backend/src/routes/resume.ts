import { Router } from 'express';
import { resumeController } from '../controllers/resumeController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 获取用户简历
router.get('/', authenticateToken, resumeController.getResume);

// 更新简历
router.put('/', authenticateToken, resumeController.updateResume);

// 上传附件
router.post('/attachments', authenticateToken, resumeController.uploadAttachment);

// 删除附件
router.delete('/attachments/:attachmentId', authenticateToken, resumeController.deleteAttachment);

// 导出简历
router.get('/export', authenticateToken, resumeController.exportResume);

// 获取简历预览（管理员功能）
router.get('/preview/:userId', authenticateToken, resumeController.getResumePreview);

export default router;