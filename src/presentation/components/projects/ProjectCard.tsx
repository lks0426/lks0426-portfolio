'use client';

import { motion } from 'framer-motion';
import { Project } from '@/domain/types';
import { techStackData } from '@/infrastructure/data/techStack';
import { Github, ExternalLink, Calendar, Star } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const categoryColors = {
  'ai-app': 'from-purple-500 to-pink-500',
  'web-app': 'from-blue-500 to-teal-500',
  'open-source': 'from-green-500 to-emerald-500',
  'experimental': 'from-orange-500 to-red-500',
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const getTechStackInfo = (techId: string) => {
    return techStackData.find(tech => tech.id === techId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      whileHover={{ y: -5 }}
    >
      {/* Project Image/Screenshot */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[project.category]} opacity-90`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl font-bold mb-2">
              {project.title.split(' ').map(word => word[0]).join('').toUpperCase()}
            </div>
            <div className="text-sm opacity-80 capitalize">
              {project.category.replace('-', ' ')}
            </div>
          </div>
        </div>
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </div>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            {project.createdAt.getFullYear()}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 4).map((techId) => {
            const tech = getTechStackInfo(techId);
            return (
              <span
                key={techId}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
              >
                {tech?.name || techId}
              </span>
            );
          })}
          {project.techStack.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4" />
              Code
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}