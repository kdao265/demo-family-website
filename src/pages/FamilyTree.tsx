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

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadFamilyTree() {
      setLoading(true);
      setErrorMessage('');

      const [membersResult, relationshipsResult] = await Promise.all([
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
      ]);

      if (membersResult.error) {
        console.error('Load family members error:', membersResult.error);
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

      const mappedMembers: DisplayMember[] = (membersResult.data ?? []).map(
        (member: FamilyMember) => ({
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
        })
      );

      setMembers(mappedMembers);
      setRelationships(relationshipsResult.data ?? []);
      setLoading(false);
    }

    loadFamilyTree();
  }, []);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  /*
   * Tạo map:
   * parent -> các con
   */
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

  /*
   * Tạo map:
   * child -> các cha/mẹ
   */
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

  /*
   * Xác định thế hệ của mỗi người.
   *
   * Người không có cha/mẹ trong dữ liệu:
   * generation = 0
   *
   * Con:
   * generation = generation của cha/mẹ + 1
   */
  const memberGenerationMap = useMemo(() => {
    const generationMap = new Map<string, number>();

    const visit = (
      memberId: string,
      generation: number,
      path: Set<string>
    ) => {
      // Chặn vòng lặp dữ liệu
      if (path.has(memberId)) {
        return;
      }

      const currentGeneration = generationMap.get(memberId);

      if (
        currentGeneration === undefined ||
        generation > currentGeneration
      ) {
        generationMap.set(memberId, generation);
      }

      const children = childrenMap.get(memberId) ?? [];

      const nextPath = new Set(path);
      nextPath.add(memberId);

      for (const childId of children) {
        visit(childId, generation + 1, nextPath);
      }
    };

    const rootMembers = members.filter(
      (member) => !parentMap.has(member.id)
    );

    for (const root of rootMembers) {
      visit(root.id, 0, new Set());
    }

    /*
     * Thành viên bị thiếu root do dữ liệu quan hệ bất thường:
     * vẫn cho xuất hiện ở tầng cuối cùng.
     */
    for (const member of members) {
      if (!generationMap.has(member.id)) {
        generationMap.set(member.id, 0);
      }
    }

    return generationMap;
  }, [members, parentMap, childrenMap]);

  const rootBranches = useMemo(() => {
    const memberMap = new Map(
      members.map((member) => [member.id, member])
    );
  
    const roots = members.filter(
      (member) => !parentMap.has(member.id)
    );
  
    const groups = new Map<
      string,
      {
        parents: DisplayMember[];
        children: DisplayMember[];
      }
    >();
  
    for (const root of roots) {
      const children = (childrenMap.get(root.id) ?? [])
        .map((id) => memberMap.get(id))
        .filter(Boolean) as DisplayMember[];
  
      /*
       * Người không có con vẫn được hiển thị riêng.
       */
      if (children.length === 0) {
        groups.set(`single-${root.id}`, {
          parents: [root],
          children: [],
        });
  
        continue;
      }
  
      const childKey = children
        .map((child) => child.id)
        .sort()
        .join('|');
  
      const existing = groups.get(childKey);
  
      if (existing) {
        if (!existing.parents.some((parent) => parent.id === root.id)) {
          existing.parents.push(root);
        }
      } else {
        groups.set(childKey, {
          parents: [root],
          children,
        });
      }
    }
  
    return Array.from(groups.values());
  }, [members, parentMap, childrenMap]);

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
              {members
                .filter((member) => !parentMap.has(member.id))
                .map((rootMember) => {
                  const childIds = childrenMap.get(rootMember.id) ?? [];
              
                  const rootChildren = childIds
                    .map((id) => members.find((member) => member.id === id))
                    .filter(Boolean);
              
                  return (
                    <FamilyTreeBranch
                      key={rootMember.id}
                      member={rootMember}
                      children={rootChildren}
                      allMembers={members}
                      childrenMap={childrenMap}
                      selectedMemberId={selectedMemberId}
                      onMemberClick={handleMemberClick}
                      renderedIds={new Set([rootMember.id])}
                    />
                  );
                })}
            </div>
          )}

          {/* Selected member */}
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
