import React from 'react';
import Image from 'next/image';
import { Divider } from 'antd';
import { FacebookFilled, LinkedinFilled, XOutlined } from '@ant-design/icons';
import { FOOTER_LINKS, FOOTER_MENU } from '@/utils/constants';

const MainFooter = () => {
  return (
    <footer className="bg-[#525b69] text-white">
      <Divider className="bg-[#7e6285] my-0" />

      <div className="max-w-[1380px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <a href="/" className="flex items-center mb-4">
            <Image
              src="/logo-black.png"
              alt="Legassi - Logo"
              width={220}
              height={60}
              priority
            />
          </a>
          <p className="text-gray-300 text-base leading-relaxed">
            Advanced legal consultancy platform integrating AI Chat and AI
            Document Search for fully digital case management.
          </p>
          <div className="flex space-x-4 mt-6">
            <a
              href="#"
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              <LinkedinFilled style={{ fontSize: '28px' }} />
            </a>
            <a
              href="#"
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              <XOutlined style={{ fontSize: '28px' }} />
            </a>
            <a
              href="#"
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              <FacebookFilled style={{ fontSize: '28px' }} />
            </a>
          </div>
        </div>

        {FOOTER_MENU.map((menu) => (
          <div key={menu.title}>
            <h4 className="font-semibold text-gray-200 text-lg mb-4">
              {menu.title}
            </h4>
            <ul className="space-y-2 pl-0">
              {menu.items.map((item) => (
                <li key={item.title} className="list-none">
                  <a
                    href={item.path}
                    className="text-gray-200 hover:text-white transition text-base"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Divider className="bg-[#a27fab] my-0" />

      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-200">
        <p>© {new Date().getFullYear()} Legassi. All rights reserved.</p>
        <div className="flex gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-white transition"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
