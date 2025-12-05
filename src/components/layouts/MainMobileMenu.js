'use client';

import React from 'react';
import { Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const MobileMenu = ({ menuItems = [] }) => {
  const router = useRouter();

  const items = menuItems.map((item) => ({
    key: item.key,
    label: <span>{item.label}</span>,
  }));

  const onClick = ({ key }) => {
    router.push(key);
  };

  return (
    <div className="block md:hidden">
      <Dropdown trigger={['click']} menu={{ items, onClick }}>
        <div className="w-12 h-11 cursor-pointer flex items-center justify-center active:scale-95 text-white opacity-85 hover:opacity-100">
          <MenuOutlined style={{ fontSize: '22px' }} />
        </div>
      </Dropdown>
    </div>
  );
};

export default MobileMenu;
