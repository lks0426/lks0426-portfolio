#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PortfolioInfrastructureStack } from '../lib/portfolio-infrastructure-stack';

const app = new cdk.App();

// Environment configuration
const environments = {
  dev: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  staging: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  prod: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
};

// Configuration
const config = {
  domainName: 'lks0426.com',
  dockerImage: 'lks0426/lks0426-portfolio:latest',
};

// Development Stack
new PortfolioInfrastructureStack(app, 'LKS0426-Portfolio-Dev', {
  ...config,
  environment: 'dev',
  env: environments.dev,
  description: 'LKS0426 Portfolio Development Infrastructure',
  tags: {
    Environment: 'dev',
    Project: 'lks0426-portfolio',
    Owner: 'lks0426',
    CostCenter: 'development',
  },
});

// Staging Stack
new PortfolioInfrastructureStack(app, 'LKS0426-Portfolio-Staging', {
  ...config,
  environment: 'staging',
  env: environments.staging,
  description: 'LKS0426 Portfolio Staging Infrastructure',
  tags: {
    Environment: 'staging',
    Project: 'lks0426-portfolio',
    Owner: 'lks0426',
    CostCenter: 'staging',
  },
});

// Production Stack
new PortfolioInfrastructureStack(app, 'LKS0426-Portfolio-Prod', {
  ...config,
  environment: 'prod',
  env: environments.prod,
  description: 'LKS0426 Portfolio Production Infrastructure',
  tags: {
    Environment: 'prod',
    Project: 'lks0426-portfolio',
    Owner: 'lks0426',
    CostCenter: 'production',
  },
});

app.synth();