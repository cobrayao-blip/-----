import { Router } from 'express';
import { login, register, getCurrentUser, refreshToken, logout, changePassword, updateAvatar } from '../controllers/authController';
import { validateAuth } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 注册
router.post('/register', validateAuth.register, register);

// 登录
router.post('/login', validateAuth.login, login);

// 获取当前用户信息
router.get('/me', authenticateToken, getCurrentUser);

// 刷新token
router.post('/refresh', authenticateToken, refreshToken);

// 登出
router.post('/logout', authenticateToken, logout);

// 修改密码
router.put('/change-password', authenticateToken, validateAuth.changePassword, changePassword);

// 更新头像
router.put('/update-avatar', authenticateToken, updateAvatar);

export default router;