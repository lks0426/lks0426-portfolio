'use client';

import { motion } from 'framer-motion';
import { APIProvider } from '@/domain/types';
import { Settings, Check, AlertCircle } from 'lucide-react';

interface APIProviderCardProps {
  provider: APIProvider;
  isConfigured: boolean;
  isConnected: boolean;
  onConfigure: () => void;
}

const providerColors = {
  openai: 'from-green-500 to-teal-500',
  anthropic: 'from-orange-500 to-red-500',
  google: 'from-blue-500 to-purple-500',
  ollama: 'from-gray-500 to-gray-700',
  groq: 'from-purple-500 to-pink-500',
  cohere: 'from-blue-600 to-cyan-500',
};

export function APIProviderCard({ 
  provider, 
  isConfigured, 
  isConnected, 
  onConfigure 
}: APIProviderCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${providerColors[provider.type]}`} />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {provider.name}
        </h3>
        <div className="flex items-center gap-2">
          {isConfigured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
          )}
          <motion.button
            onClick={onConfigure}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {isConfigured ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConfigured ? 'Configured' : 'Not configured'}
          </span>
        </div>
        
        {isConfigured && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Available Models:
        </p>
        <div className="flex flex-wrap gap-1">
          {provider.models.slice(0, 3).map((model) => (
            <span
              key={model}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded-full text-gray-700 dark:text-gray-300"
            >
              {model}
            </span>
          ))}
          {provider.models.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded-full text-gray-700 dark:text-gray-300">
              +{provider.models.length - 3} more
            </span>
          )}
        </div>
      </div>

      {!provider.requiresAuth && (
        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
          <p className="text-xs text-green-700 dark:text-green-300">
            No API key required
          </p>
        </div>
      )}
    </motion.div>
  );
}