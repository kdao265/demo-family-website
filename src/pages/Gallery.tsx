import { Heart, Search, Filter } from 'lucide-react';
import React from 'react';
import { anniversaryPhotos } from '../data';

export default function Gallery() {
  return (
    <div className="pt-[72px] bg-surface-container-lowest min-h-screen">
      {/* Header Section */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop text-center border-b border-outline/10 bg-surface">
        <h1 className="font-display-lg text-display-lg text-secondary mb-4 animate-fade-in-up">
          Khoảnh Khắc
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8 animate-fade-in-up">
          Những khoảnh khắc được lưu giữ qua năm tháng, từ những ngày bình thường
          đến những dịp đặc biệt của gia đình.
        </p>
        
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khoảnh khắc..." 
              className="w-full md:w-80 bg-surface border border-outline/30 rounded-full py-2.5 pl-12 pr-4 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="flex-shrink-0 bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-sm whitespace-nowrap shadow-sm">
              Tất cả ảnh
            </button>
            <button className="flex-shrink-0 bg-surface text-on-surface-variant border border-outline/20 px-6 py-2.5 rounded-full font-label-md text-sm whitespace-nowrap hover:bg-surface-variant hover:text-on-surface transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" /> Đám cưới 1980
            </button>
            <button className="flex-shrink-0 bg-surface text-on-surface-variant border border-outline/20 px-6 py-2.5 rounded-full font-label-md text-sm whitespace-nowrap hover:bg-surface-variant hover:text-on-surface transition-colors flex items-center gap-2">
              <Heart className="w-4 h-4" /> Yêu thích
            </button>
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="gallery-masonry">
          {anniversaryPhotos.map((photo, index) => (
            <div key={photo.id} className="gallery-item group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <img 
                src={photo.imageUrl} 
                alt={photo.imageAlt} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white font-headline-md text-xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {photo.title}
                </h3>
                <div className="flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  <span className="text-white/80 font-body-md text-sm">Gia đình</span>
                  <button className={`p-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors ${photo.liked ? 'text-primary' : 'text-white'}`}>
                    <Heart className={`w-5 h-5 ${photo.liked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
