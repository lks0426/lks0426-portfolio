# LKS0426 Portfolio

A modern, responsive personal portfolio website showcasing full-stack development projects, AI applications, and cloud architecture expertise.

## 🚀 Features

### Core Sections
- **Hero Section**: Animated particle background with typing effect
- **Tech Stack Showcase**: Interactive skill bars with hover effects  
- **Project Portfolio**: Filterable grid with category-based organization
- **API Configuration Center**: Secure local storage for AI model API keys
- **MCP Tools Ecosystem**: SuperClaude framework and MCP server showcase

### Technical Highlights
- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **Tailwind CSS** with custom animations
- **Framer Motion** for smooth transitions
- **Domain-Driven Design** architecture
- **Docker** containerization
- **AWS ECS** deployment ready

## 🛠 Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

### Backend & Infrastructure
- Node.js
- Supabase (PostgreSQL)
- Docker
- AWS ECS
- GitHub Actions

### Development Tools
- ESLint
- Prettier
- Zustand (State Management)
- SuperClaude Framework

## 🏗 Architecture

The project follows Domain-Driven Design (DDD) principles:

```
src/
├── domain/          # Domain models and types
├── infrastructure/  # Data access and external services  
├── application/     # Business logic and services
└── presentation/    # UI components and layouts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (for containerization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lks0426/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🐳 Docker Deployment

### Local Development
```bash
docker-compose up --build
```

### Production Build
```bash
docker build -t lks0426-portfolio .
docker run -p 3000:3000 lks0426-portfolio
```

## ☁️ AWS ECS Deployment

### Prerequisites
- AWS CLI configured
- ECR repository created
- ECS cluster and service set up

### Deploy
```bash
./scripts/deploy.sh
```

## 🔧 Configuration

### API Keys
The portfolio includes a secure API key management system supporting:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic Claude
- Google Gemini
- Ollama (local)
- Groq, Cohere

Keys are encrypted and stored locally in the browser.

### MCP Integration
Showcases the SuperClaude framework with MCP servers:
- Context7 (Documentation)
- Magic (UI Generation)
- Puppeteer (Automation)
- Sequential Thinking (Reasoning)

## 📱 Features in Detail

### Responsive Design
- Mobile-first approach
- Smooth animations on all devices
- Dark/light theme support (coming soon)

### Performance Optimized
- Next.js SSG/ISR
- Image optimization
- Code splitting
- Core Web Vitals optimized

### SEO Ready
- Complete meta tags
- Open Graph support
- Structured data
- Sitemap generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📜 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run format       # Prettier format
```

## 🔗 Links

- **Live Site**: [https://lks0426.com](https://lks0426.com)
- **GitHub**: [https://github.com/lks0426](https://github.com/lks0426)
- **SuperClaude**: [SuperClaude Framework](https://github.com/lks0426/superclaude)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ using SuperClaude framework and Claude Code