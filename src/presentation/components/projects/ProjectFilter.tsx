'use client';

import { motion } from 'framer-motion';
import { Project } from '@/domain/types';
import { Brain, Globe, Package, Beaker, Sparkles } from 'lucide-react';

interface ProjectFilterProps {
  selectedCategory: Project['category'] | 'all';
  onCategoryChange: (category: Project['category'] | 'all') => void;
  projectCounts: Record<Project['category'] | 'all', number>;
}

const categoryIcons = {
  all: Sparkles,
  'ai-app': Brain,
  'web-app': Globe,
  'open-source': Package,
  'experimental': Beaker,
};

const categoryNames = {
  all: 'All Projects',
  'ai-app': 'AI Applications',
  'web-app': 'Web Applications',
  'open-source': 'Open Source',
  'experimental': 'Experimental',
};

export function ProjectFilter({ 
  selectedCategory, 
  onCategoryChange, 
  projectCounts 
}: ProjectFilterProps) {
  const categories = Object.keys(categoryNames) as (Project['category'] | 'all')[];

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => {
        const Icon = categoryIcons[category];
        const isSelected = selectedCategory === category;
        const count = projectCounts[category] || 0;

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            <span>{categoryNames[category]}</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              isSelected 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}