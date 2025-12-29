import { motion } from 'framer-motion';

export default function CurvedTransition() {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 1 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      style={{ transformOrigin: 'top' }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,0 L1440,0 L1440,800 Q720,700 0,800 Z"
          fill="url(#gradient)"
          initial={{ d: "M0,0 L1440,0 L1440,0 Q720,0 0,0 Z" }}
          animate={{ d: "M0,0 L1440,0 L1440,800 Q720,700 0,800 Z" }}
          exit={{ d: "M0,0 L1440,0 L1440,0 Q720,0 0,0 Z" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
