import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface PortfolioInfrastructureSimpleStackProps extends cdk.StackProps {
  domainName: string;
  dockerImage: string;
  environment: 'dev' | 'staging' | 'prod';
}

export class PortfolioInfrastructureSimpleStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly service: ecs.FargateService;
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: PortfolioInfrastructureSimpleStackProps) {
    super(scope, id, props);

    const { domainName, dockerImage, environment } = props;

    // VPC with public and private subnets across 2 AZs
    const vpc = new ec2.Vpc(this, 'PortfolioVPC', {
      maxAzs: 2,
      natGateways: 1, // Cost optimization: single NAT gateway
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    // Security Group for ALB
    const albSecurityGroup = new ec2.SecurityGroup(this, 'ALBSecurityGroup', {
      vpc,
      description: 'Security group for Application Load Balancer',
      allowAllOutbound: true,
    });

    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic'
    );

    // Security Group for ECS Service
    const ecsSecurityGroup = new ec2.SecurityGroup(this, 'ECSSecurityGroup', {
      vpc,
      description: 'Security group for ECS service',
      allowAllOutbound: true,
    });

    ecsSecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(3000),
      'Allow traffic from ALB'
    );

    // ECS Cluster
    this.cluster = new ecs.Cluster(this, 'PortfolioCluster', {
      vpc,
      clusterName: `lks0426-portfolio-${environment}`,
      enableFargateCapacityProviders: true,
    });

    // CloudWatch Log Group
    const logGroup = new logs.LogGroup(this, 'PortfolioLogGroup', {
      logGroupName: `/ecs/lks0426-portfolio-${environment}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Task Execution Role
    const taskExecutionRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
      ],
    });

    // Task Role
    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    // ECS Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'PortfolioTaskDefinition', {
      memoryLimitMiB: 1024,
      cpu: 512,
      executionRole: taskExecutionRole,
      taskRole: taskRole,
      family: `lks0426-portfolio-${environment}`,
    });

    // Container Definition
    const container = taskDefinition.addContainer('portfolio-container', {
      image: ecs.ContainerImage.fromRegistry(dockerImage),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'ecs',
        logGroup: logGroup,
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '0.0.0.0',
      },
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:3000/ || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
        startPeriod: cdk.Duration.seconds(60),
      },
    });

    container.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    // Application Load Balancer
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'PortfolioALB', {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
      loadBalancerName: `lks0426-portfolio-${environment}`,
    });

    // Target Group
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'PortfolioTargetGroup', {
      vpc,
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        enabled: true,
        healthyHttpCodes: '200',
        path: '/',
        protocol: elbv2.Protocol.HTTP,
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
      },
      deregistrationDelay: cdk.Duration.seconds(30),
    });

    // HTTP Listener
    this.loadBalancer.addListener('HTTPListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultTargetGroups: [targetGroup],
    });

    // ECS Service
    this.service = new ecs.FargateService(this, 'PortfolioService', {
      cluster: this.cluster,
      taskDefinition,
      serviceName: `lks0426-portfolio-${environment}`,
      desiredCount: environment === 'prod' ? 2 : 1,
      assignPublicIp: false,
      securityGroups: [ecsSecurityGroup],
      enableExecuteCommand: true,
      maxHealthyPercent: 200,
      minHealthyPercent: 50,
      platformVersion: ecs.FargatePlatformVersion.LATEST,
    });

    // Attach service to target group
    this.service.attachToApplicationTargetGroup(targetGroup);

    // Auto Scaling
    const scalableTarget = this.service.autoScaleTaskCount({
      minCapacity: environment === 'prod' ? 1 : 1,
      maxCapacity: environment === 'prod' ? 10 : 3,
    });

    // CPU-based scaling
    scalableTarget.scaleOnCpuUtilization('CPUScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.minutes(5),
      scaleOutCooldown: cdk.Duration.minutes(2),
    });

    // Memory-based scaling
    scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.minutes(5),
      scaleOutCooldown: cdk.Duration.minutes(2),
    });

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: this.loadBalancer.loadBalancerDnsName,
      description: 'Application Load Balancer DNS Name',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `http://${this.loadBalancer.loadBalancerDnsName}`,
      description: 'Portfolio Website URL',
    });

    new cdk.CfnOutput(this, 'ECSClusterName', {
      value: this.cluster.clusterName,
      description: 'ECS Cluster Name',
    });

    new cdk.CfnOutput(this, 'ECSServiceName', {
      value: this.service.serviceName,
      description: 'ECS Service Name',
    });
  }
}