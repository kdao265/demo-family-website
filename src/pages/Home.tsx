import { ArrowRight, Heart, Users, CalendarDays, Images } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { homeGallery } from '../data';

interface FamilyMember {
  id: string;
  full_name: string;
  birth_date: string | null;
  hobbies: string[] | null;
  avatar_url: string | null;
}

export default function Home() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      setLoadingMembers(true);

      const { data, error } = await supabase
        .from('family_members')
        .select(
          'id, full_name, birth_date, hobbies, avatar_url'
        )
        .order('created_at', { ascending: true });

      if (error) {
        console.error(
          'Load homepage members error:',
          error
        );

        setMembers([]);
      } else {
        setMembers(data ?? []);
      }

      setLoadingMembers(false);
    }

    loadMembers();
  }, []);

  return (
    <div className="pt-[72px]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={homeGallery[0]?.imageUrl}
            alt={homeGallery[0]?.imageAlt || 'Khoảnh khắc gia đình'}
            className="w-full h-full object-cover"
          />

          {/* Warm overlays */}
          <div className="absolute inset-0 bg-on-surface/35"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-on-surface/65 via-on-surface/35 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/45 via-transparent to-transparent"></div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24">
          <div className="max-w-3xl text-on-primary">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-on-primary/15 backdrop-blur-sm border border-on-primary/20 font-label-md text-sm mb-6">
              <Heart className="w-4 h-4 fill-current" />
              Mái nhà của chúng ta
            </span>

            <h1 className="font-display-lg text-display-lg md:text-[64px] leading-[1.05] mb-6 drop-shadow-lg">
              Một gia đình.
              <br />
              Nhiều thế hệ.
              <br />
              Một mái nhà.
            </h1>

            <p className="font-body-lg text-lg md:text-xl text-on-primary/90 max-w-2xl leading-relaxed mb-10">
              Nơi lưu giữ những người chúng ta yêu thương, những câu chuyện đã
              đi qua và những khoảnh khắc muốn nhớ mãi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/family-tree"
                className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-7 py-3.5 rounded-full font-label-md shadow-lg hover:bg-primary-container hover:-translate-y-0.5 transition-all duration-200"
              >
                Khám phá gia phả
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/moments"
                className="inline-flex items-center justify-center gap-2 bg-on-primary/10 backdrop-blur-sm border border-on-primary/60 text-on-primary px-7 py-3.5 rounded-full font-label-md hover:bg-on-primary/20 transition-all duration-200"
              >
                Xem những khoảnh khắc
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-label-md text-primary uppercase tracking-[0.15em]">
            Đại gia đình
          </span>

          <h2 className="font-headline-lg text-headline-lg text-secondary mt-3 mb-5">
            Mỗi người là một mảnh ghép của mái nhà này
          </h2>

          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6"></div>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Có những người đã cùng ta đi qua cả một đời, có những người mới
            bước vào hành trình này. Dù ở đâu hay thuộc thế hệ nào, mỗi thành
            viên đều góp một phần câu chuyện để làm nên gia đình chúng ta hôm nay.
          </p>
        </div>
      </section>

      {/* =========================================================
          FAMILY MEMBERS
      ========================================================= */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="font-label-md text-primary uppercase tracking-[0.15em]">
                Những người thân yêu
              </span>

              <h2 className="font-headline-lg text-headline-lg text-secondary mt-3">
                Thành viên gia đình
              </h2>

              <div className="w-16 h-1 bg-primary/30 rounded-full mt-4"></div>
            </div>

            <p className="font-body-md text-on-surface-variant max-w-md">
              Những gương mặt thân quen tạo nên sự ấm áp của mái nhà này.
            </p>
          </div>

          {loadingMembers ? (
            <div className="text-center py-16">
              <p className="font-body-md text-on-surface-variant">
                Đang tải thành viên...
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body-md text-on-surface-variant">
                Chưa có thành viên nào được giới thiệu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {members.slice(0, 6).map((member) => (
                <article
                  key={member.id}
                  className="group bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline/10 family-card-shadow hover-lift"
                >
                  <div className="relative h-72 overflow-hidden">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.full_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                        <span className="font-headline-lg text-5xl text-primary/30">
                          {member.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
          
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 via-transparent to-transparent"></div>
          
                    <div className="absolute left-5 right-5 bottom-5">
                      <h3 className="font-headline-md text-xl text-on-primary">
                        {member.full_name}
                      </h3>
                    </div>
                  </div>
          
                  <div className="p-6">
                    <p className="font-body-md text-on-surface-variant mb-4">
                      {member.birth_date
                        ? `Sinh ngày ${member.birth_date}`
                        : 'Ngày sinh chưa cập nhật'}
                    </p>
          
                    <div className="flex flex-wrap gap-2">
                      {(member.hobbies ?? []).map((hobby) => (
                        <span
                          key={hobby}
                          className="px-3 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-medium"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
          
                    <div className="mt-6 pt-5 border-t border-outline/10">
                      <Link
                        to="/story"
                        className="inline-flex items-center gap-2 text-primary font-label-md group-hover:gap-3 transition-all"
                      >
                        Xem câu chuyện
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          FAMILY TODAY
      ========================================================= */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="font-label-md text-primary uppercase tracking-[0.15em]">
              Nhà mình hôm nay
            </span>

            <h2 className="font-headline-lg text-headline-lg text-secondary mt-3 mb-5">
              Vẫn là mái nhà ấy, chỉ là thời gian đã đi qua
            </h2>

            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Gia đình lớn lên cùng năm tháng. Mỗi thế hệ đi qua đều để lại những
              câu chuyện, những kỷ niệm và những người thân yêu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface-container-low rounded-3xl p-8 text-center border border-outline/10">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7" />
              </div>

              <p className="font-headline-md text-3xl text-secondary mb-2">
                {members.length}
              </p>

              <p className="font-body-md text-on-surface-variant">
                Thành viên đang được giới thiệu
              </p>
            </div>

            <div className="bg-surface-container-low rounded-3xl p-8 text-center border border-outline/10">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                <CalendarDays className="w-7 h-7" />
              </div>

              <p className="font-headline-md text-3xl text-secondary mb-2">
                Nhiều thế hệ
              </p>

              <p className="font-body-md text-on-surface-variant">
                Cùng chung một mái nhà
              </p>
            </div>

            <div className="bg-surface-container-low rounded-3xl p-8 text-center border border-outline/10">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                <Images className="w-7 h-7" />
              </div>

              <p className="font-headline-md text-3xl text-secondary mb-2">
                {homeGallery.length}
              </p>

              <p className="font-body-md text-on-surface-variant">
                Khoảnh khắc đang được lưu giữ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAMILY STORY
      ========================================================= */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-label-md text-primary uppercase tracking-[0.15em]">
                Câu chuyện
              </span>

              <h2 className="font-headline-lg text-headline-lg text-secondary mt-3 mb-6">
                Những năm tháng đã làm nên chúng ta
              </h2>

              <div className="w-16 h-1 bg-primary/30 rounded-full mb-6"></div>

              <p className="font-body-md text-on-surface-variant leading-relaxed mb-5">
                Một gia đình không chỉ được tạo nên bởi những người cùng chung
                huyết thống, mà còn bởi những bữa cơm, những lần đoàn tụ, những
                niềm vui và cả những thử thách cùng nhau vượt qua.
              </p>

              <p className="font-body-md text-on-surface-variant leading-relaxed mb-8">
                Mỗi thế hệ đi qua đều để lại một câu chuyện. Và những câu chuyện
                ấy xứng đáng được kể lại cho những người đến sau.
              </p>

              <Link
                to="/story"
                className="inline-flex items-center gap-2 text-primary font-label-md hover:gap-3 transition-all"
              >
                Đọc câu chuyện gia đình
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 rotate-2"></div>

              <div className="relative rounded-[2rem] overflow-hidden shadow-xl">
                <img
                  src={homeGallery[4]?.imageUrl || homeGallery[0]?.imageUrl}
                  alt={
                    homeGallery[4]?.imageAlt ||
                    homeGallery[0]?.imageAlt ||
                    'Gia đình'
                  }
                  className="w-full h-[420px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MOMENTS
      ========================================================= */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <span className="font-label-md text-primary uppercase tracking-[0.15em]">
                Ký ức
              </span>

              <h2 className="font-headline-lg text-headline-lg text-secondary mt-3">
                Khoảnh khắc đáng nhớ
              </h2>

              <div className="w-16 h-1 bg-primary/30 rounded-full mt-4"></div>
            </div>

            <Link
              to="/moments"
              className="inline-flex items-center gap-2 text-primary font-label-md hover:gap-3 transition-all"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {homeGallery.slice(0, 5).map((photo, index) => {
              const layoutClass =
                index === 0
                  ? 'md:col-span-6 md:row-span-2 h-[420px]'
                  : 'md:col-span-3 h-[200px]';

              return (
                <Link
                  to="/moments"
                  key={photo.id}
                  className={`group relative rounded-2xl overflow-hidden ${layoutClass}`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/75 via-transparent to-transparent"></div>

                  <div className="absolute left-5 right-5 bottom-5">
                    <p className="text-on-primary font-label-md text-sm">
                      {photo.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          GUESTBOOK CTA
      ========================================================= */}
      <section className="px-margin-mobile md:px-margin-desktop py-20 bg-primary">
        <div className="max-w-3xl mx-auto text-center text-on-primary">
          <Heart className="w-10 h-10 fill-current mx-auto mb-5" />

          <h2 className="font-headline-lg text-headline-lg mb-4">
            Gửi một lời đến gia đình
          </h2>

          <p className="font-body-md text-on-primary/85 leading-relaxed max-w-xl mx-auto mb-8">
            Có những điều đôi khi thật khó nói thành lời. Hãy để lại một lời
            nhắn cho những người bạn yêu thương.
          </p>

          <Link
            to="/guestbook"
            className="inline-flex items-center gap-2 bg-on-primary text-primary px-7 py-3.5 rounded-full font-label-md hover:bg-on-primary-container transition-colors"
          >
            Viết Lưu Bút
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
