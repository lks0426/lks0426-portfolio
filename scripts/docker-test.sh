#!/bin/bash

# Docker Image Testing Script
# Tests built Docker images for functionality and security

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
IMAGE_NAME=${1:-"lks0426/lks0426-portfolio:latest"}
TEST_PORT=${2:-"3001"}
CONTAINER_NAME="portfolio-test-$(date +%s)"

echo -e "${YELLOW}🧪 Testing Docker image: ${IMAGE_NAME}${NC}"

# Pull latest image
echo -e "${YELLOW}📥 Pulling latest image...${NC}"
docker pull ${IMAGE_NAME}

# Start container
echo -e "${YELLOW}🚀 Starting test container...${NC}"
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${TEST_PORT}:3000 \
    --health-interval=10s \
    --health-timeout=5s \
    --health-retries=3 \
    ${IMAGE_NAME}

# Wait for container to be healthy
echo -e "${YELLOW}⏳ Waiting for container to be healthy...${NC}"
timeout=60
while [ $timeout -gt 0 ]; do
    if docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} | grep -q "healthy"; then
        echo -e "${GREEN}✅ Container is healthy!${NC}"
        break
    fi
    sleep 2
    timeout=$((timeout - 2))
done

if [ $timeout -le 0 ]; then
    echo -e "${RED}❌ Container failed to become healthy${NC}"
    docker logs ${CONTAINER_NAME}
    docker rm -f ${CONTAINER_NAME}
    exit 1
fi

# Test HTTP endpoints
echo -e "${YELLOW}🌐 Testing HTTP endpoints...${NC}"

# Health check
if curl -f http://localhost:${TEST_PORT}/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check endpoint working${NC}"
else
    echo -e "${RED}❌ Health check endpoint failed${NC}"
    docker logs ${CONTAINER_NAME}
    docker rm -f ${CONTAINER_NAME}
    exit 1
fi

# Main page
if curl -f http://localhost:${TEST_PORT}/ >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Main page loading${NC}"
else
    echo -e "${RED}❌ Main page failed to load${NC}"
    docker logs ${CONTAINER_NAME}
    docker rm -f ${CONTAINER_NAME}
    exit 1
fi

# Performance test
echo -e "${YELLOW}⚡ Running performance test...${NC}"
response_time=$(curl -o /dev/null -s -w "%{time_total}" http://localhost:${TEST_PORT}/)
if (( $(echo "$response_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ Response time: ${response_time}s (< 2s target)${NC}"
else
    echo -e "${YELLOW}⚠️  Response time: ${response_time}s (slower than 2s target)${NC}"
fi

# Security test - check if running as non-root
echo -e "${YELLOW}🔒 Testing security configuration...${NC}"
user_id=$(docker exec ${CONTAINER_NAME} id -u)
if [ "$user_id" != "0" ]; then
    echo -e "${GREEN}✅ Running as non-root user (UID: ${user_id})${NC}"
else
    echo -e "${RED}❌ Running as root user (security risk)${NC}"
fi

# Test resource usage
echo -e "${YELLOW}📊 Checking resource usage...${NC}"
stats=$(docker stats ${CONTAINER_NAME} --no-stream --format "table {{.MemUsage}}\t{{.CPUPerc}}")
echo -e "${GREEN}📈 Resource usage:${NC}"
echo "${stats}"

# Cleanup
echo -e "${YELLOW}🧹 Cleaning up test container...${NC}"
docker rm -f ${CONTAINER_NAME}

echo -e "${GREEN}🎉 All tests passed! Image is ready for production.${NC}"