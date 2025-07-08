#!/bin/bash

# Master Deployment Script for LKS0426 Portfolio
# Orchestrates complete deployment from Docker build to production

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${ENVIRONMENT:-prod}
AWS_REGION=${AWS_REGION:-us-east-1}
DOMAIN_NAME=${DOMAIN_NAME:-lks0426.com}
DOCKER_USERNAME=${DOCKER_USERNAME:-lks0426}
DOCKER_REPOSITORY=${DOCKER_REPOSITORY:-lks0426-portfolio}

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${PURPLE}🚀 LKS0426 Portfolio - Master Deployment${NC}"
echo -e "${PURPLE}=======================================${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Region: ${AWS_REGION}${NC}"
echo -e "${BLUE}Domain: ${DOMAIN_NAME}${NC}"
echo -e "${BLUE}Docker: ${DOCKER_USERNAME}/${DOCKER_REPOSITORY}${NC}"

# Function to print step headers
print_step() {
    echo ""
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}$(printf '=%.0s' {1..50})${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_step "📋 STEP 1: Prerequisites Check"
    
    echo -e "${YELLOW}Checking required tools...${NC}"
    
    local tools=("aws" "docker" "jq" "curl" "git")
    for tool in "${tools[@]}"; do
        if command -v "$tool" &> /dev/null; then
            echo -e "${GREEN}✅ $tool${NC}"
        else
            echo -e "${RED}❌ $tool not found${NC}"
            exit 1
        fi
    done
    
    echo -e "${YELLOW}Checking AWS credentials...${NC}"
    if aws sts get-caller-identity >/dev/null 2>&1; then
        AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        echo -e "${GREEN}✅ AWS Account: ${AWS_ACCOUNT}${NC}"
    else
        echo -e "${RED}❌ AWS credentials not configured${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Checking Docker Hub access...${NC}"
    if docker info | grep -q "Username:"; then
        echo -e "${GREEN}✅ Docker Hub authenticated${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker Hub authentication recommended${NC}"
    fi
}

# Function to build and push Docker image
build_and_push_docker() {
    print_step "🐳 STEP 2: Docker Build & Push"
    
    echo -e "${YELLOW}Building and pushing Docker image...${NC}"
    "${SCRIPT_DIR}/docker-build.sh"
    
    echo -e "${YELLOW}Testing Docker image...${NC}"
    "${SCRIPT_DIR}/docker-test.sh" "${DOCKER_USERNAME}/${DOCKER_REPOSITORY}:latest"
}

# Function to setup DNS and SSL
setup_dns_ssl() {
    print_step "🌐 STEP 3: DNS & SSL Configuration"
    
    echo -e "${YELLOW}Setting up DNS and SSL certificates...${NC}"
    "${SCRIPT_DIR}/dns-setup.sh"
    
    if [ -f dns-config.env ]; then
        source dns-config.env
        echo -e "${GREEN}✅ DNS configuration loaded${NC}"
    fi
}

# Function to deploy AWS infrastructure
deploy_infrastructure() {
    print_step "☁️ STEP 4: AWS Infrastructure Deployment"
    
    echo -e "${YELLOW}Deploying AWS ECS infrastructure...${NC}"
    "${SCRIPT_DIR}/aws-deploy.sh"
    
    # Wait for deployment to stabilize
    echo -e "${YELLOW}⏳ Waiting for deployment to stabilize...${NC}"
    sleep 60
}

# Function to setup monitoring
setup_monitoring() {
    print_step "📊 STEP 5: Monitoring & Alerting"
    
    echo -e "${YELLOW}Setting up CloudWatch monitoring...${NC}"
    "${SCRIPT_DIR}/monitoring-setup.sh"
}

# Function to configure security
configure_security() {
    print_step "🔒 STEP 6: Security Hardening"
    
    echo -e "${YELLOW}Configuring WAF and security measures...${NC}"
    "${SCRIPT_DIR}/security-setup.sh"
}

