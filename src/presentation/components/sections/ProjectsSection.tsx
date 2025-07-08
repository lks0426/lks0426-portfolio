'use client';

import { useState } from 'react';
import { projectsData } from '@/infrastructure/data/projects';
import { Project } from '@/domain/types';
import { 
  Github, 
  ExternalLink, 
  Search,
  Sparkles,
  Brain,
  Globe,
  Package,
  Beaker
} from 'lucide-react';

const categoryIcons = {
  'ai-app': Brain,
  'web-app': Globe,
  'open-source': Package,
  'experimental': Beaker,
};

const categoryNames = {
  'ai-app': 'AI应用',
  'web-app': 'Web应用',
  'open-source': '开源项目',
  'experimental': '实验性项目',
};

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<Project['category'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProjects = projectsData.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = Object.keys(categoryNames) as Project['category'][];
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = projectsData.filter(p => p.category === category).length;
    return acc;
  }, {} as Record<Project['category'], number>);

  return (
    <section id="projects" className="py-20 px-4 bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            精选项目
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            展示我在AI、Web开发和开源项目方面的最新工作
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索项目..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 shadow-md'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>全部项目</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-purple-500 text-white">
              {projectsData.length}
            </span>
          </button>
          
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{categoryNames[category]}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {categoryCounts[category]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.title}
              className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Project Header */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl font-bold mb-2">
                      {project.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </div>
                    <div className="text-sm opacity-80 capitalize">
                      {categoryNames[project.category]}
                    </div>
                  </div>
                </div>
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      精选
                    </div>
                  </div>
                )}
              </div>

              {/* Project Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span className="text-sm">代码</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span className="text-sm">演示</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              未找到符合条件的项目。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}