import { motion } from 'framer-motion';

// Predefined widths for skeleton lines to ensure consistency between server and client
const skeletonLineWidths = ['85%', '90%', '80%', '95%'];

export default function ContentCardSkeleton() {
  return (
    <motion.div
      className="relative w-full max-w-[448px] h-screen bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-h-[60vh] space-y-4">
        <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
        <div className="h-8 w-3/4 mx-auto bg-gray-700/50 rounded animate-pulse" />
        <div className="space-y-2">
          {skeletonLineWidths.map((width, i) => (
            <div
              key={i}
              className="h-4 bg-gray-700/50 rounded animate-pulse"
              style={{ width }}
            />
          ))}
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 bg-black/30 p-2 rounded-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-12 h-12 bg-gray-700/50 rounded-full animate-pulse"
          />
        ))}
      </div>
    </motion.div>
  );
} 