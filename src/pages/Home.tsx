import { ArrowRight, Quote, MessageSquare, Send } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { members, homeGallery, guestbookMessages } from '../data';

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
            <a href="#guestbook" className="bg-surface text-primary border-2 border-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center">
              Viết Lưu Bút
            </a>
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

      {/* Guestbook Section */}
      <section id="guestbook" className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-headline-lg text-headline-lg text-secondary mb-4">Lưu Bút Yêu Thương</h2>
          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6"></div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Gửi những lời chúc tốt đẹp nhất đến các thành viên trong gia đình.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Messages */}
          <div className="lg:col-span-2 space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {guestbookMessages.map((msg) => (
              <div key={msg.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline/10 family-card-shadow flex gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display-lg text-xl text-white ${
                    msg.recipientType === 'A' ? 'bg-primary' : msg.recipientType === 'B' ? 'bg-secondary' : 'bg-[#e0a96d]'
                  }`}>
                    {msg.sender.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h4 className="font-label-md text-on-surface">{msg.sender}</h4>
                    <span className="text-xs text-on-surface-variant/70">{msg.timeAgo}</span>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${
                    msg.recipientType === 'A' ? 'bg-primary/10 text-primary' : msg.recipientType === 'B' ? 'bg-secondary/10 text-secondary' : 'bg-[#e0a96d]/20 text-[#c2843f]'
                  }`}>
                    {msg.recipient}
                  </span>
                  <p className="font-body-md text-on-surface-variant italic relative">
                    <Quote className="absolute -left-2 -top-2 w-4 h-4 text-outline/30 rotate-180" />
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline/10 h-fit sticky top-[100px]">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-primary w-6 h-6" />
              <h3 className="font-headline-md text-headline-md text-on-surface">Viết Lời Chúc</h3>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">Tên của bạn</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
                  placeholder="Nhập tên..."
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">Gửi đến</label>
                <select className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md">
                  <option>Bố A</option>
                  <option>Mẹ B</option>
                  <option>Con C</option>
                  <option>Cả gia đình</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">Lời chúc</label>
                <textarea
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md min-h-[120px] resize-none"
                  placeholder="Viết những lời chân thành nhất..."
                ></textarea>
              </div>
              <button
                type="button"
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
              >
                Gửi Lời Chúc <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
