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

interface FamilyBranchProps {
  parents: Member[];
  children: Member[];
  selectedMemberId: string | null;
  onMemberClick: (memberId: string) => void;
}

export default function FamilyBranch({
  parents,
  children,
  selectedMemberId,
  onMemberClick,
}: FamilyBranchProps) {
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

      {/* Đường nối xuống các con */}
      {children.length > 0 && (
        <>
          <div className="w-px h-10 bg-primary/30" />

          {children.length > 1 && (
            <div className="relative w-full max-w-5xl h-6">
              <div className="absolute left-1/2 top-0 w-1/2 border-t border-primary/30" />
              <div className="absolute right-1/2 top-0 w-1/2 border-t border-primary/30" />
            </div>
          )}

          {/* Các con */}
          <div className="flex flex-wrap justify-center gap-10">
            {children.map((child) => (
              <div
                key={child.id}
                className="relative flex flex-col items-center"
              >
                <div className="w-px h-6 bg-primary/30" />

                <FamilyMemberCard
                  member={child}
                  isSelected={selectedMemberId === child.id}
                  onClick={() => onMemberClick(child.id)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
