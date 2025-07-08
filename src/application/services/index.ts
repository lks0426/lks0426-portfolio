// Application Services
import { Project, TechStack, BlogPost } from '@/domain/types';
import { 
  IProjectRepository, 
  ITechStackRepository, 
  IBlogRepository, 
  IAPIKeyRepository 
} from '@/infrastructure/repositories';

export class ProjectService {
  constructor(private repository: IProjectRepository) {}

  async getFeaturedProjects(): Promise<Project[]> {
    const projects = await this.repository.findAll();
    return projects.filter(p => p.featured).sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  async getProjectsByTech(techId: string): Promise<Project[]> {
    const projects = await this.repository.findAll();
    return projects.filter(p => p.techStack.includes(techId));
  }

  async captureProjectScreenshot(projectId: string, _url: string): Promise<string> {
    // Implementation will use Puppeteer MCP
    return `/screenshots/${projectId}.png`;
  }
}

export class TechStackService {
  constructor(private repository: ITechStackRepository) {}

  async getStackByProficiency(minProficiency: number = 70): Promise<TechStack[]> {
    const stacks = await this.repository.findAll();
    return stacks
      .filter(s => s.proficiency >= minProficiency)
      .sort((a, b) => b.proficiency - a.proficiency);
  }

  async groupByCategory(): Promise<Record<TechStack['category'], TechStack[]>> {
    const stacks = await this.repository.findAll();
    return stacks.reduce((acc, stack) => {
      if (!acc[stack.category]) acc[stack.category] = [];
      acc[stack.category].push(stack);
      return acc;
    }, {} as Record<TechStack['category'], TechStack[]>);
  }
}

export class APIKeyService {
  constructor(private repository: IAPIKeyRepository) {}

  async saveKey(providerId: string, rawKey: string): Promise<void> {
    const encryptedKey = await this.encrypt(rawKey);
    await this.repository.saveKey(providerId, encryptedKey);
  }

  async getKey(providerId: string): Promise<string | null> {
    const apiKey = await this.repository.findByProvider(providerId);
    if (!apiKey) return null;
    
    await this.repository.updateLastUsed(apiKey.id);
    return this.decrypt(apiKey.encryptedKey);
  }

  private async encrypt(key: string): Promise<string> {
    // Simple encryption for demo - in production use proper crypto
    return Buffer.from(key).toString('base64');
  }

  private async decrypt(encryptedKey: string): Promise<string> {
    return Buffer.from(encryptedKey, 'base64').toString('utf-8');
  }
}

export class BlogService {
  constructor(private repository: IBlogRepository) {}

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const posts = await this.repository.findAll();
    return posts
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  async getRelatedPosts(tags: string[], excludeId: string): Promise<BlogPost[]> {
    const posts = await this.repository.findByTags(tags);
    return posts.filter(p => p.id !== excludeId).slice(0, 3);
  }

  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}