'use client';

import { useState } from 'react';
import { techStackData } from '@/infrastructure/data/techStack';
import { TechStack } from '@/domain/types';
import { 
  Code2, 
  Server, 
  Cloud, 
  Brain, 
  Database, 
  Wrench,
  Sparkles
} from 'lucide-react';

const categoryIcons = {
  frontend: Code2,
  backend: Server,
  cloud: Cloud,
  'ai-ml': Brain,
  database: Database,
  tools: Wrench,
};

const categoryNames = {
  frontend: 'Frontend',
  backend: 'Backend',
  cloud: 'Cloud Services',
  'ai-ml': 'AI/ML',
  database: 'Database',
  tools: 'Tools',
};

export function TechStackSection() {
  const [selectedCategory, setSelectedCategory] = useState<TechStack['category'] | 'all'>('all');
  
  const filteredStacks = selectedCategory === 'all' 
    ? techStackData 
    : techStackData.filter(stack => stack.category === selectedCategory);

  const categories = Object.keys(categoryNames) as TechStack['category'][];

  return (
    <section id="tech-stack" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tech Stack
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Technologies I work with to build amazing solutions
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            All
          </button>
          
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {categoryNames[category]}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStacks.map((tech) => (
            <div
              key={tech.name}
              className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tech.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tech.proficiency}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${tech.proficiency}%`,
                      backgroundColor: tech.color 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            ...and always learning new technologies to stay ahead of the curve!
          </p>
        </div>
      </div>
    </section>
  );
}