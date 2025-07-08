'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Key, Save, X } from 'lucide-react';

interface APIKeyInputProps {
  providerId: string;
  providerName: string;
  onSave: (key: string) => void;
  onCancel: () => void;
  existingKey?: string;
}

export function APIKeyInput({ 
  providerId: _providerId, 
  providerName, 
  onSave, 
  onCancel, 
  existingKey 
}: APIKeyInputProps) {
  const [key, setKey] = useState(existingKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    } else {
      setIsValid(false);
    }
  };

  const handleKeyChange = (value: string) => {
    setKey(value);
    setIsValid(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Key className="w-5 h-5" />
            Configure {providerName}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder="Enter your API key..."
              className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isValid ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {!isValid && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid API key</p>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            🔒 Your API key is encrypted and stored locally in your browser. It never leaves your device.
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" />
            Save
          </motion.button>
          <motion.button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}