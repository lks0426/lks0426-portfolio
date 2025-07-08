#!/bin/bash

# Docker Hub Multi-Architecture Build Script
# Supports automated builds with proper tagging and security scanning

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_REGISTRY=${DOCKER_REGISTRY:-docker.io}
DOCKER_USERNAME=${DOCKER_USERNAME:-lks0426}
DOCKER_REPOSITORY=${DOCKER_REPOSITORY:-lks0426-portfolio}
DOCKERFILE=${DOCKERFILE:-Dockerfile.production}

# Build metadata
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
COMMIT_SHA=${COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null || echo "unknown")}
VERSION=${VERSION:-$(git describe --tags --always 2>/dev/null || echo "latest")}
BUILD_ID=${BUILD_ID:-$(date +%s)}

# Image tags
IMAGE_NAME="${DOCKER_REGISTRY}/${DOCKER_USERNAME}/${DOCKER_REPOSITORY}"
TAGS=(
    "${IMAGE_NAME}:latest"
    "${IMAGE_NAME}:${VERSION}"
    "${IMAGE_NAME}:${COMMIT_SHA:0:8}"
    "${IMAGE_NAME}:build-${BUILD_ID}"
)

echo -e "${BLUE}🐳 Starting Docker Multi-Architecture Build${NC}"
echo -e "${BLUE}Repository: ${IMAGE_NAME}${NC}"
echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}Commit: ${COMMIT_SHA:0:8}${NC}"
echo -e "${BLUE}Build Date: ${BUILD_DATE}${NC}"

# Check if buildx is available
if ! docker buildx version >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker Buildx is required for multi-architecture builds${NC}"
    exit 1
fi

# Create and use buildx builder
echo -e "${YELLOW}📦 Setting up Docker Buildx builder...${NC}"
BUILDER_NAME="portfolio-builder"
if ! docker buildx inspect ${BUILDER_NAME} >/dev/null 2>&1; then
    docker buildx create --name ${BUILDER_NAME} --driver docker-container --bootstrap
fi
docker buildx use ${BUILDER_NAME}

# Check Docker Hub authentication
echo -e "${YELLOW}🔐 Checking Docker Hub authentication...${NC}"
if ! docker info | grep -q "Username:"; then
    echo -e "${RED}❌ Not logged in to Docker Hub. Please run 'docker login'${NC}"
    exit 1
fi

# Build tag arguments
TAG_ARGS=""
for tag in "${TAGS[@]}"; do
    TAG_ARGS="${TAG_ARGS} -t ${tag}"
done

# Build arguments
BUILD_ARGS=(
    --platform linux/amd64,linux/arm64
    --file ${DOCKERFILE}
    --build-arg BUILD_DATE="${BUILD_DATE}"
    --build-arg VERSION="${VERSION}"
    --build-arg COMMIT_SHA="${COMMIT_SHA}"
    --build-arg BUILD_ID="${BUILD_ID}"
    --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"
    --build-arg NEXT_PUBLIC_VERCEL_ANALYTICS_ID="${NEXT_PUBLIC_VERCEL_ANALYTICS_ID:-}"
    --build-arg NEXT_PUBLIC_SENTRY_DSN="${NEXT_PUBLIC_SENTRY_DSN:-}"
    --push
    --provenance=true
    --sbom=true
)

# Build and push multi-architecture image
echo -e "${YELLOW}🏗️  Building and pushing multi-architecture images...${NC}"
docker buildx build \
    ${TAG_ARGS} \
    "${BUILD_ARGS[@]}" \
    .

echo -e "${GREEN}✅ Multi-architecture build completed successfully!${NC}"

# Display pushed tags
echo -e "${GREEN}📦 Pushed tags:${NC}"
for tag in "${TAGS[@]}"; do
    echo -e "${GREEN}  - ${tag}${NC}"
done

# Security scanning (if available)
if command -v docker >/dev/null 2>&1; then
    echo -e "${YELLOW}🔍 Running security scan...${NC}"
    if docker scout quickview "${IMAGE_NAME}:latest" 2>/dev/null; then
        docker scout recommendations "${IMAGE_NAME}:latest"
    else
        echo -e "${YELLOW}⚠️  Docker Scout not available - skipping security scan${NC}"
    fi
fi

# Clean up builder if created locally
if [[ "${CI:-false}" == "true" ]]; then
    echo -e "${YELLOW}🧹 Cleaning up buildx builder...${NC}"
    docker buildx rm ${BUILDER_NAME} || true
fi

echo -e "${GREEN}🎉 Docker Hub deployment completed!${NC}"
echo -e "${GREEN}Image: ${IMAGE_NAME}:latest${NC}"
echo -e "${GREEN}Registry: ${DOCKER_REGISTRY}${NC}"