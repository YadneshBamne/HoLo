import { Home, Package, Heart, Info, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import MotionDrawer from './motion-drawer';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Package, label: 'All Products', path: '/#products' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: Info, label: 'About Us', path: '#about' },
    { icon: Mail, label: 'Contact', path: '#contact' },
  ];

  const framerText = (delay: number) => {
    return {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: {
        delay: 0.3 + delay / 10,
      },
    };
  };

  const framerIcon = (delay: number) => {
    return {
      initial: { scale: 0 },
      animate: { scale: 1 },
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.4 + delay / 10,
      },
    };
  };

  return (
    <MotionDrawer direction="left" width={320} className="text-gray-900 ">
      <div className="flex flex-col h-full ">
        {/* Header */}
        {/* <div className="flex items-center gap-3 p-6 border-b border-primary-lighter bg-gradient-to-r from-primary-lighter to-white">
          <div className="text-3xl">🧶</div>
          <div>
            <h2 className="text-xl font-bold text-primary-dark">Hooks & Loops</h2>
            <p className="text-xs text-gray-600">Handcrafted with love</p>
          </div>
        </div> */}

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 font-f1">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-all hover:bg-primary-lighter border-b border-gray-100 group"
                  >
                    <motion.span
                      {...framerText(idx)}
                      className="font-bold text-gray-700 group-hover:text-primary-dark"
                    >
                      {item.label}
                    </motion.span>
                    <motion.div {...framerIcon(idx)}>
                      <Icon className="w-5 h-5 text-primary group-hover:text-primary-dark transition-colors" />
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {/* <div className="p-6 border-t border-primary-lighter bg-primary-lighter/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Welcome!</p>
              <p className="text-xs text-gray-600">Guest User</p>
            </div>
          </div>
          <button className="w-full bg-primary text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors">
            Sign In
          </button>
        </div> */}
      </div>
    </MotionDrawer>
  );
}
