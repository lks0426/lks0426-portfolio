'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypeWriterProps {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetween?: number;
  className?: string;
}

export function TypeWriter({ 
  texts, 
  typeSpeed = 100, 
  deleteSpeed = 50, 
  delayBetween = 2000,
  className = ''
}: TypeWriterProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex];
      
      if (!isDeleting) {
        if (currentText !== current) {
          setCurrentText(current.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delayBetween);
          return;
        }
      } else {
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        } else {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts, typeSpeed, deleteSpeed, delayBetween]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[1.2em] ml-1 bg-current"
      />
    </span>
  );
}