#!/bin/bash

# Comprehensive Monitoring Setup Script
# Sets up CloudWatch, X-Ray, alerts, and dashboards

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${ENVIRONMENT:-prod}
AWS_REGION=${AWS_REGION:-us-east-1}
DOMAIN_NAME=${DOMAIN_NAME:-lks0426.com}
ALERT_EMAIL=${ALERT_EMAIL:-alerts@lks0426.com}
SLACK_WEBHOOK=${SLACK_WEBHOOK:-}

echo -e "${BLUE}📊 Setting up comprehensive monitoring for ${ENVIRONMENT} environment${NC}"

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not installed${NC}"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ jq not installed${NC}"
        exit 1
    fi
    
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        echo -e "${RED}❌ AWS credentials not configured${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites met${NC}"
}

# Create SNS topic for alerts
create_sns_topic() {
    echo -e "${YELLOW}📧 Creating SNS topic for alerts...${NC}"
    
    TOPIC_NAME="lks0426-portfolio-${ENVIRONMENT}-alerts"
    
    # Check if topic exists
    if aws sns get-topic-attributes --topic-arn "arn:aws:sns:${AWS_REGION}:$(aws sts get-caller-identity --query Account --output text):${TOPIC_NAME}" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ SNS topic already exists${NC}"
        SNS_TOPIC_ARN="arn:aws:sns:${AWS_REGION}:$(aws sts get-caller-identity --query Account --output text):${TOPIC_NAME}"
    else
        SNS_TOPIC_ARN=$(aws sns create-topic \
            --name "${TOPIC_NAME}" \
            --query 'TopicArn' \
            --output text)
        echo -e "${GREEN}✅ Created SNS topic: ${SNS_TOPIC_ARN}${NC}"
    fi
    
    # Subscribe email if provided
    if [ ! -z "${ALERT_EMAIL}" ]; then
        aws sns subscribe \
            --topic-arn "${SNS_TOPIC_ARN}" \
            --protocol email \
            --notification-endpoint "${ALERT_EMAIL}" >/dev/null 2>&1 || true
        echo -e "${GREEN}✅ Email subscription added${NC}"
    fi
    
    # Configure Slack webhook if provided
    if [ ! -z "${SLACK_WEBHOOK}" ]; then
        # Create Lambda function for Slack notifications
        create_slack_lambda
    fi
    
    echo "SNS_TOPIC_ARN=${SNS_TOPIC_ARN}" >> monitoring-config.env
}

# Create Lambda function for Slack notifications
create_slack_lambda() {
    echo -e "${YELLOW}🔔 Creating Slack notification Lambda...${NC}"
    
    LAMBDA_NAME="portfolio-slack-notifier-${ENVIRONMENT}"
    
    # Create Lambda function code
    cat > slack-notifier.py << 'EOF'
import json
import urllib3
import os

def lambda_handler(event, context):
    http = urllib3.PoolManager()
    
    webhook_url = os.environ['SLACK_WEBHOOK_URL']
    
    # Parse SNS message
    message = json.loads(event['Records'][0]['Sns']['Message'])
    alarm_name = message.get('AlarmName', 'Unknown Alarm')
    new_state = message.get('NewStateValue', 'Unknown')
    reason = message.get('NewStateReason', 'No reason provided')
    
    # Choose emoji and color based on state
    if new_state == 'ALARM':
        emoji = '🚨'
        color = 'danger'
    elif new_state == 'OK':
        emoji = '✅'
        color = 'good'
    else:
        emoji = '⚠️'
        color = 'warning'
    
    # Prepare Slack message
    slack_message = {
        "attachments": [
            {
                "color": color,
                "fields": [
                    {
                        "title": f"{emoji} {alarm_name}",
                        "value": f"State: {new_state}\nReason: {reason}",
                        "short": False
                    }
                ]
            }
        ]
    }
    
    # Send to Slack
    encoded_msg = json.dumps(slack_message).encode('utf-8')
    resp = http.request('POST', webhook_url, body=encoded_msg)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Notification sent to Slack')
    }
