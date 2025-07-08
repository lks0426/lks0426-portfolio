#!/bin/bash

# DNS and SSL Setup Script for lks0426.com
# Configures Route 53, ACM certificate, and CloudFront

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN_NAME=${DOMAIN_NAME:-lks0426.com}
AWS_REGION=${AWS_REGION:-us-east-1}
HOSTED_ZONE_ID=""

echo -e "${BLUE}🌐 DNS and SSL Setup for ${DOMAIN_NAME}${NC}"

# Check AWS CLI configuration
echo -e "${YELLOW}🔐 Checking AWS configuration...${NC}"
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not configured${NC}"
    exit 1
fi

# Function to get hosted zone ID
get_hosted_zone_id() {
    echo -e "${YELLOW}🔍 Looking up hosted zone for ${DOMAIN_NAME}...${NC}"
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
        --dns-name ${DOMAIN_NAME} \
        --query "HostedZones[?Name=='${DOMAIN_NAME}.'].Id" \
        --output text | cut -d'/' -f3)
    
    if [ -z "$HOSTED_ZONE_ID" ]; then
        echo -e "${RED}❌ Hosted zone not found for ${DOMAIN_NAME}${NC}"
        echo -e "${YELLOW}Creating hosted zone...${NC}"
        
        CALLER_REFERENCE=$(date +%s)
        HOSTED_ZONE_ID=$(aws route53 create-hosted-zone \
            --name ${DOMAIN_NAME} \
            --caller-reference ${CALLER_REFERENCE} \
            --query 'HostedZone.Id' \
            --output text | cut -d'/' -f3)
        
        echo -e "${GREEN}✅ Created hosted zone: ${HOSTED_ZONE_ID}${NC}"
        
        # Get name servers
        NAME_SERVERS=$(aws route53 get-hosted-zone \
            --id ${HOSTED_ZONE_ID} \
            --query 'DelegationSet.NameServers' \
            --output json)
        
        echo -e "${YELLOW}📋 Configure these name servers with your domain registrar:${NC}"
        echo "$NAME_SERVERS" | jq -r '.[]'
        
        read -p "Press Enter after updating name servers with your registrar..."
    else
        echo -e "${GREEN}✅ Found hosted zone: ${HOSTED_ZONE_ID}${NC}"
    fi
}

# Function to create ACM certificate
create_ssl_certificate() {
    echo -e "${YELLOW}🔒 Creating SSL certificate...${NC}"
    
    # Check if certificate already exists
    CERT_ARN=$(aws acm list-certificates \
        --region ${AWS_REGION} \
        --query "CertificateSummaryList[?DomainName=='${DOMAIN_NAME}'].CertificateArn" \
        --output text)
    
    if [ -z "$CERT_ARN" ]; then
        echo -e "${YELLOW}📜 Requesting new certificate...${NC}"
        CERT_ARN=$(aws acm request-certificate \
            --domain-name ${DOMAIN_NAME} \
            --subject-alternative-names www.${DOMAIN_NAME} \
            --validation-method DNS \
            --region ${AWS_REGION} \
            --query 'CertificateArn' \
            --output text)
        
        echo -e "${GREEN}✅ Certificate requested: ${CERT_ARN}${NC}"
        
        # Wait for DNS validation records
        echo -e "${YELLOW}⏳ Waiting for DNS validation records...${NC}"
        sleep 30
        
        # Get DNS validation records
        VALIDATION_RECORDS=$(aws acm describe-certificate \
            --certificate-arn ${CERT_ARN} \
            --region ${AWS_REGION} \
            --query 'Certificate.DomainValidationOptions[*].ResourceRecord' \
            --output json)
        
        echo -e "${YELLOW}📝 Adding DNS validation records...${NC}"
        
        # Create validation records in Route 53
        for record in $(echo "$VALIDATION_RECORDS" | jq -r '.[] | @base64'); do
            _jq() {
                echo ${record} | base64 --decode | jq -r ${1}
            }
            
            RECORD_NAME=$(_jq '.Name')
            RECORD_TYPE=$(_jq '.Type')
            RECORD_VALUE=$(_jq '.Value')
            
            aws route53 change-resource-record-sets \
                --hosted-zone-id ${HOSTED_ZONE_ID} \
                --change-batch "{
                    \"Changes\": [{
                        \"Action\": \"UPSERT\",
                        \"ResourceRecordSet\": {
                            \"Name\": \"${RECORD_NAME}\",
                            \"Type\": \"${RECORD_TYPE}\",
                            \"TTL\": 300,
                            \"ResourceRecords\": [{
                                \"Value\": \"${RECORD_VALUE}\"
                            }]
                        }
                    }]
                }" >/dev/null
        done
        
        echo -e "${YELLOW}⏳ Waiting for certificate validation...${NC}"
        aws acm wait certificate-validated \
            --certificate-arn ${CERT_ARN} \
            --region ${AWS_REGION}
        
        echo -e "${GREEN}✅ Certificate validated!${NC}"
    else
        echo -e "${GREEN}✅ Certificate already exists: ${CERT_ARN}${NC}"
    fi
    
    echo "CERTIFICATE_ARN=${CERT_ARN}" >> dns-config.env
}

