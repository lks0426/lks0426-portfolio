import { TechStack } from '@/domain/types';

export const techStackData: TechStack[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'frontend', proficiency: 95, color: 'bg-cyan-500' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', proficiency: 90, color: 'bg-black dark:bg-white' },
  { id: 'vue', name: 'Vue.js', category: 'frontend', proficiency: 85, color: 'bg-green-500' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 92, color: 'bg-blue-600' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', proficiency: 95, color: 'bg-teal-500' },
  
  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', proficiency: 90, color: 'bg-green-600' },
  { id: 'python', name: 'Python', category: 'backend', proficiency: 88, color: 'bg-yellow-500' },
  { id: 'go', name: 'Go', category: 'backend', proficiency: 75, color: 'bg-cyan-600' },
  { id: 'rust', name: 'Rust', category: 'backend', proficiency: 70, color: 'bg-orange-600' },
  
  // Cloud Services
  { id: 'aws', name: 'AWS', category: 'cloud', proficiency: 85, color: 'bg-orange-500' },
  { id: 'docker', name: 'Docker', category: 'cloud', proficiency: 90, color: 'bg-blue-500' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'cloud', proficiency: 75, color: 'bg-blue-700' },
  
  // AI/ML
  { id: 'openai', name: 'OpenAI API', category: 'ai-ml', proficiency: 92, color: 'bg-gray-800' },
  { id: 'claude', name: 'Anthropic Claude', category: 'ai-ml', proficiency: 95, color: 'bg-amber-600' },
  { id: 'ollama', name: 'Ollama', category: 'ai-ml', proficiency: 85, color: 'bg-gray-700' },
  
  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', proficiency: 88, color: 'bg-blue-800' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', proficiency: 85, color: 'bg-green-700' },
  { id: 'redis', name: 'Redis', category: 'database', proficiency: 82, color: 'bg-red-600' },
  
  // Tools
  { id: 'git', name: 'Git', category: 'tools', proficiency: 95, color: 'bg-red-500' },
  { id: 'vscode', name: 'VS Code', category: 'tools', proficiency: 95, color: 'bg-blue-600' },
  { id: 'claude-code', name: 'Claude Code', category: 'tools', proficiency: 98, color: 'bg-amber-500' },
];