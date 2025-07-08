import { APIProvider } from '@/domain/types';

export const apiProviders: APIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    requiresAuth: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    type: 'anthropic',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    requiresAuth: true,
  },
  {
    id: 'google',
    name: 'Google Gemini',
    type: 'google',
    models: ['gemini-pro', 'gemini-pro-vision'],
    requiresAuth: true,
  },
  {
    id: 'ollama',
    name: 'Ollama',
    type: 'ollama',
    baseUrl: 'http://localhost:11434',
    models: ['llama2', 'codellama', 'mistral'],
    requiresAuth: false,
  },
  {
    id: 'groq',
    name: 'Groq',
    type: 'groq',
    models: ['llama2-70b-4096', 'mixtral-8x7b-32768'],
    requiresAuth: true,
  },
  {
    id: 'cohere',
    name: 'Cohere',
    type: 'cohere',
    models: ['command', 'command-light'],
    requiresAuth: true,
  },
];