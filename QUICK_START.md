# ⚡ 快速启动指南

> **重新连接后立即执行的步骤**

## 🚀 一键部署 (断网后首选)

```bash
# 1. 进入项目目录
cd /home/ubuntu/lks0426-portfolio

# 2. 设置环境变量
export AWS_REGION=us-east-1
export DOMAIN_NAME=lks0426.com
export DOCKER_USERNAME=lks0426
export ALERT_EMAIL=your-email@example.com

# 3. 一键完整部署
./scripts/master-deploy.sh
```

## ⚡ 5分钟验证清单

- [ ] 项目文件完整: `ls -la`
- [ ] AWS凭证: `aws sts get-caller-identity` 
- [ ] Docker登录: `docker login`
- [ ] 本地测试: `npm run dev`
- [ ] 执行部署: `./scripts/master-deploy.sh`

## 🎯 预期结果

- **部署时间**: 30-45分钟
- **网站地址**: https://lks0426.com
- **健康检查**: https://lks0426.com/api/health
- **月成本**: ~$46

## 📞 如有问题

查看 `PROJECT_MEMORY.md` 完整记录！