// X-Ray Tracing Configuration for Next.js Application
// Add this to your Next.js application to enable distributed tracing

const AWSXRay = require('aws-xray-sdk-core');

// Configure X-Ray SDK
const xrayConfig = {
  // X-Ray daemon configuration
  daemon: {
    address: process.env.AWS_XRAY_DAEMON_ADDRESS || 'localhost:2000',
  },
  
  // Service configuration
  service: {
    name: process.env.AWS_XRAY_SERVICE_NAME || 'lks0426-portfolio',
    version: process.env.npm_package_version || '1.0.0',
  },
  
  // Sampling configuration
  sampling: {
    defaultSamplingRate: 0.1, // Sample 10% of requests
    reservoirSize: 1, // Reserve 1 trace per second
  },
  
  // Plugin configuration
  plugins: [
    'ECSPlugin', // ECS metadata
    'EC2Plugin', // EC2 metadata if applicable
  ],
  
  // Context missing strategy
  contextMissingStrategy: 'LOG_ERROR',
  
  // Automatic mode for easier integration
  automaticMode: true,
};

// Initialize X-Ray
if (process.env.NODE_ENV === 'production' && process.env.AWS_XRAY_TRACING_NAME) {
  AWSXRay.config([
    AWSXRay.plugins.ECSPlugin,
    AWSXRay.plugins.EC2Plugin,
  ]);
  
  // Set sampling rules
  AWSXRay.middleware.setSamplingRules({
    version: 2,
    default: {
      fixed_target: 1,
      rate: 0.1,
    },
    rules: [
      {
        description: 'Health check endpoints',
        service_name: 'lks0426-portfolio',
        http_method: 'GET',
        url_path: '/api/health',
        fixed_target: 0,
        rate: 0.05, // Lower sampling for health checks
      },
      {
        description: 'API endpoints',
        service_name: 'lks0426-portfolio',
        http_method: '*',
        url_path: '/api/*',
        fixed_target: 1,
        rate: 0.2, // Higher sampling for API calls
      },
      {
        description: 'Static assets',
        service_name: 'lks0426-portfolio',
        http_method: 'GET',
        url_path: '/_next/*',
        fixed_target: 0,
        rate: 0.01, // Very low sampling for static assets
      },
    ],
  });
}

// Middleware for Express/Next.js
const xrayMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && process.env.AWS_XRAY_TRACING_NAME) {
    // Add custom annotations
    const segment = AWSXRay.getSegment();
    if (segment) {
      segment.addAnnotation('environment', process.env.NODE_ENV);
      segment.addAnnotation('version', process.env.npm_package_version || '1.0.0');
      segment.addAnnotation('userId', req.headers['x-user-id'] || 'anonymous');
      
      // Add metadata
      segment.addMetadata('request', {
        url: req.url,
        method: req.method,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
      });
    }
  }
  
  next();
};

// Custom tracing utilities
const createSubsegment = (name, callback) => {
  if (process.env.NODE_ENV === 'production' && process.env.AWS_XRAY_TRACING_NAME) {
    const segment = AWSXRay.getSegment();
    if (segment) {
      const subsegment = segment.addNewSubsegment(name);
      subsegment.addAnnotation('custom_operation', true);
      
      try {
        const result = callback(subsegment);
        if (result && typeof result.then === 'function') {
          // Handle async operations
          return result
            .then((res) => {
              subsegment.close();
              return res;
            })
            .catch((err) => {
              subsegment.addError(err);
              subsegment.close();
              throw err;
            });
        } else {
          subsegment.close();
          return result;
        }
      } catch (error) {
        subsegment.addError(error);
        subsegment.close();
        throw error;
      }
    }
  }
  
  return callback();
};

// Database operation tracing
const traceDatabase = (operation, query) => {
  return createSubsegment(`database_${operation}`, (subsegment) => {
    if (subsegment) {
      subsegment.addAnnotation('database_operation', operation);
      subsegment.addMetadata('query', { sql: query });
    }
    
    // Your database operation here
    // return database.query(query);
  });
};

// External API call tracing
const traceExternalAPI = (service, endpoint) => {
  return createSubsegment(`external_${service}`, (subsegment) => {
    if (subsegment) {
      subsegment.addAnnotation('external_service', service);
      subsegment.addAnnotation('endpoint', endpoint);
    }
    
    // Your external API call here
    // return fetch(endpoint);
  });
};

// Error tracking
const captureError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'production' && process.env.AWS_XRAY_TRACING_NAME) {
    const segment = AWSXRay.getSegment();
    if (segment) {
      segment.addError(error);
      segment.addMetadata('error_context', context);
    }
  }
  
  // Also log to console for local development
  console.error('Error captured:', error, context);
};

// Performance monitoring
const measurePerformance = (name, operation) => {
  const startTime = Date.now();
  
  return createSubsegment(`performance_${name}`, async (subsegment) => {
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      if (subsegment) {
        subsegment.addAnnotation('performance_metric', true);
        subsegment.addMetadata('performance', {
          duration_ms: duration,
          operation: name,
        });
      }
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${name} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (subsegment) {
        subsegment.addMetadata('performance', {
          duration_ms: duration,
          operation: name,
          error: error.message,
        });
      }
      
      throw error;
    }
  });
};

module.exports = {
  AWSXRay: process.env.NODE_ENV === 'production' ? AWSXRay : null,
  xrayMiddleware,
  createSubsegment,
  traceDatabase,
  traceExternalAPI,
  captureError,
  measurePerformance,
  xrayConfig,
};