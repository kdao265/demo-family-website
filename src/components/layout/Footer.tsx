import { Heart } from 'lucide-react';
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-secondary text-on-secondary-container border-t border-primary/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Heart className="w-6 h-6 fill-current" />
              <span className="font-display-lg text-headline-md">
                Love Family
              </span>
            </div>

            <p className="font-body-md text-on-secondary-container/80 max-w-md">
              Một nơi nhỏ để gia đình lưu giữ những người mình yêu thương,
              những câu chuyện đã đi qua và những khoảnh khắc muốn nhớ mãi.
            </p>
          </div>

          {/* Simple message */}
          <div className="text-center md:text-right">
            <p className="font-headline-md text-lg mb-2">
              Một gia đình. Nhiều thế hệ. Một mái nhà.
            </p>

            <p className="font-body-md text-on-secondary-container/60">
              Được xây dựng bằng tình yêu.
            </p>
          </div>
        </div>

        <div className="border-t border-on-secondary-container/10 mt-8 pt-6 text-center">
          <p className="font-body-md text-sm text-on-secondary-container/60">
            © 2026 Love Family
          </p>
        </div>
      </div>
    </footer>
  );
}