# Function to configure security records
configure_security_records() {
    echo -e "${YELLOW}🛡️  Configuring security DNS records...${NC}"
    
    # CAA record for SSL certificate authority authorization
    aws route53 change-resource-record-sets \
        --hosted-zone-id ${HOSTED_ZONE_ID} \
        --change-batch '{
            "Changes": [{
                "Action": "UPSERT",
                "ResourceRecordSet": {
                    "Name": "'${DOMAIN_NAME}'",
                    "Type": "CAA",
                    "TTL": 300,
                    "ResourceRecords": [
                        {"Value": "0 issue \"amazon.com\""},
                        {"Value": "0 issue \"amazontrust.com\""},
                        {"Value": "0 issue \"awstrust.com\""},
                        {"Value": "0 issue \"amazonaws.com\""}
                    ]
                }
            }]
        }' >/dev/null
    
    echo -e "${GREEN}✅ Security records configured${NC}"
}

# Function to test DNS configuration
test_dns_configuration() {
    echo -e "${YELLOW}🧪 Testing DNS configuration...${NC}"
    
    # Test A record
    if dig +short ${DOMAIN_NAME} >/dev/null; then
        echo -e "${GREEN}✅ A record resolves${NC}"
    else
        echo -e "${RED}❌ A record not resolving${NC}"
    fi
    
    # Test WWW record
    if dig +short www.${DOMAIN_NAME} >/dev/null; then
        echo -e "${GREEN}✅ WWW record resolves${NC}"
    else
        echo -e "${RED}❌ WWW record not resolving${NC}"
    fi
    
    # Test SSL certificate
    echo -e "${YELLOW}🔒 Testing SSL certificate...${NC}"
    if timeout 10 openssl s_client -connect ${DOMAIN_NAME}:443 -servername ${DOMAIN_NAME} </dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✅ SSL certificate valid${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL certificate not yet ready (may take time to propagate)${NC}"
    fi
}

# Function to generate deployment environment file
generate_env_file() {
    echo -e "${YELLOW}📝 Generating deployment environment file...${NC}"
    
    cat > dns-config.env << EOF
# DNS and SSL Configuration
DOMAIN_NAME=${DOMAIN_NAME}
HOSTED_ZONE_ID=${HOSTED_ZONE_ID}
CERTIFICATE_ARN=${CERT_ARN}
AWS_REGION=${AWS_REGION}

# CDK Context
CDK_DOMAIN_NAME=${DOMAIN_NAME}
CDK_CERTIFICATE_ARN=${CERT_ARN}
CDK_HOSTED_ZONE_ID=${HOSTED_ZONE_ID}
EOF
    
    echo -e "${GREEN}✅ Environment file created: dns-config.env${NC}"
}

# Main execution
main() {
    get_hosted_zone_id
    create_ssl_certificate
    configure_security_records
    generate_env_file
    test_dns_configuration
    
    echo -e "${GREEN}🎉 DNS and SSL setup completed!${NC}"
    echo -e "${GREEN}Domain: ${DOMAIN_NAME}${NC}"
    echo -e "${GREEN}Hosted Zone: ${HOSTED_ZONE_ID}${NC}"
    echo -e "${GREEN}Certificate: ${CERT_ARN}${NC}"
    
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo -e "${BLUE}1. Deploy your infrastructure with CDK${NC}"
    echo -e "${BLUE}2. Update DNS records to point to CloudFront${NC}"
    echo -e "${BLUE}3. Test the website${NC}"
    echo -e "${BLUE}4. Monitor SSL certificate expiration${NC}"
}

# Check if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi