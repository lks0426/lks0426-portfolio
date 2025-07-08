'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SkillBarProps {
  name: string;
  proficiency: number;
  color?: string;
  delay?: number;
}

export function SkillBar({ 
  name, 
  proficiency, 
  color = 'bg-blue-500',
  delay = 0 
}: SkillBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {proficiency}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${proficiency}%` : 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: delay * 0.1 }}
        />
      </div>
    </div>
  );
}