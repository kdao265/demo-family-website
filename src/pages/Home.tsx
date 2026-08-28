import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { members, homeGallery } from '../data';

export default function Home() {
  return (
    <div className="pt-[72px]">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_vY1iFhN7xI2JqY7uW2H0Gq2Xf0c1lT-lX9B0Hk7iL50n1y0j_H41P8PjVj-4NqR5p1sO5lJpD0y15KxO-1oPq927vU8Hq9K40xOQn4j1U0PqN0-8zI_nLp2L3f8V2tJ4_L2wR09I5N3L1_X0q59o2oP1V1j4Z3B9fX4PqP4Y8I0T1t2N6x6V"
            alt="Family background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-surface"></div>
        </div>
        
        <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="font-display-lg text-display-lg text-primary mb-6 drop-shadow-sm">
            Nơi Tình Yêu<br />Bắt Đầu & Mãi Mãi
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed">
            Chào mừng đến với không gian lưu giữ những khoảnh khắc quý giá của gia đình chúng ta.
            Mỗi bức ảnh, mỗi câu chuyện là một viên gạch xây dựng nên tổ ấm này.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/story" className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              Khám Phá Câu Chuyện <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/guestbook"
              className="bg-surface text-primary border-2 border-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center"
            >
              Viết Lưu Bút
            </Link>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-headline-lg text-headline-lg text-secondary mb-4">Thành Viên Gia Đình</h2>
          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6"></div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Những mảnh ghép không thể thiếu tạo nên bức tranh hạnh phúc hoàn hảo của chúng ta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden family-card-shadow hover-lift group border border-outline/10">
              <div className="h-64 overflow-hidden relative">
                <img
                  src={member.imageUrl}
                  alt={member.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-label-md">Xem chi tiết</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{member.name}</h3>
                <p className="text-primary font-label-md mb-4">{member.birthDate}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {member.hobbies.map((hobby, index) => (
                    <span key={index} className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-xs font-medium">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y border-outline/10">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 animate-fade-in-up">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-secondary mb-4">Khoảnh Khắc Đáng Nhớ</h2>
              <div className="w-16 h-1 bg-primary/30 rounded-full"></div>
            </div>
            <Link to="/gallery" className="text-primary font-label-md hover:underline flex items-center gap-1 group">
              Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {homeGallery.map((photo, index) => (
              <div
                key={photo.id}
                className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  index === 0 ? 'md:col-span-2 md:row-span-2 h-64 md:h-full' : 'h-64'
                }`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-label-md">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