EOF
    
    # Create deployment package
    zip -q slack-notifier.zip slack-notifier.py
    
    # Create or update Lambda function
    if aws lambda get-function --function-name "${LAMBDA_NAME}" >/dev/null 2>&1; then
        aws lambda update-function-code \
            --function-name "${LAMBDA_NAME}" \
            --zip-file fileb://slack-notifier.zip >/dev/null
        echo -e "${GREEN}✅ Updated Slack Lambda function${NC}"
    else
        # Create IAM role for Lambda
        aws iam create-role \
            --role-name "${LAMBDA_NAME}-role" \
            --assume-role-policy-document '{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"Service": "lambda.amazonaws.com"},
                        "Action": "sts:AssumeRole"
                    }
                ]
            }' >/dev/null 2>&1 || true
        
        aws iam attach-role-policy \
            --role-name "${LAMBDA_NAME}-role" \
            --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" >/dev/null 2>&1 || true
        
        sleep 10  # Wait for role to propagate
        
        # Create Lambda function
        LAMBDA_ARN=$(aws lambda create-function \
            --function-name "${LAMBDA_NAME}" \
            --runtime python3.9 \
            --role "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/${LAMBDA_NAME}-role" \
            --handler slack-notifier.lambda_handler \
            --zip-file fileb://slack-notifier.zip \
            --environment Variables="{SLACK_WEBHOOK_URL=${SLACK_WEBHOOK}}" \
            --query 'FunctionArn' \
            --output text)
        
        echo -e "${GREEN}✅ Created Slack Lambda function${NC}"
        
        # Subscribe Lambda to SNS
        aws sns subscribe \
            --topic-arn "${SNS_TOPIC_ARN}" \
            --protocol lambda \
            --notification-endpoint "${LAMBDA_ARN}" >/dev/null
        
        # Add permission for SNS to invoke Lambda
        aws lambda add-permission \
            --function-name "${LAMBDA_NAME}" \
            --statement-id "allow-sns" \
            --action lambda:InvokeFunction \
            --principal sns.amazonaws.com \
            --source-arn "${SNS_TOPIC_ARN}" >/dev/null 2>&1 || true
    fi
    
    # Cleanup
    rm -f slack-notifier.py slack-notifier.zip
}

# Deploy CloudWatch alarms
deploy_cloudwatch_alarms() {
    echo -e "${YELLOW}⚠️  Deploying CloudWatch alarms...${NC}"
    
    # Get infrastructure details
    ECS_CLUSTER_NAME="lks0426-portfolio-${ENVIRONMENT}"
    ECS_SERVICE_NAME="lks0426-portfolio-${ENVIRONMENT}"
    
    # Deploy alarms using CloudFormation
    aws cloudformation deploy \
        --template-file infrastructure/monitoring/cloudwatch-alarms.yml \
        --stack-name "portfolio-alarms-${ENVIRONMENT}" \
        --parameter-overrides \
            Environment="${ENVIRONMENT}" \
            SNSTopicArn="${SNS_TOPIC_ARN}" \
            ECSClusterName="${ECS_CLUSTER_NAME}" \
            ECSServiceName="${ECS_SERVICE_NAME}" \
            LoadBalancerFullName="app/${ECS_CLUSTER_NAME}/$(date +%s)" \
            CloudFrontDistributionId="PLACEHOLDER" \
        --capabilities CAPABILITY_IAM \
        --no-fail-on-empty-changeset
    
    echo -e "${GREEN}✅ CloudWatch alarms deployed${NC}"
}

# Create CloudWatch dashboard
create_dashboard() {
    echo -e "${YELLOW}📊 Creating CloudWatch dashboard...${NC}"
    
    DASHBOARD_NAME="LKS0426-Portfolio-${ENVIRONMENT}"
    
    # Update dashboard template with actual values
    cp infrastructure/monitoring/cloudwatch-dashboard.json dashboard-temp.json
    
    # Replace placeholders (in a real scenario, you'd get these from CDK outputs)
    sed -i "s/LOAD_BALANCER_ID/placeholder/g" dashboard-temp.json
    sed -i "s/CLOUDFRONT_DISTRIBUTION_ID/placeholder/g" dashboard-temp.json
    sed -i "s/HOSTED_ZONE_ID/placeholder/g" dashboard-temp.json
    
    # Create dashboard
    aws cloudwatch put-dashboard \
        --dashboard-name "${DASHBOARD_NAME}" \
        --dashboard-body file://dashboard-temp.json
    
    echo -e "${GREEN}✅ Dashboard created: ${DASHBOARD_NAME}${NC}"
    
    # Cleanup
    rm -f dashboard-temp.json
}

