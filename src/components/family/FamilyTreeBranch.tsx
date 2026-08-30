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
  collapsedFamilyIds: Set<string>;
  onToggleCollapse: (memberIds: string[]) => void;
  showParents?: boolean;
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
  collapsedFamilyIds,
  onToggleCollapse,
  showParents = true,
}: FamilyTreeBranchProps) {
  const memberMap = new Map(
    allMembers.map((member) => [member.id, member])
  );

  const familyUnitId = [...parents]
    .map((member) => member.id)
    .sort()
    .join('|');

  const isCollapsed =
    collapsedFamilyIds.has(familyUnitId);

  function getAvailableSpouses(member: Member) {
    const spouses = spouseMap.get(member.id) ?? [];

    return spouses.filter(
      (spouse) =>
        spouse.id !== member.id &&
        !renderedIds.has(spouse.id)
    );
  }

  function getChildrenOfFamily(
    parentList: Member[]
  ) {
    const childIds = new Set<string>();

    for (const parent of parentList) {
      const ids =
        childrenMap.get(parent.id) ?? [];

      for (const childId of ids) {
        childIds.add(childId);
      }
    }

    return Array.from(childIds)
      .map((id) => memberMap.get(id))
      .filter(
        (member): member is Member =>
          Boolean(member)
      )
      .filter(
        (member) => !renderedIds.has(member.id)
      );
  }

  const visibleChildren = children.filter(
    (child) => !renderedIds.has(child.id)
  );

  return (
    <div className="flex flex-col items-center">
      {/* =================================================
          PARENTS
         ================================================= */}
      {showParents && (
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {parents.map((parent, index) => (
            <div
              key={parent.id}
              className="relative"
            >
              <FamilyMemberCard
                member={parent}
                isSelected={
                  selectedMemberId === parent.id
                }
                onClick={() =>
                  onMemberClick(parent.id)
                }
              />

              {index < parents.length - 1 && (
                <div className="absolute top-1/2 -right-4 md:-right-5 -translate-y-1/2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-primary/20 flex items-center justify-center">
                    <span className="text-primary text-sm">
                      ♥
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* =================================================
          COLLAPSE BUTTON
         ================================================= */}
      {children.length > 0 && (
        <button
          type="button"
          onClick={() =>
            onToggleCollapse(
              parents.map((parent) => parent.id)
            )
          }
          className="my-3 w-8 h-8 rounded-full bg-surface border border-primary/30 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center text-lg font-semibold shadow-sm z-10"
          aria-label={
            isCollapsed
              ? 'Mở rộng nhánh gia đình'
              : 'Thu gọn nhánh gia đình'
          }
        >
          {isCollapsed ? '+' : '−'}
        </button>
      )}

      {/* =================================================
          CHILDREN
         ================================================= */}
      {visibleChildren.length > 0 &&
        !isCollapsed && (
          <>
            {/* Vertical line */}
            <div className="w-px h-12 bg-primary/25" />

            {/* Horizontal line */}
            {visibleChildren.length > 1 && (
              <div className="relative w-[75%] max-w-4xl h-6">
                <div className="absolute left-[8%] right-[8%] top-0 border-t border-primary/25" />
              </div>
            )}

            {/* Child family units */}
            <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
              {visibleChildren.map((child) => {
                const availableSpouses =
                  getAvailableSpouses(child);

                const spouse =
                  availableSpouses[0] ?? null;

                const childFamily = spouse
                  ? [child, spouse]
                  : [child];

                const familyChildren =
                  getChildrenOfFamily(childFamily);

                const nextRenderedIds =
                  new Set(renderedIds);

                nextRenderedIds.add(child.id);

                if (spouse) {
                  nextRenderedIds.add(spouse.id);
                }

                return (
                  <div
                    key={child.id}
                    className="flex flex-col items-center"
                  >
                    {/* ===================================
                        CHILD + SPOUSE
                       =================================== */}
                    <div className="flex items-center justify-center gap-6">
                      <div className="relative">
                        <FamilyMemberCard
                          member={child}
                          isSelected={
                            selectedMemberId ===
                            child.id
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
                            selectedMemberId ===
                            spouse.id
                          }
                          onClick={() =>
                            onMemberClick(spouse.id)
                          }
                        />
                      )}
                    </div>

                    {/* ===================================
                        CHILDREN OF THIS FAMILY
                       =================================== */}
                    {familyChildren.length > 0 && (
                      <>
                        <div className="w-px h-10 bg-primary/30" />

                        <FamilyTreeBranch
                          parents={childFamily}
                          children={familyChildren}
                          allMembers={allMembers}
                          childrenMap={childrenMap}
                          spouseMap={spouseMap}
                          selectedMemberId={
                            selectedMemberId
                          }
                          onMemberClick={
                            onMemberClick
                          }
                          renderedIds={
                            nextRenderedIds
                          }
                          collapsedFamilyIds={
                            collapsedFamilyIds
                          }
                          onToggleCollapse={
                            onToggleCollapse
                          }
                          showParents={false}
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
