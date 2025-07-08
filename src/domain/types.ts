// Domain Types following DDD principles

// Value Objects
export interface TechStack {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'cloud' | 'ai-ml' | 'database' | 'tools';
  proficiency: number; // 0-100
  icon?: string;
  color?: string;
}

export interface APIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'ollama' | 'groq' | 'cohere';
  baseUrl?: string;
  models: string[];
  requiresAuth: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'ai-app' | 'web-app' | 'open-source' | 'experimental';
  techStack: string[]; // Tech stack IDs
  githubUrl?: string;
  liveUrl?: string;
  screenshot?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: Date;
  readingTime: number;
  slug: string;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: 'documentation' | 'ui' | 'automation' | 'reasoning';
  installed: boolean;
  configPath?: string;
}

// Entities
export interface APIKey {
  id: string;
  providerId: string;
  encryptedKey: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  avatar?: string;
}

// Aggregates
export interface Portfolio {
  profile: UserProfile;
  techStacks: TechStack[];
  projects: Project[];
  blogPosts: BlogPost[];
  mcpServers: MCPServer[];
}

export interface APIConfiguration {
  providers: APIProvider[];
  keys: APIKey[];
  defaultProvider?: string;
  selectedModel?: string;
}