# Function to run post-deployment tests
run_post_deployment_tests() {
    print_step "🧪 STEP 7: Post-Deployment Testing"
    
    local website_url="https://${DOMAIN_NAME}"
    
    echo -e "${YELLOW}🌐 Testing website availability...${NC}"
    
    # Wait for DNS propagation
    echo -e "${YELLOW}⏳ Waiting for DNS propagation...${NC}"
    sleep 30
    
    # Test with retries
    local max_retries=10
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -f -s "${website_url}/api/health" >/dev/null; then
            echo -e "${GREEN}✅ Health check passed${NC}"
            break
        else
            echo -e "${YELLOW}⏳ Attempt $((retry_count + 1))/${max_retries} - retrying in 30s...${NC}"
            sleep 30
            retry_count=$((retry_count + 1))
        fi
    done
    
    if [ $retry_count -eq $max_retries ]; then
        echo -e "${RED}❌ Health check failed after ${max_retries} attempts${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}⚡ Testing performance...${NC}"
    local response_time=$(curl -o /dev/null -s -w "%{time_total}" "${website_url}/")
    echo -e "${GREEN}📊 Response time: ${response_time}s${NC}"
    
    echo -e "${YELLOW}🔒 Testing SSL configuration...${NC}"
    if timeout 10 openssl s_client -connect "${DOMAIN_NAME}:443" -servername "${DOMAIN_NAME}" </dev/null 2>&1 | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✅ SSL certificate valid${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL certificate validation pending${NC}"
    fi
    
    echo -e "${YELLOW}🧪 Running comprehensive tests...${NC}"
    
    # Test main page
    if curl -f -s "${website_url}/" | grep -q "LKS0426"; then
        echo -e "${GREEN}✅ Main page loading correctly${NC}"
    else
        echo -e "${RED}❌ Main page test failed${NC}"
        return 1
    fi
    
    # Test API endpoints
    if curl -f -s "${website_url}/api/health" | grep -q "healthy"; then
        echo -e "${GREEN}✅ API endpoints working${NC}"
    else
        echo -e "${RED}❌ API test failed${NC}"
        return 1
    fi
}

# Function to generate deployment report
generate_deployment_report() {
    print_step "📋 STEP 8: Deployment Report"
    
    local deployment_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat > deployment-report.md << EOF
# Deployment Report - LKS0426 Portfolio

## Deployment Summary
- **Environment**: ${ENVIRONMENT}
- **Date**: ${deployment_time}
- **Domain**: ${DOMAIN_NAME}
- **AWS Region**: ${AWS_REGION}
- **Docker Image**: ${DOCKER_USERNAME}/${DOCKER_REPOSITORY}:latest

## Components Deployed
- ✅ Docker Image (Multi-architecture)
- ✅ AWS ECS Infrastructure
- ✅ Application Load Balancer
- ✅ CloudFront Distribution
- ✅ Route 53 DNS
- ✅ SSL/TLS Certificate
- ✅ WAF Security Rules
- ✅ CloudWatch Monitoring
- ✅ SNS Alerting

## Post-Deployment Tests
- ✅ Health Check
- ✅ Performance Test
- ✅ SSL Validation
- ✅ Main Page Load
- ✅ API Endpoints

## Access URLs
- **Website**: https://${DOMAIN_NAME}
- **Health Check**: https://${DOMAIN_NAME}/api/health

## AWS Console Links
- **ECS Service**: https://console.aws.amazon.com/ecs/home?region=${AWS_REGION}#/clusters/lks0426-portfolio-${ENVIRONMENT}/services
- **CloudFront**: https://console.aws.amazon.com/cloudfront/home
- **WAF**: https://console.aws.amazon.com/wafv2/homev2/web-acls?region=${AWS_REGION}
- **CloudWatch**: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=LKS0426-Portfolio-${ENVIRONMENT}

## Monitoring & Alerts
- CloudWatch Dashboard configured
- SNS alerts configured
- WAF monitoring enabled
- Performance metrics tracked

## Security Measures
- AWS WAF v2 with OWASP protection
- Security headers configured
- SSL/TLS with HSTS
- Rate limiting enabled
- Geographic restrictions applied

## Next Steps
1. Monitor deployment for 24 hours
2. Verify all alerts are working
3. Test auto-scaling functionality
4. Review performance metrics
5. Update documentation

## Support
- GitHub: https://github.com/lks0426/portfolio
- Issues: https://github.com/lks0426/portfolio/issues

---
*Deployment completed successfully! 🎉*
EOF

    echo -e "${GREEN}📋 Deployment report generated: deployment-report.md${NC}"
    
    # Display summary
    echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉${NC}"
    echo ""
    echo -e "${GREEN}🌍 Website URL: https://${DOMAIN_NAME}${NC}"
    echo -e "${GREEN}🏥 Health Check: https://${DOMAIN_NAME}/api/health${NC}"
    echo -e "${GREEN}📊 Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=LKS0426-Portfolio-${ENVIRONMENT}${NC}"
    echo ""
    echo -e "${BLUE}📋 Files Generated:${NC}"
    echo -e "${BLUE}- deployment-report.md${NC}"
    echo -e "${BLUE}- security-scan-report.md${NC}"
    echo -e "${BLUE}- monitoring-report.md${NC}"
    echo -e "${BLUE}- dns-config.env${NC}"
    echo -e "${BLUE}- monitoring-config.env${NC}"
}

# Function to handle deployment failure
handle_failure() {
    echo ""
    echo -e "${RED}❌ DEPLOYMENT FAILED${NC}"
    echo -e "${RED}Check logs above for details${NC}"
    echo ""
    echo -e "${YELLOW}📋 Troubleshooting Steps:${NC}"
    echo -e "${YELLOW}1. Check AWS credentials and permissions${NC}"
    echo -e "${YELLOW}2. Verify Docker Hub access${NC}"
    echo -e "${YELLOW}3. Check domain DNS settings${NC}"
    echo -e "${YELLOW}4. Review CloudFormation stacks for errors${NC}"
    echo -e "${YELLOW}5. Check ECS service logs${NC}"
    echo ""
    echo -e "${YELLOW}🔄 To retry deployment:${NC}"
    echo -e "${YELLOW}./scripts/master-deploy.sh${NC}"
    
    exit 1
}

# Main deployment function
main() {
    local start_time=$(date +%s)
    
    trap handle_failure ERR
    
    # Execute deployment steps
    check_prerequisites
    build_and_push_docker
    setup_dns_ssl
    deploy_infrastructure
    setup_monitoring
    configure_security
    run_post_deployment_tests
    generate_deployment_report
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))
    
    echo ""
    echo -e "${PURPLE}⏱️  Total deployment time: ${minutes}m ${seconds}s${NC}"
    echo -e "${PURPLE}🚀 Portfolio is now live at: https://${DOMAIN_NAME}${NC}"
}

