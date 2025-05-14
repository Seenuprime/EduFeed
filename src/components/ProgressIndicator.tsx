import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentIndex: number;
  totalItems: number;
}

export default function ProgressIndicator({ currentIndex, totalItems }: ProgressIndicatorProps) {
  const progress = ((currentIndex + 1) / totalItems) * 100;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-10 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-white"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </div>
  );
} 