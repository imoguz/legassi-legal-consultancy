'use client';

import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function ContentDrawer({
  buttonText,
  drawerTitle,
  children,
  width = 280,
  content,
}) {
  const [open, setOpen] = useState(false);
  const collapsed = useSelector((state) => state.sidebar.collapsed);

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return collapsed ? window.innerWidth >= 980 : window.innerWidth >= 1200;
  });

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(
        collapsed ? window.innerWidth >= 980 : window.innerWidth >= 1200
      );
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, [collapsed]);

  return (
    <div className="relative flex h-full w-full">
      {/* History button */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          className="absolute top-4 left-0 bg-[#13c2c2] text-white p-1 rounded-r-md shadow-md cursor-pointer"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
        >
          {buttonText}
        </div>
      )}

      {/* Drawer panel */}
      <motion.div
        initial={{ x: -width }}
        animate={{ x: open ? 0 : -width }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`absolute -my-3 top-0 left-0 h-screen bg-white z-20 ${
          open ? 'shadow-md' : 'shadow-none'
        }`}
        style={{ width: width }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-solid border-x-0 border-b border-gray-200 ">
          <h3 className="font-medium px-4 py-1 rounded-md bg-[#13c2c2] text-white">
            {drawerTitle}
          </h3>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-3rem)]">
          {children}
        </div>
      </motion.div>

      {/* Content wrapper */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{
          width: !isDesktop
            ? '100%'
            : open
            ? `calc(100% - ${width}px)`
            : '100%',
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="ml-auto h-full overflow-hidden"
      >
        {content}
      </motion.div>
    </div>
  );
}
