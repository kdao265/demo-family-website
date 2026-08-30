import React from 'react';
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
const FAMILY_GAP = 48;

const CONNECTOR_COLOR = 'bg-primary/60';
const CONNECTOR_BORDER = 'border-primary/60';

/*
 * Chiều rộng một family unit:
 *
 * [Một người]                = 220
 *
 * [Người] ♥ [Vợ/chồng]       = 220 + 24 + 220
 */
function getFamilyWidth(hasSpouse: boolean) {
  return hasSpouse
    ? CARD_WIDTH * 2 + SPOUSE_GAP
    : CARD_WIDTH;
}

/*
 * Điểm huyết thống của một family unit.
 *
 * Nếu:
 *
 *   [ Minh ] ♥ [ Thơm ]
 *
 * thì connector từ cha/mẹ phải đi vào:
 *
 *   [ Minh ]
 *      ↑
 *
 * chứ không phải tâm của cả cặp.
 */
function getBloodAnchor() {
  return CARD_WIDTH / 2;
}

/*
 * Điểm union của cả family unit.
 *
 * Nếu:
 *
 *   [ Minh ] ♥ [ Thơm ]
 *
 * thì đường xuống con phải đi từ:
 *
 *          │
 *   [ Minh ] ♥ [ Thơm ]
 *
 * tức tâm của cả family unit.
 */
function getUnionAnchor(
  hasSpouse: boolean
) {
  return hasSpouse
    ? CARD_WIDTH + SPOUSE_GAP / 2
    : CARD_WIDTH / 2;
}

interface ChildUnit {
  child: Member;
  spouse: Member | null;
  familyMembers: Member[];
  familyChildren: Member[];
  renderedIds: Set<string>;
  width: number;
  bloodAnchor: number;
  unionAnchor: number;
}

/*
 * ============================================================
 * CHILD FAMILY UNIT
 * ============================================================
 */

interface ChildFamilyUnitProps {
  unit: ChildUnit;
  selectedMemberId: string | null;
  onMemberClick: (memberId: string) => void;
  collapsedFamilyIds: Set<string>;
  onToggleCollapse: (memberIds: string[]) => void;
  childrenMap: Map<string, string[]>;
  spouseMap: Map<string, Member[]>;
  allMembers: Member[];
}

