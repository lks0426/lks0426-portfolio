#!/bin/bash

# Deploy script for AWS ECS
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
ECR_REPOSITORY=${ECR_REPOSITORY:-lks0426-portfolio}
ECS_CLUSTER=${ECS_CLUSTER:-lks0426-cluster}
ECS_SERVICE=${ECS_SERVICE:-lks0426-portfolio-service}

echo -e "${GREEN}🚀 Starting deployment to AWS ECS${NC}"

# Build and push Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t $ECR_REPOSITORY:latest .

# Get ECR login token
echo -e "${YELLOW}Logging in to ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Tag and push image
echo -e "${YELLOW}Pushing image to ECR...${NC}"
IMAGE_URI=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
docker tag $ECR_REPOSITORY:latest $IMAGE_URI
docker push $IMAGE_URI

# Update ECS service
echo -e "${YELLOW}Updating ECS service...${NC}"
aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ECS_SERVICE \
    --force-new-deployment \
    --region $AWS_REGION

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}Service: $ECS_SERVICE${NC}"
echo -e "${GREEN}Cluster: $ECS_CLUSTER${NC}"
echo -e "${GREEN}Image: $IMAGE_URI${NC}"