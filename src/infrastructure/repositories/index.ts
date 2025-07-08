// Repository Interfaces following DDD pattern
import { Project, TechStack, BlogPost, APIKey, UserProfile, MCPServer } from '@/domain/types';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findByCategory(category: Project['category']): Promise<Project[]>;
  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  update(id: string, project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}

export interface ITechStackRepository {
  findAll(): Promise<TechStack[]>;
  findByCategory(category: TechStack['category']): Promise<TechStack[]>;
  updateProficiency(id: string, proficiency: number): Promise<TechStack>;
}

export interface IBlogRepository {
  findAll(): Promise<BlogPost[]>;
  findBySlug(slug: string): Promise<BlogPost | null>;
  findByTags(tags: string[]): Promise<BlogPost[]>;
  create(post: Omit<BlogPost, 'id'>): Promise<BlogPost>;
  update(id: string, post: Partial<BlogPost>): Promise<BlogPost>;
  delete(id: string): Promise<void>;
}

export interface IAPIKeyRepository {
  findByProvider(providerId: string): Promise<APIKey | null>;
  saveKey(providerId: string, encryptedKey: string): Promise<APIKey>;
  updateLastUsed(id: string): Promise<void>;
  deleteKey(providerId: string): Promise<void>;
}

export interface IUserProfileRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
}

export interface IMCPServerRepository {
  findAll(): Promise<MCPServer[]>;
  findInstalled(): Promise<MCPServer[]>;
  updateStatus(id: string, installed: boolean): Promise<MCPServer>;
}