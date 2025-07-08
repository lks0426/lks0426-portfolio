import { HeroSection } from '@/presentation/components/sections/HeroSection';
import { TechStackSection } from '@/presentation/components/sections/TechStackSection';
import { ProjectsSection } from '@/presentation/components/sections/ProjectsSection';
import { APIConfigSection } from '@/presentation/components/sections/APIConfigSection';
import { MCPToolsSection } from '@/presentation/components/sections/MCPToolsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <HeroSection />
      <TechStackSection />
      <ProjectsSection />
      <APIConfigSection />
      <MCPToolsSection />
    </main>
  );
}