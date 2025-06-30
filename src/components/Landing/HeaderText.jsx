import React from 'react';
import { motion } from 'framer-motion';

const HeaderText = () => {
  return (
    <div className="text-[#055B5C] text-center px-4 py-4 max-w-2xl mx-auto font-vazir mt-1 md:mt-4 cursor-context-menu">

      <motion.h2
        className="text-base md:text-4xl font-extrabold mb-2 md:mb-4 leading-snug md:leading-normal"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        !فراتر از حد توان خودت برو
      </motion.h2>

      <motion.p
        className="text-xs md:text-[22px] leading-relaxed md:leading-loose font-bold md:font-extrabold"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      >
        با تمرین‌های تخصصی و انرژی مثبت، مرزهای تواناییت رو جابجا کن
        <br />
        هر روز یک فرصت تازه برای بهتر شدن
      </motion.p>

    </div>

  );
};

export default HeaderText;
