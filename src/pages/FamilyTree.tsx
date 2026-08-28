import { Heart } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import FamilyMemberCard from '../components/family/FamilyMemberCard';
import FamilyTreeBranch from '../components/family/FamilyTreeBranch';
import { supabase } from '../lib/supabase';

interface FamilyMember {
  id: string;
  family_id: string;
  full_name: string;
  birth_date: string | null;
  relation_title: string | null;
  short_bio: string | null;
  hobbies: string[] | null;
  avatar_url: string | null;
}

interface FamilyRelationship {
  id: string;
  parent_id: string;
  child_id: string;
}

interface FamilyCouple {
  id: string;
  person1_id: string;
  person2_id: string;
}

interface DisplayMember {
  id: string;
  name: string;
  birthDate: string;
  hobbies: string[];
  imageUrl: string;
  imageAlt: string;
  relation?: string;
  shortBio?: string;
}

export default function FamilyTree() {
  const [members, setMembers] = useState<DisplayMember[]>([]);
  const [relationships, setRelationships] = useState<
    FamilyRelationship[]
  >([]);
  const [couples, setCouples] = useState<FamilyCouple[]>([]);

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadFamilyTree() {
      setLoading(true);
      setErrorMessage('');

      const [membersResult, relationshipsResult, couplesResult] =
        await Promise.all([
          supabase
            .from('family_members')
            .select(
              'id, family_id, full_name, birth_date, relation_title, short_bio, hobbies, avatar_url'
            )
            .order('created_at', { ascending: true }),

          supabase
            .from('family_relationships')
            .select('id, parent_id, child_id')
            .order('created_at', { ascending: true }),

          supabase
            .from('family_couples')
            .select('id, person1_id, person2_id')
            .order('created_at', { ascending: true }),
        ]);

      if (membersResult.error) {
        console.error(
          'Load family members error:',
          membersResult.error
        );
        setErrorMessage('Không thể tải dữ liệu thành viên.');
        setLoading(false);
        return;
      }

      if (relationshipsResult.error) {
        console.error(
          'Load family relationships error:',
          relationshipsResult.error
        );
        setErrorMessage('Không thể tải dữ liệu gia phả.');
        setLoading(false);
        return;
      }

      if (couplesResult.error) {
        console.error(
          'Load family couples error:',
          couplesResult.error
        );
        setErrorMessage('Không thể tải quan hệ vợ chồng.');
        setLoading(false);
        return;
      }

      const mappedMembers: DisplayMember[] = (
        membersResult.data ?? []
      ).map((member: FamilyMember) => ({
        id: member.id,
        name: member.full_name,
        birthDate: member.birth_date ?? 'Chưa cập nhật',
        hobbies: member.hobbies ?? [],
        imageUrl:
          member.avatar_url ||
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
        imageAlt: member.full_name,
        relation: member.relation_title ?? undefined,
        shortBio: member.short_bio ?? undefined,
      }));

      setMembers(mappedMembers);
      setRelationships(relationshipsResult.data ?? []);
      setCouples(couplesResult.data ?? []);
      setLoading(false);
    }

    loadFamilyTree();
  }, []);

  const selectedMember = useMemo(
    () =>
      members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  const childrenMap = useMemo(() => {
    const map = new Map<string, string[]>();

    for (const relationship of relationships) {
      const children = map.get(relationship.parent_id) ?? [];

      if (!children.includes(relationship.child_id)) {
        children.push(relationship.child_id);
      }

      map.set(relationship.parent_id, children);
    }

    return map;
  }, [relationships]);

  const parentMap = useMemo(() => {
    const map = new Map<string, string[]>();

    for (const relationship of relationships) {
      const parents = map.get(relationship.child_id) ?? [];

      if (!parents.includes(relationship.parent_id)) {
        parents.push(relationship.parent_id);
      }

      map.set(relationship.child_id, parents);
    }

    return map;
  }, [relationships]);

  const spouseMap = useMemo(() => {
    const map = new Map<string, DisplayMember[]>();

    const memberMap = new Map(
      members.map((member) => [member.id, member])
    );

    for (const couple of couples) {
      const person1 = memberMap.get(couple.person1_id);
      const person2 = memberMap.get(couple.person2_id);

      if (!person1 || !person2) {
        continue;
      }

      const person1Spouses = map.get(person1.id) ?? [];
      person1Spouses.push(person2);
      map.set(person1.id, person1Spouses);

      const person2Spouses = map.get(person2.id) ?? [];
      person2Spouses.push(person1);
      map.set(person2.id, person2Spouses);
    }

    return map;
  }, [members, couples]);

  function handleMemberClick(memberId: string) {
    setSelectedMemberId((current) =>
      current === memberId ? null : memberId
    );
  }

  if (loading) {
    return (
      <div className="pt-[72px] min-h-screen bg-surface flex items-center justify-center">
        <p className="font-body-md text-on-surface-variant">
          Đang tải cây gia phả...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="pt-[72px] min-h-screen bg-surface flex items-center justify-center px-margin-mobile">
        <div className="max-w-lg text-center">
          <p className="font-body-lg text-primary">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] min-h-screen bg-surface">
      <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-b border-outline/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label-md text-primary uppercase tracking-[0.15em]">
            Cội nguồn
          </span>

          <h1 className="font-display-lg text-display-lg text-secondary mt-3 mb-5">
            Gia Phả Gia Đình
          </h1>

          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6" />

          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Mỗi thế hệ là một phần của câu chuyện. Hãy cùng tìm về những
            người đã tạo nên mái nhà này.
          </p>
        </div>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop overflow-x-auto">
        <div className="max-w-7xl mx-auto min-w-[900px]">
          <div className="text-center mb-12">
            <span className="font-label-md text-primary uppercase tracking-[0.15em]">
              Cây gia phả
            </span>

            <h2 className="font-headline-lg text-headline-lg text-secondary mt-3">
              Các thế hệ
            </h2>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low rounded-3xl border border-outline/10">
              <p className="font-body-lg text-on-surface-variant">
                Chưa có dữ liệu gia phả.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {(() => {
                const memberMap = new Map(
                  members.map((member) => [member.id, member])
                );

                const rootMembers = members.filter(
                  (member) => !parentMap.has(member.id)
                );

                const rootCouples = couples
                  .map((couple) => {
                    const person1 = memberMap.get(couple.person1_id);
                    const person2 = memberMap.get(couple.person2_id);

                    if (!person1 || !person2) {
                      return null;
                    }

                    return [person1, person2] as DisplayMember[];
                  })
                  .filter(
                    (couple): couple is DisplayMember[] =>
                      couple !== null &&
                      rootMembers.some(
                        (member) => member.id === couple[0].id
                      ) &&
                      rootMembers.some(
                        (member) => member.id === couple[1].id
                      )
                  );

                const usedRootIds = new Set<string>();

                for (const couple of rootCouples) {
                  usedRootIds.add(couple[0].id);
                  usedRootIds.add(couple[1].id);
                }

                const singleRoots = rootMembers.filter(
                  (member) => !usedRootIds.has(member.id)
                );

                return (
                  <>
                    {rootCouples.map((couple, index) => {
                      const childIds = new Set<string>();

                      for (const parent of couple) {
                        const ids = childrenMap.get(parent.id) ?? [];

                        for (const childId of ids) {
                          childIds.add(childId);
                        }
                      }

                      const children = Array.from(childIds)
                        .map((id) => memberMap.get(id))
                        .filter(Boolean) as DisplayMember[];

                      return (
                        <FamilyTreeBranch
                          key={`couple-${index}`}
                          parents={couple}
                          children={children}
                          allMembers={members}
                          childrenMap={childrenMap}
                          spouseMap={spouseMap}
                          selectedMemberId={selectedMemberId}
                          onMemberClick={handleMemberClick}
                          renderedIds={
                            new Set(
                              couple.map((member) => member.id)
                            )
                          }
                        />
                      );
                    })}

                    {singleRoots.map((root) => {
                      const childIds =
                        childrenMap.get(root.id) ?? [];

                      const children = childIds
                        .map((id) => memberMap.get(id))
                        .filter(Boolean) as DisplayMember[];

                      return (
                        <FamilyTreeBranch
                          key={`root-${root.id}`}
                          parents={[root]}
                          children={children}
                          allMembers={members}
                          childrenMap={childrenMap}
                          spouseMap={spouseMap}
                          selectedMemberId={selectedMemberId}
                          onMemberClick={handleMemberClick}
                          renderedIds={new Set([root.id])}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </div>
          )}

          {selectedMember && (
            <div className="max-w-2xl mx-auto mt-12 bg-surface-container-low rounded-3xl p-8 border border-outline/10">
              <div className="text-center">
                <Heart className="w-7 h-7 text-primary fill-current mx-auto mb-4" />

                <h3 className="font-headline-md text-headline-md text-secondary mb-2">
                  {selectedMember.name}
                </h3>

                <p className="font-body-md text-on-surface-variant">
                  Sinh ngày {selectedMember.birthDate}
                </p>

                {selectedMember.relation && (
                  <p className="font-body-md text-primary mt-2">
                    {selectedMember.relation}
                  </p>
                )}

                {selectedMember.shortBio && (
                  <p className="font-body-md text-on-surface-variant mt-4 leading-relaxed">
                    {selectedMember.shortBio}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
