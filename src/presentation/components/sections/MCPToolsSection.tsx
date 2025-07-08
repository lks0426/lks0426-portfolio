'use client';

import { mcpServersData } from '@/infrastructure/data/mcpServers';
import { 
  BookOpen, 
  Palette, 
  Bot, 
  Brain, 
  CheckCircle, 
  Download,
  ExternalLink,
  Terminal
} from 'lucide-react';

const categoryIcons = {
  documentation: BookOpen,
  ui: Palette,
  automation: Bot,
  reasoning: Brain,
};

export function MCPToolsSection() {
  const installedCount = mcpServersData.filter(s => s.installed).length;
  const totalCount = mcpServersData.length;

  return (
    <section id="mcp-tools" className="py-20 px-4 bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            MCP 工具
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            用于增强 AI 驱动开发工作流的模型上下文协议服务器
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-400">
              已安装 {installedCount} 个，共 {totalCount} 个服务器
            </span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-400">活跃</span>
            </div>
          </div>
        </div>

        <div className="mb-12 p-6 bg-purple-900/20 rounded-xl">
          <div className="flex items-start gap-4">
            <Terminal className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2">
                什么是 MCP？
              </h3>
              <p className="text-gray-300">
                模型上下文协议（MCP）使 AI 助手能够与外部工具和服务交互。
                这些服务器通过开发、自动化和数据处理的专用功能扩展了 AI 能力。
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mcpServersData.map((server) => {
            const Icon = categoryIcons[server.category] || Terminal;
            
            return (
              <div
                key={server.id}
                className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {server.name}
                      </h3>
                      <p className="text-sm text-gray-400 capitalize">
                        {server.category}
                      </p>
                    </div>
                  </div>
                  {server.installed && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>

                <p className="text-gray-300 mb-4">
                  {server.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      配置：
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-purple-900 text-purple-300">
                        {server.configPath || '标准 MCP 服务器'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-sm text-gray-400 capitalize">
                      {server.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {server.installed ? (
                        <span className="text-sm text-green-400 font-medium">
                          已安装
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-purple-400">
                          <Download className="w-4 h-4" />
                          <span>安装</span>
                        </div>
                      )}
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-purple-900 mb-4">
              <Terminal className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              开发工具
            </h3>
            <p className="text-gray-400">
              通过 AI 辅助增强代码编辑、调试和项目管理
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-green-900 mb-4">
              <Bot className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              自动化
            </h3>
            <p className="text-gray-400">
              通过智能自动化和任务编排简化工作流程
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-900 mb-4">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              AI 集成
            </h3>
            <p className="text-gray-400">
              通过上下文感知的工具交互无缝集成 AI 模型
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}