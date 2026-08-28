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
  parentMap: Map<string, string[]>;
  childrenMap: Map<string, string[]>;
  selectedMemberId: string | null;
  onMemberClick: (memberId: string) => void;
  renderedIds: Set<string>;
}

export default function FamilyTreeBranch({
  parents,
  children,
  allMembers,
  parentMap,
  childrenMap,
  selectedMemberId,
  onMemberClick,
  renderedIds,
}: FamilyTreeBranchProps) {
  const memberMap = new Map(
    allMembers.map((member) => [member.id, member])
  );

  function getChildrenForParents(parentIds: string[]) {
    const childIds = new Set<string>();

    for (const parentId of parentIds) {
      const ids = childrenMap.get(parentId) ?? [];

      for (const childId of ids) {
        childIds.add(childId);
      }
    }

    return Array.from(childIds)
      .map((id) => memberMap.get(id))
      .filter(Boolean) as Member[];
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

      {children.length > 0 && (
        <>
          {/* Đường nối từ cha mẹ xuống */}
          <div className="w-px h-10 bg-primary/30" />

          {/* Nhánh ngang */}
          {children.length > 1 && (
            <div className="relative w-full max-w-5xl h-6">
              <div className="absolute left-1/2 right-1/2 top-0 border-t border-primary/30" />
            </div>
          )}

          {/* Các con */}
          <div className="flex flex-wrap justify-center gap-10">
            {children.map((child) => {
              const childParents = parentMap.get(child.id) ?? [];

              /*
               * Nếu child đã là parent trong cây,
               * lấy các con tiếp theo của child.
               */
              const childChildren = getChildrenForParents([child.id]);

              const nextParents = childParents
                .map((id) => memberMap.get(id))
                .filter(Boolean) as Member[];

              const shouldRenderNextLevel =
                childChildren.length > 0 &&
                !childChildren.some((item) =>
                  renderedIds.has(item.id)
                );

              return (
                <div
                  key={child.id}
                  className="flex flex-col items-center"
                >
                  <div className="w-px h-6 bg-primary/30" />

                  <FamilyMemberCard
                    member={child}
                    isSelected={selectedMemberId === child.id}
                    onClick={() => onMemberClick(child.id)}
                  />

                  {shouldRenderNextLevel && (
                    <div className="mt-10">
                      <FamilyTreeBranch
                        parents={[child]}
                        children={childChildren}
                        allMembers={allMembers}
                        parentMap={parentMap}
                        childrenMap={childrenMap}
                        selectedMemberId={selectedMemberId}
                        onMemberClick={onMemberClick}
                        renderedIds={
                          new Set([
                            ...renderedIds,
                            child.id,
                            ...childChildren.map(
                              (item) => item.id
                            ),
                          ])
                        }
                      />
                    </div>
                  )}

                  {nextParents.length > 1 &&
                    nextParents.some(
                      (parent) => parent.id !== child.id
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
