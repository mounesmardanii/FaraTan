import React from 'react';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <div className="w-full flex justify-center px-0 pt-2 pb-4 -mt-2">
      <motion.img
        src={assets.headerPic}
        alt="header"
        className="w-full max-w-6xl h-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};

export default Header;
