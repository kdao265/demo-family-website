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

const CARD_WIDTH = 220;
const SPOUSE_GAP = 24;
const CHILD_GAP = 48;

const SINGLE_FAMILY_WIDTH = CARD_WIDTH;
const COUPLE_FAMILY_WIDTH =
  CARD_WIDTH + SPOUSE_GAP + CARD_WIDTH;

function getFamilyWidth(hasSpouse: boolean) {
  return hasSpouse
    ? COUPLE_FAMILY_WIDTH
    : SINGLE_FAMILY_WIDTH;
}

/*
 * Điểm nối huyết thống luôn nằm chính giữa
 * card của người con trực tiếp.
 *
 * Với một người:
 *   [ 220px ]
 *       ↑
 *      110
 *
 * Với một cặp:
 *   [220] ♥ [220]
 *      ↑
 *     110
 *
 * Quan trọng:
 * đường cha/mẹ → con chỉ đi tới người thứ nhất,
 * không đi tới spouse.
 */
function getBloodAnchorOffset() {
  return CARD_WIDTH / 2;
}

/*
 * Điểm nối để đi xuống các con.
 *
 * Một người:
 *   [ A ]
 *    ↑
 *   110
 *
 * Hai vợ chồng:
 *   [ A ] ♥ [ B ]
 *          ↑
 *         232
 *
 * Nghĩa là:
 * - đường từ thế hệ trên xuống → 110
 * - đường từ cặp vợ chồng xuống con → 232
 */
