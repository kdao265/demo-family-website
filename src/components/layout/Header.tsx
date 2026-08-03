import { Heart, Menu } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? 'text-on-primary border-b-2 border-on-primary pb-1 font-label-md text-label-md'
      : 'text-on-primary/80 hover:text-on-primary transition-colors font-label-md text-label-md hover:underline decoration-2 underline-offset-4';
  };

  return (
    <nav className="fixed top-0 w-full h-[72px] bg-primary z-50 shadow-md flex items-center">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 group">
          <Heart className="text-on-primary w-8 h-8 fill-on-primary group-hover:scale-110 transition-transform" />
          <span className="font-display-lg text-headline-md text-on-primary">Love Family</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-on-primary">
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={getLinkClass('/')}>
            Trang Chủ
          </Link>
          <Link to="/story" className={getLinkClass('/story')}>
            Our Story
          </Link>
          <Link to="/gallery" className={getLinkClass('/gallery')}>
            Bộ Ảnh
          </Link>
          <a
            href="/#guestbook"
            className="text-on-primary/80 hover:text-on-primary transition-colors font-label-md text-label-md hover:underline decoration-2 underline-offset-4"
          >
            Lưu Bút
          </a>
          
          {location.pathname === '/story' && (
             <button className="bg-on-primary text-primary px-6 py-2 rounded-full font-label-md text-label-md font-bold transition-all hover:bg-on-primary-container">
               Join Family
             </button>
          )}
        </div>
      </div>
    </nav>
  );
}
