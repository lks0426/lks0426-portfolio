'use client';

import { apiProviders } from '@/infrastructure/data/apiProviders';
import { Cpu, Shield, Zap, Key, CheckCircle } from 'lucide-react';

export function APIConfigSection() {
  return (
    <section id="api-config" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            API Configuration
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Integration capabilities and API services powering intelligent features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                  <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {provider.name}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 capitalize">
                {provider.type} Integration
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {provider.models.map((model) => (
                  <span
                    key={model}
                    className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  >
                    {model}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {provider.requiresAuth ? 'Authenticated' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              High Performance
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Optimized for speed with intelligent caching and parallel processing
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Secure by Default
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              End-to-end encryption with secure key management and access control
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
              <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Instant synchronization with live monitoring and status updates
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}