import { Heart, Search } from 'lucide-react';
import React from 'react';

export default function FamilyTree() {
  return (
    <div className="pt-[72px] min-h-screen bg-surface">
      {/* Header */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-b border-outline/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label-md text-primary uppercase tracking-[0.15em]">
            Cội nguồn
          </span>

          <h1 className="font-display-lg text-display-lg text-secondary mt-3 mb-5">
            Gia Phả Gia Đình
          </h1>

          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6"></div>

          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Tìm hiểu những thế hệ đã cùng nhau tạo nên mái nhà này.
          </p>
        </div>
      </section>

      {/* Temporary tree introduction */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-5xl mx-auto">
          <div className="bg-surface-container-low rounded-[2rem] p-8 md:p-12 border border-outline/10 text-center">
            <Heart className="w-10 h-10 text-primary fill-current mx-auto mb-5" />

            <h2 className="font-headline-lg text-headline-lg text-secondary mb-4">
              Cây gia phả đang được xây dựng
            </h2>

            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-8">
              Đây sẽ là nơi các thành viên có thể khám phá từng thế hệ,
              tìm hiểu mối quan hệ giữa các thành viên và mở xem câu chuyện
              của từng người.
            </p>

            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />

              <input
                type="text"
                placeholder="Tìm thành viên..."
                className="w-full bg-surface border border-outline/30 rounded-full py-3 pl-12 pr-5 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
