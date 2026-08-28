import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import FamilyMemberCard from '../components/family/FamilyMemberCard';
import { members } from '../data';

export default function FamilyTree() {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    null
  );

  return (
    <div className="pt-[72px] min-h-screen bg-surface">
      {/* Page Header */}
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
            Mỗi thế hệ là một phần của câu chuyện. Hãy cùng tìm về những
            người đã tạo nên mái nhà này.
          </p>
        </div>
      </section>

      {/* Tree */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop overflow-x-auto">
        <div className="max-w-6xl mx-auto min-w-[760px]">
          <div className="text-center mb-12">
            <span className="font-label-md text-primary uppercase tracking-[0.15em]">
              Cây gia phả
            </span>

            <h2 className="font-headline-lg text-headline-lg text-secondary mt-3">
              Các thành viên
            </h2>
          </div>

          {/* Temporary first generation */}
          <div className="flex justify-center">
            <div className="relative">
              {members[0] && (
                <FamilyMemberCard
                  member={members[0]}
                  isSelected={selectedMemberId === members[0].id}
                  onClick={() =>
                    setSelectedMemberId(
                      selectedMemberId === members[0].id
                        ? null
                        : members[0].id
                    )
                  }
                />
              )}
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center py-6">
            <div className="w-px h-12 bg-primary/30"></div>
          </div>

          {/* Temporary second generation */}
          <div className="flex justify-center gap-12">
            {members.slice(1).map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                isSelected={selectedMemberId === member.id}
                onClick={() =>
                  setSelectedMemberId(
                    selectedMemberId === member.id ? null : member.id
                  )
                }
              />
            ))}
          </div>

          {/* Selected member info */}
          {selectedMemberId && (
            <div className="max-w-2xl mx-auto mt-12 bg-surface-container-low rounded-3xl p-8 border border-outline/10">
              {(() => {
                const member = members.find(
                  (item) => item.id === selectedMemberId
                );

                if (!member) return null;

                return (
                  <div className="text-center">
                    <Heart className="w-7 h-7 text-primary fill-current mx-auto mb-4" />

                    <h3 className="font-headline-md text-headline-md text-secondary mb-2">
                      {member.name}
                    </h3>

                    <p className="font-body-md text-on-surface-variant">
                      Sinh ngày {member.birthDate}
                    </p>

                    {member.shortBio && (
                      <p className="font-body-md text-on-surface-variant mt-4 leading-relaxed">
                        {member.shortBio}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