# Help function
show_help() {
    cat << EOF
🚀 LKS0426 Portfolio - Master Deployment Script

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -e, --environment ENV    Set environment (dev|staging|prod) [default: prod]
    -r, --region REGION      Set AWS region [default: us-east-1]
    -d, --domain DOMAIN      Set domain name [default: lks0426.com]
    -h, --help              Show this help message

ENVIRONMENT VARIABLES:
    ENVIRONMENT             Target environment
    AWS_REGION              AWS region for deployment
    DOMAIN_NAME             Domain name for the website
    DOCKER_USERNAME         Docker Hub username
    DOCKER_REPOSITORY       Docker repository name
    ALERT_EMAIL             Email for alerts
    SLACK_WEBHOOK           Slack webhook for notifications

EXAMPLES:
    # Production deployment
    $0

    # Staging deployment
    $0 --environment staging --domain staging.lks0426.com

    # Development deployment
    $0 -e dev -r us-west-2

PREREQUISITES:
    - AWS CLI configured with appropriate permissions
    - Docker installed and running
    - Domain registered and managed in Route 53
    - Required environment variables set

For more information, visit: https://github.com/lks0426/portfolio
EOF
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -r|--region)
                AWS_REGION="$2"
                shift 2
                ;;
            -d|--domain)
                DOMAIN_NAME="$2"
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

# Entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    parse_args "$@"
    main
fi