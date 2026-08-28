import { Heart, Menu } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Trang Chủ' },
    { path: '/family-tree', label: 'Gia Phả' },
    { path: '/story', label: 'Câu Chuyện' },
    { path: '/moments', label: 'Khoảnh Khắc' },
    { path: '/guestbook', label: 'Lưu Bút' },
  ];

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;

    return isActive
      ? 'text-on-primary font-label-md text-label-md relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[2px] after:bg-on-primary'
      : 'text-on-primary/80 hover:text-on-primary transition-colors font-label-md text-label-md';
  };

  return (
    <nav className="fixed top-0 w-full h-[72px] bg-primary z-50 shadow-md flex items-center">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <Heart className="text-on-primary w-8 h-8 fill-on-primary group-hover:scale-110 transition-transform" />
          <span className="font-display-lg text-headline-md text-on-primary">
            Love Family
          </span>
        </Link>

        {/* Mobile menu button - functionality will be added later */}
        <button
          type="button"
          className="md:hidden text-on-primary p-2"
          aria-label="Mở menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={getLinkClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
