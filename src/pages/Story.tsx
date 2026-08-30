import { Heart, Calendar, Award, BookOpen } from 'lucide-react';
import React from 'react';
import { timelineEvents, coreValues, timelineSnippet } from '../data';

export default function Story() {
  return (
    <div className="pt-[72px]">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_vY1iFhN7xI2JqY7uW2H0Gq2Xf0c1lT-lX9B0Hk7iL50n1y0j_H41P8PjVj-4NqR5p1sO5lJpD0y15KxO-1oPq927vU8Hq9K40xOQn4j1U0PqN0-8zI_nLp2L3f8V2tJ4_L2wR09I5N3L1_X0q59o2oP1V1j4Z3B9fX4PqP4Y8I0T1t2N6x6V"
            alt="Family background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-highest/80 to-surface"></div>
        </div>
        
        <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="font-display-lg text-display-lg text-secondary mb-6">Câu chuyện của gia đình</h1>
          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6"></div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Mỗi gia đình là một cuốn sách lịch sử được viết bằng tình yêu. Hãy cùng nhìn lại những trang sách đẹp nhất của đại gia đình chúng ta.
          </p>
        </div>
      </section>

      {/* Main Timeline Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="relative timeline-line">
          {timelineEvents.map((event, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={event.year} className={`relative flex flex-col md:flex-row items-center mb-24 last:mb-0 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                {/* Center Node */}
                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-12 h-12 bg-surface rounded-full border-4 border-primary flex items-center justify-center z-10 shadow-md">
                  <Heart className="w-5 h-5 text-primary fill-primary" />
                </div>

                {/* Content */}
                <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                  <div className="bg-surface-container-lowest p-8 rounded-2xl family-card-shadow hover-lift">
                    <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full font-label-md text-label-md mb-4">
                      Năm {event.year}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">{event.title}</h3>
                    <p className="font-body-md text-on-surface-variant mb-6">{event.description}</p>
                    <div className="rounded-xl overflow-hidden shadow-inner h-64">
                      <img
                        src={event.imageUrl}
                        alt={event.imageAlt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Embedded 1980 Mini Timeline */}
      <section className="py-16 bg-surface-container-low border-y border-outline/10">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <h3 className="font-headline-md text-headline-md text-secondary mb-2">Nhìn lại ngày 15/08/1980</h3>
            <p className="font-body-md text-on-surface-variant">Một ngày mùa thu đáng nhớ...</p>
          </div>
          
          <div className="space-y-6 pl-4 md:pl-0 border-l-2 md:border-l-0 md:border-t-2 border-primary/20 md:flex md:space-y-0 md:space-x-6 relative md:pt-8">
            {timelineSnippet.map((item) => (
              <div key={item.id} className="relative md:flex-1 pl-6 md:pl-0 pt-2 md:pt-0 pb-6 md:pb-0">
                <div className="absolute -left-[31px] md:left-1/2 md:-top-[41px] md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-surface-container-low shadow-sm"></div>
                <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline/10 shadow-sm md:text-center hover:border-primary/30 transition-colors">
                  <div className="flex items-center md:justify-center gap-2 text-primary mb-2 font-label-md">
                    <Calendar className="w-4 h-4" />
                    <span>{item.time}</span>
                  </div>
                  <h4 className="font-headline-md text-lg text-on-surface mb-2">{item.title}</h4>
                  <p className="font-body-md text-sm text-on-surface-variant">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-headline-lg text-headline-lg text-secondary mb-4">Giá trị gia đình</h2>
          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6"></div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Những viên gạch tinh thần xây dựng nên nền móng vững chắc của gia đình qua nhiều thế hệ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value) => {
            return (
              <div key={value.id} className="text-center p-8 bg-surface rounded-2xl border border-outline/10 family-card-shadow hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  {value.iconName === 'Heart' && (
                    <Heart className="w-8 h-8" />
                  )}
                  
                  {value.iconName === 'Award' && (
                    <Award className="w-8 h-8" />
                  )}
                  
                  {value.iconName === 'BookOpen' && (
                    <BookOpen className="w-8 h-8" />
                  )}
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">{value.title}</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
