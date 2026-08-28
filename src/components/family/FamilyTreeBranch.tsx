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
  member: Member;
  children: Member[];
  allMembers: Member[];
  childrenMap: Map<string, string[]>;
  selectedMemberId: string | null;
  onMemberClick: (memberId: string) => void;
  renderedIds: Set<string>;
}

export default function FamilyTreeBranch({
  member,
  children,
  allMembers,
  childrenMap,
  selectedMemberId,
  onMemberClick,
  renderedIds,
}: FamilyTreeBranchProps) {
  const memberMap = new Map(
    allMembers.map((item) => [item.id, item])
  );

  const nextChildren = children.filter(
    (child) => !renderedIds.has(child.id)
  );

  return (
    <div className="flex flex-col items-center">
      {/* Thành viên hiện tại */}
      <FamilyMemberCard
        member={member}
        isSelected={selectedMemberId === member.id}
        onClick={() => onMemberClick(member.id)}
      />

      {nextChildren.length > 0 && (
        <>
          {/* Đường nối xuống */}
          <div className="w-px h-10 bg-primary/30" />

          {/* Thanh ngang */}
          {nextChildren.length > 1 && (
            <div className="relative w-full max-w-5xl h-6">
              <div className="absolute left-1/2 right-1/2 top-0 border-t border-primary/30" />
            </div>
          )}

          {/* Các con */}
          <div className="flex flex-wrap justify-center gap-10">
            {nextChildren.map((child) => {
              const grandChildrenIds = childrenMap.get(child.id) ?? [];

              const grandChildren = grandChildrenIds
                .map((id) => memberMap.get(id))
                .filter(Boolean) as Member[];

              return (
                <div
                  key={child.id}
                  className="flex flex-col items-center"
                >
                  <div className="w-px h-6 bg-primary/30" />

                  <FamilyTreeBranch
                    member={child}
                    children={grandChildren}
                    allMembers={allMembers}
                    childrenMap={childrenMap}
                    selectedMemberId={selectedMemberId}
                    onMemberClick={onMemberClick}
                    renderedIds={
                      new Set([
                        ...renderedIds,
                        member.id,
                        child.id,
                      ])
                    }
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