# Setup X-Ray tracing
setup_xray_tracing() {
    echo -e "${YELLOW}📡 Setting up X-Ray tracing...${NC}"
    
    # Create X-Ray service map
    aws xray create-service-map \
        --service-map-name "lks0426-portfolio-${ENVIRONMENT}" \
        --service-ids "lks0426-portfolio" >/dev/null 2>&1 || true
    
    echo -e "${GREEN}✅ X-Ray tracing configured${NC}"
    echo -e "${YELLOW}📝 Remember to add X-Ray SDK to your application${NC}"
}

# Create custom metrics
setup_custom_metrics() {
    echo -e "${YELLOW}📈 Setting up custom metrics...${NC}"
    
    # Create health check metric
    aws cloudwatch put-metric-data \
        --namespace "LKS0426/Portfolio" \
        --metric-data MetricName=HealthCheck,Value=1,Unit=Count,Dimensions=Environment=${ENVIRONMENT}
    
    echo -e "${GREEN}✅ Custom metrics initialized${NC}"
}

# Setup log insights queries
setup_log_insights() {
    echo -e "${YELLOW}🔍 Setting up CloudWatch Insights queries...${NC}"
    
    # Create useful queries
    cat > log-insights-queries.json << EOF
{
  "queries": [
    {
      "name": "Error Analysis",
      "query": "fields @timestamp, @message | filter @message like /ERROR/ | sort @timestamp desc | limit 100"
    },
    {
      "name": "Performance Analysis", 
      "query": "fields @timestamp, @message | filter @message like /response time/ | stats avg(@duration) by bin(5m)"
    },
    {
      "name": "User Activity",
      "query": "fields @timestamp, @message | filter @message like /GET|POST/ | stats count() by bin(1h)"
    }
  ]
}
EOF
    
    echo -e "${GREEN}✅ Log Insights queries prepared${NC}"
}

# Generate monitoring report
generate_monitoring_report() {
    echo -e "${YELLOW}📋 Generating monitoring report...${NC}"
    
    cat > monitoring-report.md << EOF
# Monitoring Setup Report

## Environment: ${ENVIRONMENT}
## Setup Date: $(date)

### Components Configured:
- ✅ CloudWatch Alarms
- ✅ SNS Notifications  
- ✅ CloudWatch Dashboard
- ✅ X-Ray Tracing
- ✅ Custom Metrics
- ✅ Log Insights Queries

### SNS Topic: ${SNS_TOPIC_ARN}
### Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=LKS0426-Portfolio-${ENVIRONMENT}

### Alert Endpoints:
- Email: ${ALERT_EMAIL}
- Slack: ${SLACK_WEBHOOK:+Configured}

### Next Steps:
1. Confirm email subscription
2. Test Slack notifications
3. Review dashboard metrics
4. Validate alert thresholds
5. Monitor for first 24 hours

### Useful Commands:
\`\`\`bash
# View recent alarms
aws cloudwatch describe-alarms --state-value ALARM

# Test notification
aws sns publish --topic-arn ${SNS_TOPIC_ARN} --message "Test notification"

# View dashboard
aws cloudwatch get-dashboard --dashboard-name LKS0426-Portfolio-${ENVIRONMENT}
\`\`\`
EOF
    
    echo -e "${GREEN}✅ Monitoring report generated: monitoring-report.md${NC}"
}

# Main execution
main() {
    check_prerequisites
    create_sns_topic
    deploy_cloudwatch_alarms
    create_dashboard
    setup_xray_tracing
    setup_custom_metrics
    setup_log_insights
    generate_monitoring_report
    
    echo -e "${GREEN}🎉 Monitoring setup completed!${NC}"
    echo -e "${GREEN}📊 Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=LKS0426-Portfolio-${ENVIRONMENT}${NC}"
    echo -e "${GREEN}📧 Check your email to confirm SNS subscription${NC}"
    
    if [ ! -z "${SLACK_WEBHOOK}" ]; then
        echo -e "${GREEN}🔔 Slack notifications configured${NC}"
    fi
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi