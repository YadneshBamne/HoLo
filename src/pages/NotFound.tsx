import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import FuzzyText from '../components/FuzzyText';

export default function NotFound() {
  return (
    <div className="min-h-screen  from-primary via-primary-light to-primary-lighter flex items-center justify-center px-4 overflow-hidden relative">
      {/* Decorative Blurs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-dark rounded-full blur-3xl" />
      </div>

      {/* Animated Wave SVG Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 240 100" preserveAspectRatio="none">
          <motion.path
            d="M0 50 C 20 40, 40 60, 60 50 C 80 40, 100 60, 120 50 C 140 40, 160 60, 180 50 C 200 40, 220 60, 240 50"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </svg>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Fuzzy 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="mb-8"
        >
          <FuzzyText 
            baseIntensity={0.2} 
            hoverIntensity={0.8} 
            enableHover={true}
          >
            <span className="text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[24rem] font-black text-white drop-shadow-2xl leading-none font-mono">
              404
            </span>
          </FuzzyText>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-lg">
            Oops! Page Not Found
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto">
            Looks like this thread got tangled! The page you're looking for doesn't exist.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-dark font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-full border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 text-white/60 text-sm"
        >
          <p>🧶 Lost in the loops? Let's get you back on track!</p>
        </motion.div>
      </div>
    </div>
  );
}
