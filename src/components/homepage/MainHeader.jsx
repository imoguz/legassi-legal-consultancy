'use client';

import React, { useEffect } from 'react';
import { Button, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MobileMenu from './MainMobileMenu';
import { getAuthVerifyFromToken } from '@/utils/helpers';

const MainHeader = () => {
  const router = useRouter();

  const menuItems = [
    { key: '/', label: 'Home' },
    { key: '/price', label: 'Price' },
    { key: '/about-us', label: 'About Us' },
    { key: '/contact-us', label: 'Contact Us' },
  ];

  const onMenuClick = ({ key }) => {
    router.push(key);
  };

  useEffect(() => {
    getAuthVerifyFromToken();
  }, []);

  return (
    <header className="mainheader absolute top-0 z-50 flex justify-between items-center w-full h-20 px-10 bg-transparent">
      <a href="/">
        <Image
          src="/logo-white.png"
          alt="Legassi - Logo"
          width={220}
          height={60}
          priority
        />
      </a>

      {/* Menü */}
      <div className="hidden md:block flex-grow">
        <Menu
          mode="horizontal"
          items={menuItems}
          onClick={onMenuClick}
          className="w-full flex justify-center bg-transparent text-white"
          style={{
            background: 'transparent',
            color: 'white',
            borderBottom: 'none',
            fontSize: '18px',
          }}
        />
      </div>

      {/* Sağ taraf */}
      <div className="flex gap-3 flex-shrink-0 min-w-36 justify-end">
        <Button
          href="/auth/login"
          size="large"
          className="rounded-full"
          style={{
            background: 'transparent',
            color: 'white',
          }}
        >
          Login
        </Button>
        <Button
          href="/auth/signup"
          size="large"
          type="default"
          className="rounded-full"
        >
          Sign-up
        </Button>
      </div>

      <MobileMenu menuItems={menuItems} />
    </header>
  );
};

export default MainHeader;
