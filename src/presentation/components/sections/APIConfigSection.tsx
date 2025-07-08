'use client';

import { apiProviders } from '@/infrastructure/data/apiProviders';
import { Cpu, Shield, Zap, Key, CheckCircle } from 'lucide-react';

export function APIConfigSection() {
  return (
    <section id="api-config" className="py-20 px-4 bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            API 配置
          </h2>
          <p className="text-lg text-gray-300">
            集成功能和驱动智能功能的 API 服务
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-600 shadow-sm">
                  <Key className="w-6 h-6 text-purple-400" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {provider.name}
              </h3>
              
              <p className="text-sm text-gray-400 mb-4 capitalize">
                {provider.type} 集成
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {provider.models.map((model) => (
                  <span
                    key={model}
                    className="px-3 py-1 text-xs rounded-full bg-purple-900 text-purple-300"
                  >
                    {model}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">状态</span>
                  <span className="text-green-400 font-medium">
                    {provider.requiresAuth ? '已认证' : '就绪'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-purple-900 mb-4">
              <Cpu className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              高性能
            </h3>
            <p className="text-gray-400">
              通过智能缓存和并行处理优化速度
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-green-900 mb-4">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              默认安全
            </h3>
            <p className="text-gray-400">
              端到端加密，安全密钥管理和访问控制
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-900 mb-4">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              实时更新
            </h3>
            <p className="text-gray-400">
              即时同步，实时监控和状态更新
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}