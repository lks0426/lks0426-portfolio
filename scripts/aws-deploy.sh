#!/bin/bash

# AWS ECS Deployment Script
# Deploys the portfolio application to AWS ECS with complete infrastructure setup

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${ENVIRONMENT:-prod}
AWS_REGION=${AWS_REGION:-us-east-1}
DOCKER_IMAGE=${DOCKER_IMAGE:-lks0426/lks0426-portfolio:latest}
DOMAIN_NAME=${DOMAIN_NAME:-lks0426.com}
STACK_NAME="LKS0426-Portfolio-${ENVIRONMENT^}"

echo -e "${BLUE}🚀 Starting AWS ECS Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Region: ${AWS_REGION}${NC}"
echo -e "${BLUE}Domain: ${DOMAIN_NAME}${NC}"
echo -e "${BLUE}Docker Image: ${DOCKER_IMAGE}${NC}"

# Check AWS CLI configuration
echo -e "${YELLOW}🔐 Checking AWS configuration...${NC}"
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not configured or invalid credentials${NC}"
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✅ AWS Account: ${AWS_ACCOUNT_ID}${NC}"

# Check if CDK is installed
echo -e "${YELLOW}📦 Checking AWS CDK installation...${NC}"
if ! command -v cdk >/dev/null 2>&1; then
    echo -e "${YELLOW}⚡ Installing AWS CDK...${NC}"
    npm install -g aws-cdk
fi

CDK_VERSION=$(cdk --version)
echo -e "${GREEN}✅ CDK Version: ${CDK_VERSION}${NC}"

# Bootstrap CDK (if not already done)
echo -e "${YELLOW}🔧 Bootstrapping CDK environment...${NC}"
cdk bootstrap aws://${AWS_ACCOUNT_ID}/${AWS_REGION} || true

# Create secrets in AWS Secrets Manager
echo -e "${YELLOW}🔑 Setting up AWS Secrets Manager...${NC}"

# Check if secrets exist, create if they don't
check_and_create_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if aws secretsmanager describe-secret --secret-id "${secret_name}" --region "${AWS_REGION}" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Secret ${secret_name} already exists${NC}"
    else
        echo -e "${YELLOW}📝 Creating secret ${secret_name}...${NC}"
        aws secretsmanager create-secret \
            --name "${secret_name}" \
            --secret-string "${secret_value}" \
            --region "${AWS_REGION}"
        echo -e "${GREEN}✅ Secret ${secret_name} created${NC}"
    fi
}

# Create secrets (use placeholder values if environment variables not set)
check_and_create_secret "lks0426-portfolio/supabase-url" "${NEXT_PUBLIC_SUPABASE_URL:-https://your-project.supabase.co}"
check_and_create_secret "lks0426-portfolio/supabase-anon-key" "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-your-anon-key-here}"

# Navigate to CDK directory
cd infrastructure/aws-cdk

# Install CDK dependencies
echo -e "${YELLOW}📦 Installing CDK dependencies...${NC}"
npm install

# Build CDK project
echo -e "${YELLOW}🔨 Building CDK project...${NC}"
npm run build

# Synthesize CloudFormation template
echo -e "${YELLOW}📋 Synthesizing CloudFormation template...${NC}"
cdk synth ${STACK_NAME}

# Deploy infrastructure
echo -e "${YELLOW}🚀 Deploying infrastructure to AWS...${NC}"
cdk deploy ${STACK_NAME} \
    --require-approval never \
    --parameters dockerImage=${DOCKER_IMAGE} \
    --outputs-file cdk-outputs.json

# Check deployment status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Infrastructure deployed successfully!${NC}"
    
    # Display outputs
    if [ -f cdk-outputs.json ]; then
        echo -e "${GREEN}📋 Deployment Outputs:${NC}"
        cat cdk-outputs.json | jq '.'
        
        # Extract important URLs
        WEBSITE_URL=$(cat cdk-outputs.json | jq -r '.["'${STACK_NAME}'"].WebsiteURL // empty')
        ALB_DNS=$(cat cdk-outputs.json | jq -r '.["'${STACK_NAME}'"].LoadBalancerDNS // empty')
        CLOUDFRONT_DOMAIN=$(cat cdk-outputs.json | jq -r '.["'${STACK_NAME}'"].CloudFrontDistributionDomain // empty')
        
        echo -e "${GREEN}🌐 Website URL: ${WEBSITE_URL}${NC}"
        echo -e "${GREEN}⚖️  Load Balancer: ${ALB_DNS}${NC}"
        echo -e "${GREEN}☁️  CloudFront: ${CLOUDFRONT_DOMAIN}${NC}"
    fi
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

# Wait for service to be stable
echo -e "${YELLOW}⏳ Waiting for ECS service to stabilize...${NC}"
ECS_CLUSTER_NAME=$(cat cdk-outputs.json | jq -r '.["'${STACK_NAME}'"].ECSClusterName // empty')
ECS_SERVICE_NAME=$(cat cdk-outputs.json | jq -r '.["'${STACK_NAME}'"].ECSServiceName // empty')

if [ ! -z "${ECS_CLUSTER_NAME}" ] && [ ! -z "${ECS_SERVICE_NAME}" ]; then
    aws ecs wait services-stable \
        --cluster "${ECS_CLUSTER_NAME}" \
        --services "${ECS_SERVICE_NAME}" \
        --region "${AWS_REGION}"
    
    echo -e "${GREEN}✅ ECS service is stable and healthy!${NC}"
else
    echo -e "${YELLOW}⚠️  Could not determine ECS cluster/service names from outputs${NC}"
fi

# Health check
echo -e "${YELLOW}🏥 Performing health check...${NC}"
if [ ! -z "${WEBSITE_URL}" ]; then
    # Wait a bit for DNS propagation
    sleep 30
    
    if curl -f "${WEBSITE_URL}/api/health" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check failed - service may still be starting${NC}"
    fi
fi

# Cleanup
cd ../../

echo -e "${GREEN}🎉 AWS ECS Deployment completed successfully!${NC}"
echo -e "${GREEN}🌍 Your portfolio is now live at: ${WEBSITE_URL}${NC}"

# Display next steps
echo -e "${BLUE}📝 Next Steps:${NC}"
echo -e "${BLUE}1. Update DNS records if needed${NC}"
echo -e "${BLUE}2. Configure monitoring and alerts${NC}"
echo -e "${BLUE}3. Set up CI/CD pipeline${NC}"
echo -e "${BLUE}4. Test auto-scaling policies${NC}"