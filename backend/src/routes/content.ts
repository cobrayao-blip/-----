import { Router } from 'express';
import {
  getGuides,
  createGuide,
  updateGuide,
  deleteGuide,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  incrementFAQViews,
  getContactInfos,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
  getFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  uploadContactImage
} from '../controllers/contentController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { upload, handleUploadError } from '../middleware/upload';

const router = Router();

// 使用指南路由 - 公开访问
router.get('/guides', getGuides);

// 使用指南管理路由 - 需要管理员权限
router.post('/guides', authenticateToken, requireAdmin, createGuide);
router.put('/guides/:id', authenticateToken, requireAdmin, updateGuide);
router.delete('/guides/:id', authenticateToken, requireAdmin, deleteGuide);

// FAQ路由 - 公开访问
router.get('/faqs', getFAQs);
router.post('/faqs/:id/views', incrementFAQViews);

// FAQ管理路由 - 需要管理员权限
router.post('/faqs', authenticateToken, requireAdmin, createFAQ);
router.put('/faqs/:id', authenticateToken, requireAdmin, updateFAQ);
router.delete('/faqs/:id', authenticateToken, requireAdmin, deleteFAQ);

// 联系信息路由 - 公开访问
router.get('/contacts', getContactInfos);

// 联系信息管理路由 - 需要管理员权限
router.post('/contacts', authenticateToken, requireAdmin, createContactInfo);
router.put('/contacts/:id', authenticateToken, requireAdmin, updateContactInfo);
router.delete('/contacts/:id', authenticateToken, requireAdmin, deleteContactInfo);

// 联系信息图片上传路由 - 需要管理员权限
router.post('/contacts/upload-image', authenticateToken, requireAdmin, upload.single('image'), handleUploadError, uploadContactImage);

// 意见反馈路由
router.get('/feedbacks', authenticateToken, requireAdmin, getFeedbacks);
router.post('/feedbacks', createFeedback); // 公开提交
router.put('/feedbacks/:id', authenticateToken, requireAdmin, updateFeedback);
router.delete('/feedbacks/:id', authenticateToken, requireAdmin, deleteFeedback);

export default router;