#\!/bin/bash

# 🚀 LKS0426 Portfolio - 一键部署脚本
# 使用说明：./quick-deploy.sh

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
AWS_REGION="ap-northeast-1"
ECR_REPOSITORY="lks0426-portfolio"
ECS_SERVICE="lks0426-service"
ECS_CLUSTER="lks0426-cluster"
DOCKERFILE="Dockerfile.simple-fixed"

echo -e "${BLUE}🚀 开始一键部署 LKS0426 Portfolio${NC}"
echo -e "${BLUE}================================${NC}"

# 步骤1：构建Docker镜像
echo -e "\n${YELLOW}📦 步骤1: 构建Docker镜像...${NC}"
IMAGE_TAG=$(date +%Y%m%d-%H%M%S)
ECR_URI="345289096628.dkr.ecr.${AWS_REGION}.amazonaws.com"
FULL_IMAGE_NAME="${ECR_URI}/${ECR_REPOSITORY}:${IMAGE_TAG}"

docker build -f ${DOCKERFILE} -t ${FULL_IMAGE_NAME} .
docker tag ${FULL_IMAGE_NAME} ${ECR_URI}/${ECR_REPOSITORY}:latest

echo -e "${GREEN}✅ 镜像构建完成: ${FULL_IMAGE_NAME}${NC}"

# 步骤2：登录ECR并推送镜像
echo -e "\n${YELLOW}🔐 步骤2: 登录ECR并推送镜像...${NC}"
aws ecr get-login-password --region ${AWS_REGION}  < /dev/null |  docker login --username AWS --password-stdin ${ECR_URI}

docker push ${FULL_IMAGE_NAME}
docker push ${ECR_URI}/${ECR_REPOSITORY}:latest

echo -e "${GREEN}✅ 镜像推送完成${NC}"

# 步骤3：更新ECS服务
echo -e "\n${YELLOW}🔄 步骤3: 更新ECS服务...${NC}"
aws ecs update-service \
  --cluster ${ECS_CLUSTER} \
  --service ${ECS_SERVICE} \
  --force-new-deployment \
  --region ${AWS_REGION} > /dev/null

echo -e "${GREEN}✅ ECS服务更新已触发${NC}"

# 步骤4：等待部署完成
echo -e "\n${YELLOW}⏳ 步骤4: 等待部署完成...${NC}"
echo "正在等待服务稳定..."

aws ecs wait services-stable \
  --cluster ${ECS_CLUSTER} \
  --services ${ECS_SERVICE} \
  --region ${AWS_REGION}

echo -e "${GREEN}✅ 部署完成！${NC}"

# 显示结果
echo -e "\n${BLUE}🎉 部署成功完成！${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "🌐 网站地址: ${GREEN}https://lks0426.com${NC}"
echo -e "📊 ECS控制台: ${GREEN}https://console.aws.amazon.com/ecs/home?region=${AWS_REGION}${NC}"
echo -e "🐳 镜像版本: ${GREEN}${IMAGE_TAG}${NC}"

# 测试网站
echo -e "\n${YELLOW}🧪 测试网站响应...${NC}"
if curl -s -o /dev/null -w "%{http_code}" https://lks0426.com | grep -q "200"; then
    echo -e "${GREEN}✅ 网站正常运行${NC}"
else
    echo -e "${RED}⚠️  网站可能还在启动中，请稍等片刻${NC}"
fi

echo -e "\n${GREEN}🎯 部署流程完成！您的网站已更新到最新版本${NC}"
