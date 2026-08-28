import FamilyMemberCard from './FamilyMemberCard';

interface Member {
  id: string;
  name: string;
  birthDate: string;
  hobbies: string[];
  imageUrl: string;
  imageAlt: string;
  relation?: string;
  shortBio?: string;
}

interface FamilyTreeBranchProps {
  parents: Member[];
  children: Member[];
  allMembers: Member[];
  childrenMap: Map<string, string[]>;
  spouseMap: Map<string, Member[]>;
  selectedMemberId: string | null;
  onMemberClick: (memberId: string) => void;
  renderedIds: Set<string>;
}

export default function FamilyTreeBranch({
  parents,
  children,
  allMembers,
  childrenMap,
  spouseMap,
  selectedMemberId,
  onMemberClick,
  renderedIds,
}: FamilyTreeBranchProps) {
  const memberMap = new Map(
    allMembers.map((member) => [member.id, member])
  );

  const visibleChildren = children.filter(
    (child) => !renderedIds.has(child.id)
  );

  function getAvailableSpouse(member: Member) {
    const spouses = spouseMap.get(member.id) ?? [];

    return spouses.find(
      (spouse) =>
        spouse.id !== member.id &&
        !renderedIds.has(spouse.id)
    );
  }

  function getChildrenOfCouple(
    person1: Member,
    person2?: Member
  ) {
    const childIds = new Set<string>();

    const ids1 = childrenMap.get(person1.id) ?? [];

    for (const childId of ids1) {
      childIds.add(childId);
    }

    if (person2) {
      const ids2 = childrenMap.get(person2.id) ?? [];

      for (const childId of ids2) {
        childIds.add(childId);
      }
    }

    return Array.from(childIds)
      .map((id) => memberMap.get(id))
      .filter(Boolean)
      .filter((member) => !renderedIds.has(member!.id)) as Member[];
  }

  return (
    <div className="flex flex-col items-center">
      {/* Cha / mẹ */}
      <div className="flex items-center justify-center gap-6">
        {parents.map((parent, index) => (
          <div key={parent.id} className="relative">
            <FamilyMemberCard
              member={parent}
              isSelected={selectedMemberId === parent.id}
              onClick={() => onMemberClick(parent.id)}
            />

            {index < parents.length - 1 && (
              <div className="absolute top-1/2 -right-5 -translate-y-1/2 text-primary text-xl">
                ♥
              </div>
            )}
          </div>
        ))}
      </div>

      {visibleChildren.length > 0 && (
        <>
          {/* Đường dọc */}
          <div className="w-px h-10 bg-primary/30" />

          {/* Đường ngang */}
          {visibleChildren.length > 1 && (
            <div className="relative w-[75%] max-w-4xl h-6">
              <div className="absolute left-0 right-0 top-0 border-t border-primary/30" />
            </div>
          )}

          {/* Các gia đình con */}
          <div className="flex justify-center gap-12 flex-wrap">
            {visibleChildren.map((child) => {
              const spouse = getAvailableSpouse(child);

              const familyChildren = getChildrenOfCouple(
                child,
                spouse
              );

              const nextRenderedIds = new Set(renderedIds);

              nextRenderedIds.add(child.id);

              if (spouse) {
                nextRenderedIds.add(spouse.id);
              }

              return (
                <div
                  key={child.id}
                  className="flex flex-col items-center"
                >
                  {/* Người con + vợ/chồng */}
                  <div className="flex items-center justify-center gap-6">
                    <div className="relative">
                      <FamilyMemberCard
                        member={child}
                        isSelected={
                          selectedMemberId === child.id
                        }
                        onClick={() =>
                          onMemberClick(child.id)
                        }
                      />

                      {spouse && (
                        <div className="absolute top-1/2 -right-5 -translate-y-1/2 text-primary text-xl">
                          ♥
                        </div>
                      )}
                    </div>

                    {spouse && (
                      <FamilyMemberCard
                        member={spouse}
                        isSelected={
                          selectedMemberId === spouse.id
                        }
                        onClick={() =>
                          onMemberClick(spouse.id)
                        }
                      />
                    )}
                  </div>

                  {/* Con của cặp này */}
                  {familyChildren.length > 0 && (
                    <>
                      <div className="w-px h-10 bg-primary/30" />

                      <FamilyTreeBranch
                        parents={
                          spouse
                            ? [child, spouse]
                            : [child]
                        }
                        children={familyChildren}
                        allMembers={allMembers}
                        childrenMap={childrenMap}
                        spouseMap={spouseMap}
                        selectedMemberId={selectedMemberId}
                        onMemberClick={onMemberClick}
                        renderedIds={nextRenderedIds}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
