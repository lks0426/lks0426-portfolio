'use client';

import { Github, Linkedin, Mail, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [deployTime, setDeployTime] = useState<string>('');
  
  const roles = [
    '全栈开发工程师',
    'AI 技术爱好者',
    '云架构师',
    '开源贡献者',
    '科技创新探索者'
  ];

  useEffect(() => {
    setDeployTime(new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 背景动画效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)] opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.3),transparent_50%)] opacity-70"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="relative inline-block">
              <Terminal className="w-20 h-20 mx-auto text-purple-400 mb-4 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            LKS0426
          </h1>
          
          <div className="text-2xl md:text-4xl text-gray-300 mb-10 h-[1.5em] font-light">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {roles[0]}
            </span>
          </div>
          
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            在AI与现代Web技术的交汇点构建创新解决方案<br/>
            专注于创造高效、可扩展的应用程序，推动技术边界的不断突破
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <a
              href="#projects"
              className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
            >
              查看项目
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
            
            <a
              href="#contact"
              className="group px-10 py-4 border-2 border-purple-400 hover:border-purple-500 text-white rounded-xl font-medium transition-all duration-300 hover:bg-purple-600/20 hover:scale-105"
            >
              联系我
            </a>
          </div>
          
          <div className="flex gap-8 justify-center">
            <a
              href="https://github.com/lks0426"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-gray-800/50 hover:bg-purple-600/30 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-110"
            >
              <Github className="w-7 h-7" />
            </a>
            
            <a
              href="https://linkedin.com/in/lks0426"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-full bg-gray-800/50 hover:bg-purple-600/30 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="w-7 h-7" />
            </a>
            
            <a
              href="mailto:contact@lks0426.com"
              className="group p-3 rounded-full bg-gray-800/50 hover:bg-purple-600/30 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-110"
            >
              <Mail className="w-7 h-7" />
            </a>
          </div>
          
          <div className="mt-12 text-sm text-gray-400 font-light">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/30 backdrop-blur-sm">
              <span className="animate-pulse">🚀</span>
              <span>部署时间: {deployTime}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-purple-400 rounded-full flex justify-center hover:border-purple-300 transition-colors">
          <div className="w-1.5 h-4 bg-purple-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}