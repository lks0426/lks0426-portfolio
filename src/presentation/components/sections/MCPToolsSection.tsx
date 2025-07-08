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
    <section id="mcp-tools" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MCP Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Model Context Protocol servers for enhanced AI-powered development workflows
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {installedCount} of {totalCount} servers installed
            </span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>
        </div>

        <div className="mb-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="flex items-start gap-4">
            <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What is MCP?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Model Context Protocol (MCP) enables AI assistants to interact with external tools and services. 
                These servers extend AI capabilities with specialized functions for development, automation, and data processing.
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
                className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-600">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {server.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {server.category}
                      </p>
                    </div>
                  </div>
                  {server.installed && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {server.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Configuration:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        {server.configPath || 'Standard MCP Server'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {server.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {server.installed ? (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Installed
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                          <Download className="w-4 h-4" />
                          <span>Install</span>
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
            <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <Terminal className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Development Tools
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enhanced code editing, debugging, and project management through AI assistance
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <Bot className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Automation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Streamline workflows with intelligent automation and task orchestration
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Integration
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Seamless AI model integration with context-aware tool interactions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}