function ChildFamilyUnit({
  unit,
  selectedMemberId,
  onMemberClick,
  collapsedFamilyIds,
  onToggleCollapse,
  childrenMap,
  spouseMap,
  allMembers,
}: ChildFamilyUnitProps) {
  const familyUnitId = unit.familyMembers
    .map((member) => member.id)
    .sort()
    .join('|');

  const isCollapsed =
    collapsedFamilyIds.has(
      familyUnitId
    );

  return (
    <div
      className="relative flex flex-col items-center shrink-0"
      style={{
        width: unit.width,
      }}
    >
      {/*
       * ========================================================
       * DÒNG HUYẾT THỐNG ĐI VÀO NGƯỜI CON
       *
       * [ Dỏn ]
       *    │
       *    │
       * [ Minh ] ♥ [ Thơm ]
       *
       * Chỉ nằm trên child card.
       * ========================================================
       */}

      <div
        className={`absolute top-0 w-[2px] h-6 ${CONNECTOR_COLOR}`}
        style={{
          left: unit.bloodAnchor,
        }}
      />

      {/*
       * ========================================================
       * CHILD + SPOUSE
       * ========================================================
       */}

      <div className="pt-6 flex items-center">
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

        {unit.spouse && (
          <>
            <div className="w-6 shrink-0 flex items-center justify-center text-primary text-xl font-semibold">
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

      {/*
       * ========================================================
       * TỪ CẶP VỢ CHỒNG → CON
       *
       * [ Minh ] ♥ [ Thơm ]
       *          │
       *          ●
       *          │
       *      ────┴────
       *
       * Collapse button nằm trên union.
       * ========================================================
       */}

      {unit.familyChildren.length >
        0 && (
        <>
          <div
            className="relative"
            style={{
              width: unit.width,
              height: 52,
            }}
          >
            <div
              className={`absolute top-0 w-[2px] h-6 ${CONNECTOR_COLOR}`}
              style={{
                left:
                  unit.unionAnchor,
              }}
            />

            <button
              type="button"
              onPointerDown={(
                event
              ) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();

                onToggleCollapse(
                  unit.familyMembers.map(
                    (member) =>
                      member.id
                  )
                );
              }}
              className="absolute top-6 w-8 h-8 -translate-x-1/2 rounded-full bg-surface border-2 border-primary/50 text-primary hover:bg-primary/10 active:scale-95 transition-all flex items-center justify-center text-lg font-semibold shadow-sm z-30 cursor-pointer"
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

          {!isCollapsed && (
            <>
              {/*
               * Dòng từ union xuống family branch
               */}
              <div
                className={`w-[2px] h-6 ${CONNECTOR_COLOR}`}
                style={{
                  marginLeft:
                    unit.unionAnchor -
                    unit.width / 2,
                }}
              />

              <FamilyTreeBranch
                parents={
                  unit.familyMembers
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
                  unit.renderedIds
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
        </>
      )}
    </div>
  );
}

/*
 * ============================================================
 * MAIN FAMILY TREE BRANCH
 * ============================================================
 */

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
    allMembers.map((member) => [
      member.id,
      member,
    ])
  );

  /*
   * ==========================================================
   * FAMILY UNIT
   * ==========================================================
   */

  const familyUnitId = parents
    .map((parent) => parent.id)
    .sort()
    .join('|');

  const isCollapsed =
    collapsedFamilyIds.has(
      familyUnitId
    );

  /*
   * ==========================================================
   * GET SPOUSE
   * ==========================================================
   */

  function getAvailableSpouse(
    member: Member
  ) {
    const spouses =
      spouseMap.get(member.id) ?? [];

    return (
      spouses.find(
        (spouse) =>
          spouse.id !==
            member.id &&
          !renderedIds.has(
            spouse.id
          )
      ) ?? null
    );
  }

  /*
   * ==========================================================
   * GET BIOLOGICAL CHILDREN
   *
   * Đây là phần quan trọng nhất.
   *
   * Nếu parents = [Dỏn]
   *
   * thì:
   *
   * childrenMap[Dỏn]
   *
   * chỉ chứa Minh + Xuân Hoà.
   *
   * Thơm không nằm trong đó nên không bao giờ
   * trở thành child connector.
   * ==========================================================
   */

  function getChildrenOfFamily(
    familyParents: Member[]
  ) {
    const childIds =
      new Set<string>();

    /*
     * Những người không thể xuất hiện
     * như biological child ở level này.
     */
    const excludedIds =
      new Set<string>();

    for (const parent of familyParents) {
      excludedIds.add(parent.id);

      const spouses =
        spouseMap.get(
          parent.id
        ) ?? [];

      /*
       * spouse không phải biological child.
       */
      for (const spouse of spouses) {
        excludedIds.add(
          spouse.id
        );
      }

      const ids =
        childrenMap.get(
          parent.id
        ) ?? [];

      for (const childId of ids) {
        childIds.add(
          childId
        );
      }
    }

    return Array.from(childIds)
      .filter(
        (id) =>
          !excludedIds.has(id)
      )
      .map((id) =>
        memberMap.get(id)
      )
      .filter(
        (
          member
        ): member is Member =>
          Boolean(member)
      )
      .filter(
        (member) =>
          !renderedIds.has(
            member.id
          )
      );
  }

  /*
   * ==========================================================
   * CHILDREN CỦA FAMILY UNIT HIỆN TẠI
   * ==========================================================
   */

  const visibleChildren =
    getChildrenOfFamily(
      parents
    );

  /*
   * ==========================================================
   * TẠO CÁC CHILD FAMILY UNIT
   *
   * Ví dụ:
   *
   * Dỏn
   *
   * children:
   *   Minh
   *   Xuân Hoà
   *
   * unit 1:
   *   Minh ♥ Thơm
   *
   * unit 2:
   *   Xuân Hoà
   * ==========================================================
   */

  const childUnits: ChildUnit[] =
    visibleChildren.map(
      (child) => {
        const spouse =
          getAvailableSpouse(
            child
          );

        const familyMembers =
          spouse
            ? [child, spouse]
            : [child];

        const familyChildren =
          getChildrenOfFamily(
            familyMembers
          );

        const nextRenderedIds =
          new Set(
            renderedIds
          );

        nextRenderedIds.add(
          child.id
        );

        if (spouse) {
          nextRenderedIds.add(
            spouse.id
          );
        }

        return {
          child,
          spouse,
          familyMembers,
          familyChildren,
          renderedIds:
            nextRenderedIds,
          width:
            getFamilyWidth(
              Boolean(spouse)
            ),
          bloodAnchor:
            getBloodAnchor(),
          unionAnchor:
            getUnionAnchor(
              Boolean(spouse)
            ),
        };
      }
    );

  /*
   * ==========================================================
   * ROOT FAMILY DIMENSIONS
   * ==========================================================
   */

  const rootHasSpouse =
    parents.length > 1;

  const rootWidth =
    getFamilyWidth(
      rootHasSpouse
    );

  const rootUnionAnchor =
    getUnionAnchor(
      rootHasSpouse
    );

  /*
   * ==========================================================
   * RENDER PARENTS
   * ==========================================================
   */

  function renderParents() {
    if (!showParents) {
      return null;
    }

    return (
      <div
        className="flex items-center justify-center"
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
                <div className="w-6 shrink-0 flex items-center justify-center text-primary text-xl font-semibold">
                  ♥
                </div>
              )}
            </React.Fragment>
          )
        )}
      </div>
    );
  }

  /*
   * ==========================================================
   * RENDER CHILD ROW
   *
   * Cấu trúc:
   *
   *                 parent
   *                   │
   *          ┌────────┴────────┐
   *          │                 │
   *        [Minh]          [Xuân Hoà]
   *
   * Minh là child anchor.
   *
   * Thơm đứng cạnh Minh nhưng không có
   * đường dọc riêng từ parent.
   * ==========================================================
   */

  function renderChildren() {
    if (
      childUnits.length === 0 ||
      isCollapsed
    ) {
      return null;
    }

    /*
     * Tổng width của toàn bộ row.
     */
    const totalWidth =
      childUnits.reduce(
        (sum, unit) =>
          sum + unit.width,
        0
      ) +
      Math.max(
        0,
        childUnits.length - 1
      ) *
        FAMILY_GAP;

    /*
     * Anchor đầu và cuối.
     *
     * Chú ý:
     * anchor = tâm CARD của biological child,
     * không phải tâm family unit.
     *
     * Đây là điều làm:
     *
     * Dỏn → Minh
     *
     * thay vì:
     *
     * Dỏn → giữa Minh + Thơm.
     */
    const firstAnchor =
      childUnits[0].bloodAnchor;

    const lastUnitStart =
      childUnits
        .slice(0, -1)
        .reduce(
          (sum, unit) =>
            sum +
            unit.width +
            FAMILY_GAP,
          0
        );

    const lastAnchor =
      lastUnitStart +
      childUnits[
        childUnits.length - 1
      ].bloodAnchor;

    /*
     * Tâm của bloodline.
     */
    const bloodlineCenter =
      (firstAnchor +
        lastAnchor) /
      2;

    /*
     * Tâm union của parent family.
     */
    const parentUnionCenter =
      rootUnionAnchor;

    /*
     * Căn cả row sao cho:
     *
     * bloodline center
     * =
     * parent union center
     */
    const rowShift =
      parentUnionCenter -
      bloodlineCenter;

    return (
      <div className="flex flex-col items-center">
        {/* =====================================================
            PARENT → BLOODLINE
           ===================================================== */}

        <div
          className="relative"
          style={{
            width: totalWidth,
            height: 42,
            transform:
              `translateX(${rowShift}px)`,
          }}
        >
          {/* Dọc từ parent xuống bloodline */}
          <div
            className={`absolute top-0 w-[2px] h-8 ${CONNECTOR_COLOR}`}
            style={{
              left:
                bloodlineCenter,
            }}
          />

          {/* Đường ngang biological */}
          {childUnits.length > 1 && (
            <div
              className={`absolute top-8 h-[2px] ${CONNECTOR_COLOR}`}
              style={{
                left:
                  firstAnchor,
                width:
                  lastAnchor -
                  firstAnchor,
              }}
            />
          )}
        </div>

        {/* =====================================================
            CHILD FAMILY UNITS
           ===================================================== */}

        <div
          className="flex items-start"
          style={{
            width: totalWidth,
            transform:
              `translateX(${rowShift}px)`,
          }}
        >
          {childUnits.map(
            (unit) => (
              <ChildFamilyUnit
                key={
                  unit.child.id
                }
                unit={unit}
                selectedMemberId={
                  selectedMemberId
                }
                onMemberClick={
                  onMemberClick
                }
                collapsedFamilyIds={
                  collapsedFamilyIds
                }
                onToggleCollapse={
                  onToggleCollapse
                }
                childrenMap={
                  childrenMap
                }
                spouseMap={
                  spouseMap
                }
                allMembers={
                  allMembers
                }
              />
            )
          )}
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * ROOT RENDER
   * ==========================================================
   */

  return (
    <div className="flex flex-col items-center">
      {renderParents()}

      {visibleChildren.length >
        0 && (
        <>
          {/* Collapse root family */}
          {showParents && (
            <div
              className="relative"
              style={{
                width:
                  rootWidth,
                height: 46,
              }}
            >
              <div
                className={`absolute top-0 w-[2px] h-5 ${CONNECTOR_COLOR}`}
                style={{
                  left:
                    rootUnionAnchor,
                }}
              />

              <button
                type="button"
                onPointerDown={(
                  event
                ) => {
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();

                  onToggleCollapse(
                    parents.map(
                      (parent) =>
                        parent.id
                    )
                  );
                }}
                className="absolute top-5 w-8 h-8 -translate-x-1/2 rounded-full bg-surface border-2 border-primary/50 text-primary hover:bg-primary/10 active:scale-95 transition-all flex items-center justify-center text-lg font-semibold shadow-sm z-30 cursor-pointer"
                style={{
                  left:
                    rootUnionAnchor,
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

          {renderChildren()}
        </>
      )}
    </div>
  );
}
