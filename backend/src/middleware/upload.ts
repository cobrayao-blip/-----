import multer from 'multer';
import path from 'path';
import { createError } from './errorHandler';

// 修复文件名编码的函数
const fixFileNameEncoding = (originalName: string): string => {
  try {
    console.log('原始文件名:', originalName);
    
    // 如果文件名包含正常中文，直接返回
    if (/[\u4e00-\u9fff]/.test(originalName)) {
      console.log('文件名包含正常中文，无需修复');
      return originalName;
    }
    
    // 尝试修复编码问题
    // 方法1: 处理 Latin-1 到 UTF-8 的转换
    try {
      const buffer = Buffer.from(originalName, 'latin1');
      const fixed = buffer.toString('utf8');
      if (/[\u4e00-\u9fff]/.test(fixed)) {
        console.log('Latin-1转UTF-8修复成功:', fixed);
        return fixed;
      }
    } catch (e) {
      console.log('Latin-1转UTF-8失败');
    }
    
    // 方法2: URL解码
    try {
      const decoded = decodeURIComponent(escape(originalName));
      if (/[\u4e00-\u9fff]/.test(decoded)) {
        console.log('URL解码修复成功:', decoded);
        return decoded;
      }
    } catch (e) {
      console.log('URL解码失败');
    }
    
    // 方法3: 字节重新解释
    try {
      const bytes = [];
      for (let i = 0; i < originalName.length; i++) {
        bytes.push(originalName.charCodeAt(i) & 0xFF);
      }
      const buffer = Buffer.from(bytes);
      const fixed = buffer.toString('utf8');
      if (/[\u4e00-\u9fff]/.test(fixed)) {
        console.log('字节重新解释修复成功:', fixed);
        return fixed;
      }
    } catch (e) {
      console.log('字节重新解释失败');
    }
    
    console.log('所有修复方法都失败，返回原始文件名');
    return originalName;
  } catch (e) {
    console.error('文件名编码修复出错:', e);
    return originalName;
  }
};

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // 修复文件名编码
    const fixedOriginalName = fixFileNameEncoding(file.originalname);
    console.log(`文件名修复: ${file.originalname} -> ${fixedOriginalName}`);
    
    // 生成唯一文件名，保持原始扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(fixedOriginalName);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    
    // 将修复后的文件名存储到file对象中，供后续使用
    file.originalname = fixedOriginalName;
  }
});

// 文件过滤器
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 允许的文件类型
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'));
  }
};

// 创建multer实例
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 默认10MB
  }
});

// 错误处理中间件
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(createError('文件大小超出限制', 400));
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(createError('文件数量超出限制', 400));
    }
  }
  
  if (error.message === '不支持的文件类型') {
    return next(createError('不支持的文件类型', 400));
  }
  
  next(error);
};