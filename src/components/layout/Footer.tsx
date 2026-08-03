import { Heart } from 'lucide-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isGallery = location.pathname === '/gallery';

  return (
    <footer className={`w-full py-section-gap ${isGallery ? 'bg-surface-container-highest' : 'bg-secondary-container text-on-secondary-container border-t border-primary/10'}`}>
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-8">
        <div className="text-center md:text-left">
          <div className={`flex items-center gap-2 mb-4 justify-center md:justify-start ${isGallery ? 'text-primary' : 'text-on-secondary-container'}`}>
            {!isGallery && <Heart className="w-8 h-8 fill-current" />}
            <span className="font-display-lg text-headline-md">Love Family</span>
          </div>
          {isGallery ? (
             <p className="font-body-md text-body-md text-on-surface">© 2024 Love Family Heritage. All rights reserved.</p>
          ) : (
            <>
              <p className="font-body-md text-current/70 max-w-xs mb-4">Gia đình là điều tuyệt vời nhất mà chúng ta từng có. Hãy trân trọng từng phút giây.</p>
              <p className="font-body-md text-current/60">© 2024 Love Family. Built with Heart.</p>
            </>
          )}
        </div>

        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-8">
            <a href="#" className={`font-label-md text-label-md transition-colors hover:underline ${isGallery ? 'text-on-surface-variant hover:text-secondary' : 'text-on-secondary/70 hover:text-on-secondary'}`}>
              Privacy Policy
            </a>
            <a href="#" className={`font-label-md text-label-md transition-colors hover:underline ${isGallery ? 'text-on-surface-variant hover:text-secondary' : 'text-on-secondary/70 hover:text-on-secondary'}`}>
              Contact Us
            </a>
            <a href="#" className={`font-label-md text-label-md transition-colors hover:underline ${isGallery ? 'text-on-surface-variant hover:text-secondary' : 'text-on-secondary/70 hover:text-on-secondary'}`}>
              Archive
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
