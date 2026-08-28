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
  selectedMemberId: string | null;
  onMemberClick: (memberId: string) => void;
  renderedIds: Set<string>;
}

export default function FamilyTreeBranch({
  parents,
  children,
  allMembers,
  childrenMap,
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

      {/* Con */}
      {visibleChildren.length > 0 && (
        <>
          <div className="w-px h-10 bg-primary/30" />

          {visibleChildren.length > 1 && (
            <div className="relative w-full max-w-5xl h-6">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[80%] border-t border-primary/30" />
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-10">
            {visibleChildren.map((child) => {
              const childIds = childrenMap.get(child.id) ?? [];

              const grandchildren = childIds
                .map((id) => memberMap.get(id))
                .filter(Boolean) as Member[];

              const nextRenderedIds = new Set(renderedIds);
              nextRenderedIds.add(child.id);

              return (
                <div
                  key={child.id}
                  className="flex flex-col items-center"
                >
                  <div className="w-px h-6 bg-primary/30" />

                  <FamilyTreeBranch
                    parents={[child]}
                    children={grandchildren}
                    allMembers={allMembers}
                    childrenMap={childrenMap}
                    selectedMemberId={selectedMemberId}
                    onMemberClick={onMemberClick}
                    renderedIds={nextRenderedIds}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
