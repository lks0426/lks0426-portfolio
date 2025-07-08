'use client';

import { Github, Linkedin, Mail, Terminal } from 'lucide-react';

export function HeroSection() {
  const roles = [
    'Full-Stack Developer',
    'AI Enthusiast',
    'Cloud Architect',
    'Open Source Contributor',
    'Tech Innovation Explorer'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <Terminal className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LKS0426
          </h1>
          
          <div className="text-2xl md:text-3xl text-gray-300 mb-8 h-[1.5em]">
            {roles[0]}
          </div>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Building innovative solutions at the intersection of AI and modern web technologies. 
            Passionate about creating efficient, scalable applications that push the boundaries of what&apos;s possible.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a
              href="#projects"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              View Projects
              <span>→</span>
            </a>
            
            <a
              href="#contact"
              className="px-8 py-3 border border-gray-300 hover:border-blue-500 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Contact Me
            </a>
          </div>
          
          <div className="flex gap-6 justify-center">
            <a
              href="https://github.com/lks0426"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            
            <a
              href="https://linkedin.com/in/lks0426"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            
            <a
              href="mailto:contact@lks0426.com"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
          
          <div className="mt-8 text-xs text-gray-500">
            🚀 Deployed: {new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}