# 逍遥人才网

综合性人才服务平台，提供园区展示、政策发布、创业项目申报、工作机会等服务。

## 项目特性

- 🏢 **园区展示**: 中国各省市工业园区和开发区展示介绍
- 📋 **政策发布**: 各地区招商引资政策、人才政策发布
- 🚀 **创业项目**: 创业人才项目发布和申报
- 💼 **工作机会**: 企业和科研院所工作机会发布
- 👥 **会员系统**: 用户注册、认证和管理
- 📝 **申报系统**: 项目申报和职位申请
- 🔧 **后台管理**: 完整的管理员后台系统
- 📱 **跨平台**: 支持PC端、手机端、平板端
- ⚡ **高性能**: 支持1000人同时在线

## 技术栈

### 前端
- React 18 + TypeScript
- Ant Design + Tailwind CSS
- Redux Toolkit + RTK Query
- React Router v6
- Vite

### 后端
- Node.js + Express.js + TypeScript
- MySQL 8.0 + Prisma ORM
- JWT认证 + bcrypt加密
- Redis缓存
- Winston日志

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 6.0

### 安装依赖
```bash
# 安装所有依赖
npm run install:all

# 或者分别安装
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 环境配置
```bash
# 复制环境变量文件
cp backend/.env.example backend/.env

# 编辑环境变量
# 配置数据库连接、JWT密钥等
```

### 数据库设置
```bash
cd backend

# 生成Prisma客户端
npm run db:generate

# 推送数据库schema
npm run db:push

# 运行数据库迁移
npm run db:migrate

# 填充初始数据
npm run db:seed
```

### 启动开发服务器
```bash
# 同时启动前后端
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端: http://localhost:3000
npm run dev:backend   # 后端: http://localhost:5000
```

## 项目结构

```
逍遥人才网/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/       # 通用组件
│   │   ├── pages/           # 页面组件
│   │   ├── store/           # Redux store
│   │   ├── hooks/           # 自定义hooks
│   │   └── utils/           # 工具函数
│   └── package.json
├── backend/                  # 后端项目
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── routes/          # 路由
│   │   ├── middleware/      # 中间件
│   │   ├── services/        # 业务逻辑
│   │   └── utils/           # 工具函数
│   ├── prisma/              # 数据库schema
│   └── package.json
└── README.md
```

## 开发计划

- [x] 第一阶段：基础架构搭建
- [ ] 第二阶段：核心功能开发
- [ ] 第三阶段：申报系统开发
- [ ] 第四阶段：后台管理系统
- [ ] 第五阶段：优化和测试

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系我们

- 项目地址: [GitHub](https://github.com/your-username/xiaoyao-talent-network)
- 问题反馈: [Issues](https://github.com/your-username/xiaoyao-talent-network/issues)
- 邮箱: contact@xiaoyao-talent.com