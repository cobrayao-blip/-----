import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';

// 导入路由
import authRoutes from './routes/auth'
import healthRoutes from './routes/health';
import userRoutes from './routes/users';
import parkRoutes from './routes/parks';
import policyRoutes from './routes/policies';
import projectRoutes from './routes/projects';
import jobRoutes from './routes/jobs';
import adminRoutes from './routes/admin';
import resumeRoutes from './routes/resume';

// 导入中间件
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// 加载环境变量
dotenv.config();

// 初始化Prisma客户端
export const prisma = new PrismaClient();

// 创建Express应用
const app = express();
const server = createServer(app);

// 中间件配置
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parks', parkRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resume', resumeRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 连接数据库
    await prisma.$connect();
    logger.info('数据库连接成功');

    // 启动服务器
    server.listen(PORT, () => {
      logger.info(`服务器运行在端口 ${PORT}`);
      logger.info(`环境: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', async () => {
  logger.info('收到SIGTERM信号，开始优雅关闭...');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('收到SIGINT信号，开始优雅关闭...');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

startServer();