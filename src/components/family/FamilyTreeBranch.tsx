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

  /*
   * Một thành viên có thể có vợ/chồng.
   * Tạm thời lấy người bạn đời đầu tiên.
   */
  function getFamilyUnit(member: Member) {
    const spouses = spouseMap.get(member.id) ?? [];

    const spouse = spouses.find(
      (item) =>
        item.id !== member.id &&
        !renderedIds.has(item.id)
    );

    return spouse ? [member, spouse] : [member];
  }

  /*
   * Tìm tất cả con của một gia đình nhỏ.
   * Nếu cha và mẹ cùng có con thì loại bỏ trùng.
   */
  function getChildrenOfFamily(parentsUnit: Member[]) {
    const childIds = new Set<string>();

    for (const parent of parentsUnit) {
      const ids = childrenMap.get(parent.id) ?? [];

      for (const childId of ids) {
        if (!renderedIds.has(childId)) {
          childIds.add(childId);
        }
      }
    }

    return Array.from(childIds)
      .map((id) => memberMap.get(id))
      .filter(Boolean) as Member[];
  }

  const visibleChildren = children.filter(
    (child) => !renderedIds.has(child.id)
  );

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
          {/* Đường nối */}
          <div className="w-px h-10 bg-primary/30" />

          {visibleChildren.length > 1 && (
            <div className="relative w-full max-w-5xl h-6">
              <div className="absolute left-[10%] right-[10%] top-0 border-t border-primary/30" />
            </div>
          )}

          {/* Các con */}
          <div className="flex flex-wrap justify-center gap-12">
            {visibleChildren.map((child) => {
              const familyUnit = getFamilyUnit(child);

              const grandchildren =
                getChildrenOfFamily(familyUnit);

              const nextRenderedIds = new Set(renderedIds);

              for (const member of familyUnit) {
                nextRenderedIds.add(member.id);
              }

              return (
                <div
                  key={child.id}
                  className="flex flex-col items-center"
                >
                  {/* Gia đình nhỏ của người con */}
                  <div className="flex items-center justify-center gap-6">
                    {familyUnit.map((member, index) => (
                      <div
                        key={member.id}
                        className="relative"
                      >
                        <FamilyMemberCard
                          member={member}
                          isSelected={
                            selectedMemberId === member.id
                          }
                          onClick={() =>
                            onMemberClick(member.id)
                          }
                        />

                        {index <
                          familyUnit.length - 1 && (
                          <div className="absolute top-1/2 -right-5 -translate-y-1/2 text-primary text-xl">
                            ♥
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Con của gia đình nhỏ này */}
                  {grandchildren.length > 0 && (
                    <div className="mt-10">
                      <FamilyTreeBranch
                        parents={familyUnit}
                        children={grandchildren}
                        allMembers={allMembers}
                        childrenMap={childrenMap}
                        spouseMap={spouseMap}
                        selectedMemberId={
                          selectedMemberId
                        }
                        onMemberClick={onMemberClick}
                        renderedIds={nextRenderedIds}
                      />
                    </div>
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
