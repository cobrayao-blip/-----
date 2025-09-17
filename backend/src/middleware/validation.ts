import { Request, Response, NextFunction } from 'express';

export const validateAuth = {
  register: (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: '请提供必要的注册信息'
      });
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }
    
    // 密码强度验证
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少6位'
      });
    }
    
    next();
  },

  login: (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码'
      });
    }
    
    next();
  },

  changePassword: (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '请提供当前密码和新密码'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码长度至少6位'
      });
    }
    
    next();
  },

  forgotPassword: (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱地址'
      });
    }
    
    next();
  },

  resetPassword: (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供重置令牌和新密码'
      });
    }
    
    next();
  }
};

// 其他验证中间件
export const validateUser = {
  updateProfile: (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '姓名不能为空'
      });
    }
    
    next();
  },

  updateInfo: (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '姓名不能为空'
      });
    }
    
    next();
  },

  changePassword: (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '请提供当前密码和新密码'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码长度至少6位'
      });
    }
    
    next();
  }
};

export const validatePark = {
  create: (req: Request, res: Response, next: NextFunction) => {
    const { name, location, description } = req.body;
    
    if (!name || !location || !description) {
      return res.status(400).json({
        success: false,
        message: '请提供园区名称、位置和描述'
      });
    }
    
    next();
  }
};

export const validatePolicy = {
  create: (req: Request, res: Response, next: NextFunction) => {
    const { title, content, category } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: '请提供政策标题、内容和分类'
      });
    }
    
    next();
  }
};

export const validateProject = {
  create: (req: Request, res: Response, next: NextFunction) => {
    const { title, description, category } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: '请提供项目标题、描述和分类'
      });
    }
    
    next();
  },

  apply: (req: Request, res: Response, next: NextFunction) => {
    const { projectId, message } = req.body;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: '请提供项目ID'
      });
    }
    
    next();
  }
};

export const validateJob = {
  create: (req: Request, res: Response, next: NextFunction) => {
    const { title, description, requirements, salary } = req.body;
    
    if (!title || !description || !requirements) {
      return res.status(400).json({
        success: false,
        message: '请提供职位标题、描述和要求'
      });
    }
    
    next();
  },

  apply: (req: Request, res: Response, next: NextFunction) => {
    const { jobId, message } = req.body;
    
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: '请提供职位ID'
      });
    }
    
    next();
  }
};