function getFamilyUnionOffset(hasSpouse: boolean) {
  return hasSpouse
    ? COUPLE_FAMILY_WIDTH / 2
    : SINGLE_FAMILY_WIDTH / 2;
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

  /*
   * =========================================================
   * FAMILY UNIT HELPERS
   * =========================================================
   */

  function getFamilyUnitId(memberIds: string[]) {
    return [...memberIds].sort().join('|');
  }

  function getAvailableSpouse(member: Member) {
    const spouses = spouseMap.get(member.id) ?? [];

    return spouses.find(
      (spouse) =>
        spouse.id !== member.id &&
        !renderedIds.has(spouse.id)
    );
  }

  function getChildrenOfFamily(parentList: Member[]) {
    const childIds = new Set<string>();

    for (const parent of parentList) {
      const ids = childrenMap.get(parent.id) ?? [];

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

  /*
   * =========================================================
   * RENDER FAMILY CHILDREN
   *
   * parentAnchorOffset:
   *
   * - 110 nếu parent là một người
   * - 232 nếu parent là một cặp
   *
   * Hàm này tính chính xác vị trí của các "blood anchor"
   * để đường ngang luôn nối:
   *
   *      parent
   *        │
   *   ─────┼────────
   *        │
   *      child
   *
   * chứ không nối vào spouse.
   * =========================================================
   */

  function renderChildren(
    familyChildren: Member[],
    parentAnchorOffset: number,
    currentRenderedIds: Set<string>
  ) {
    if (familyChildren.length === 0) {
      return null;
    }

    /*
     * Tạo danh sách family unit:
     *
     * child
     * child + spouse
     */
    const units = familyChildren.map((child) => {
      const spouses = spouseMap.get(child.id) ?? [];

      const spouse = spouses.find(
        (candidate) =>
          candidate.id !== child.id &&
          !currentRenderedIds.has(candidate.id)
      );

      const familyMembers = spouse
        ? [child, spouse]
        : [child];

      const familyChildrenOfUnit =
        getChildrenOfFamily(familyMembers);

      const nextRenderedIds = new Set(
        currentRenderedIds
      );

      nextRenderedIds.add(child.id);

      if (spouse) {
        nextRenderedIds.add(spouse.id);
      }

      return {
        child,
        spouse,
        familyChildren:
          familyChildrenOfUnit,
        nextRenderedIds,
        width: getFamilyWidth(
          Boolean(spouse)
        ),
        bloodAnchor:
          getBloodAnchorOffset(),
        unionAnchor:
          getFamilyUnionOffset(
            Boolean(spouse)
          ),
      };
    });

    /*
     * Tổng chiều rộng của hàng.
     */
    const totalWidth =
      units.reduce(
        (sum, unit) =>
          sum + unit.width,
        0
      ) +
      Math.max(
        0,
        units.length - 1
      ) *
        CHILD_GAP;

    /*
     * Vị trí blood-anchor đầu tiên
     * và cuối cùng trong hàng.
     *
     * Ta dùng trung điểm của hai anchor
     * để đặt đúng dưới parent.
     */
    const firstAnchor =
      units[0].bloodAnchor;

    const lastUnitStart =
      units.slice(0, -1).reduce(
        (sum, unit) =>
          sum + unit.width + CHILD_GAP,
        0
      );

    const lastAnchor =
      lastUnitStart +
      units[units.length - 1].bloodAnchor;

    const anchorCenter =
      (firstAnchor +
        lastAnchor) /
      2;

    const rowOffset =
      parentAnchorOffset -
      anchorCenter;

    return (
      <div className="flex flex-col items-start">
        {/* ===============================================
            PARENT → CHILDREN
           =============================================== */}

        <div
          className="relative w-px bg-primary/25"
          style={{
            height: 32,
            marginLeft:
              parentAnchorOffset,
          }}
        />

        {/* ===============================================
            CHILDREN ROW
           =============================================== */}

        <div
          className="flex items-start"
          style={{
            marginLeft: rowOffset,
          }}
        >
          {units.map((unit, index) => {
            const isFirst =
              index === 0;

            const isLast =
              index ===
              units.length - 1;

            const familyId =
              getFamilyUnitId(
                unit.spouse
                  ? [
                      unit.child.id,
                      unit.spouse.id,
                    ]
                  : [unit.child.id]
              );

            const isCollapsed =
              collapsedFamilyIds.has(
                familyId
              );

            return (
              <div
                key={unit.child.id}
                className="relative flex flex-col items-start shrink-0"
                style={{
                  width: unit.width,
                  marginRight: isLast
                    ? 0
                    : CHILD_GAP,
                }}
              >
                {/* =================================
                    TOP CONNECTOR
                   ================================= */}

                {/* Blood connector from previous unit */}
                {!isFirst && (
                  <div
                    className="absolute top-0 h-px bg-primary/25"
                    style={{
                      left:
                        -(CHILD_GAP),
                      width:
                        unit.bloodAnchor +
                        CHILD_GAP,
                    }}
                  />
                )}

                {/* Blood connector to next unit */}
                {!isLast && (
                  <div
                    className="absolute top-0 h-px bg-primary/25"
                    style={{
                      left:
                        unit.bloodAnchor,
                      right:
                        -CHILD_GAP,
                    }}
                  />
                )}

                {/* Vertical connector:
                    parent → CHILD CARD
                 */}

                <div
                  className="absolute top-0 w-px h-6 bg-primary/25"
                  style={{
                    left:
                      unit.bloodAnchor,
                  }}
                />

                <div className="pt-6">
                  {/* =================================
                      CHILD / SPOUSE
                     ================================= */}

                  <div
                    className="flex items-center"
                  >
                    {/* CHILD */}
                    <FamilyMemberCard
                      member={unit.child}
                      isSelected={
                        selectedMemberId ===
                        unit.child.id
                      }
                      onClick={() =>
                        onMemberClick(
                          unit.child.id
                        )
                      }
                    />

                    {/* SPOUSE */}
                    {unit.spouse && (
                      <>
                        <div className="w-6 shrink-0 flex items-center justify-center text-primary text-lg">
                          ♥
                        </div>

                        <FamilyMemberCard
                          member={unit.spouse}
                          isSelected={
                            selectedMemberId ===
                            unit.spouse.id
                          }
                          onClick={() =>
                            onMemberClick(
                              unit.spouse!.id
                            )
                          }
                        />
                      </>
                    )}
                  </div>

                  {/* =================================
                      COLLAPSE BUTTON
                     ================================= */}

                  {unit.familyChildren.length >
                    0 && (
                    <div
                      className="relative"
                      style={{
                        height: 46,
                        width:
                          unit.width,
                      }}
                    >
                      {/* Vertical line from:
                          couple union → collapse
                       */}
                      <div
                        className="absolute top-0 w-px h-5 bg-primary/30"
                        style={{
                          left:
                            unit.unionAnchor,
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          onToggleCollapse(
                            unit.spouse
                              ? [
                                  unit.child
                                    .id,
                                  unit.spouse
                                    .id,
                                ]
                              : [
                                  unit.child.id,
                                ]
                          )
                        }
                        className="absolute top-5 w-8 h-8 -translate-x-1/2 rounded-full bg-surface border border-primary/30 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center text-lg font-semibold shadow-sm z-10"
                        style={{
                          left:
                            unit.unionAnchor,
                        }}
                        aria-label={
                          isCollapsed
                            ? 'Mở rộng nhánh gia đình'
                            : 'Thu gọn nhánh gia đình'
                        }
                      >
                        {isCollapsed
                          ? '+'
                          : '−'}
                      </button>
                    </div>
                  )}

                  {/* =================================
                      CHILDREN OF THIS FAMILY UNIT
                     ================================= */}

                  {unit.familyChildren.length >
                    0 &&
                    !isCollapsed && (
                      <div
                        className="relative"
                        style={{
                          width:
                            unit.width,
                        }}
                      >
                        {/* Quan hệ:
                            Minh ♥ Thơm
                                  │
                            ┌─────┴─────┐
                            E           F
                         */}

                        <div
                          className="absolute top-0 w-px bg-primary/30"
                          style={{
                            left:
                              unit.unionAnchor,
                            height: 26,
                          }}
                        />

                        <FamilyTreeBranch
                          parents={
                            unit.spouse
                              ? [
                                  unit.child,
                                  unit.spouse,
                                ]
                              : [
                                  unit.child,
                                ]
                          }
                          children={
                            unit.familyChildren
                          }
                          allMembers={
                            allMembers
                          }
                          childrenMap={
                            childrenMap
                          }
                          spouseMap={
                            spouseMap
                          }
                          selectedMemberId={
                            selectedMemberId
                          }
                          onMemberClick={
                            onMemberClick
                          }
                          renderedIds={
                            unit.nextRenderedIds
                          }
                          collapsedFamilyIds={
                            collapsedFamilyIds
                          }
                          onToggleCollapse={
                            onToggleCollapse
                          }
                          showParents={false}
                        />
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * ROOT FAMILY UNIT
   * =========================================================
   */

  const rootHasSpouse =
    parents.length > 1;

  const rootWidth =
    getFamilyWidth(rootHasSpouse);

  const rootUnionAnchor =
    getFamilyUnionOffset(
      rootHasSpouse
    );

  const rootFamilyId =
    getFamilyUnitId(
      parents.map(
        (parent) => parent.id
      )
    );

  const rootIsCollapsed =
    collapsedFamilyIds.has(
      rootFamilyId
    );

  const visibleChildren =
    children.filter(
      (child) =>
        !renderedIds.has(
          child.id
        )
    );

  /*
   * =========================================================
   * ROOT PARENTS
   * =========================================================
   */

  return (
    <div className="flex flex-col items-center">
      {/* ===============================================
          ROOT PARENTS
         =============================================== */}

      {showParents && (
        <div
          className="relative flex items-center"
          style={{
            width: rootWidth,
          }}
        >
          {parents.map(
            (parent, index) => (
              <React.Fragment
                key={parent.id}
              >
                <FamilyMemberCard
                  member={parent}
                  isSelected={
                    selectedMemberId ===
                    parent.id
                  }
                  onClick={() =>
                    onMemberClick(
                      parent.id
                    )
                  }
                />

                {index <
                  parents.length -
                    1 && (
                  <div className="w-6 shrink-0 flex items-center justify-center text-primary text-lg">
                    ♥
                  </div>
                )}
              </React.Fragment>
            )
          )}
        </div>
      )}

      {/* ===============================================
          ROOT COLLAPSE
         =============================================== */}

      {visibleChildren.length >
        0 && (
        <div
          className="relative"
          style={{
            width: rootWidth,
            height: 46,
          }}
        >
          {/* Dọc từ parent unit xuống */}
          <div
            className="absolute top-0 w-px h-5 bg-primary/25"
            style={{
              left:
                rootUnionAnchor,
            }}
          />

          <button
            type="button"
            onClick={() =>
              onToggleCollapse(
                parents.map(
                  (parent) =>
                    parent.id
                )
              )
            }
            className="absolute top-5 w-8 h-8 -translate-x-1/2 rounded-full bg-surface border border-primary/30 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center text-lg font-semibold shadow-sm z-10"
            style={{
              left: rootUnionAnchor,
            }}
            aria-label={
              rootIsCollapsed
                ? 'Mở rộng nhánh gia đình'
                : 'Thu gọn nhánh gia đình'
            }
          >
            {rootIsCollapsed
              ? '+'
              : '−'}
          </button>
        </div>
      )}

      {/* ===============================================
          ROOT → CHILDREN
         =============================================== */}

      {!rootIsCollapsed &&
        renderChildren(
          visibleChildren,
          rootUnionAnchor,
          renderedIds
        )}
    </div>
  );
}
