'use client';

import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import comingSoonAnim from '@/assets/comingsoon.json'; 

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center space-y-6">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-gray-900"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Coming Soon
      </motion.h1>

      <motion.p
        className="text-gray-500 text-lg md:text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        We’re working hard on something awesome. Stay tuned!
      </motion.p>

      <motion.div
        className="w-72 h-72"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 120 }}
      >
        <Lottie animationData={comingSoonAnim} loop={true} />
      </motion.div>
    </div>
  );
}
