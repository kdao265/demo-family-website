import { Users, UserRound, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="pt-[72px] min-h-screen bg-surface">
      <section className="py-14 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-b border-outline/10">
        <div className="max-w-container-max mx-auto">
          <p className="font-label-md text-primary uppercase tracking-[0.15em]">
            Quản trị
          </p>

          <h1 className="font-display-lg text-display-lg text-secondary mt-3">
            Gia đình
          </h1>

          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-4">
            Quản lý các gia đình nhỏ, thành viên và mối quan hệ trong gia phả.
          </p>
        </div>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/families"
              className="bg-surface-container-lowest rounded-3xl border border-outline/10 p-7 hover:-translate-y-1 transition-transform"
            >
              <Users className="w-8 h-8 text-primary mb-5" />

              <h2 className="font-headline-md text-xl text-secondary mb-2">
                Gia đình
              </h2>

              <p className="font-body-md text-on-surface-variant">
                Tạo và quản lý các gia đình nhỏ.
              </p>
            </Link>

            <Link
              to="/admin/members"
              className="bg-surface-container-lowest rounded-3xl border border-outline/10 p-7 hover:-translate-y-1 transition-transform"
            >
              <UserRound className="w-8 h-8 text-primary mb-5" />

              <h2 className="font-headline-md text-xl text-secondary mb-2">
                Thành viên
              </h2>

              <p className="font-body-md text-on-surface-variant">
                Thêm, sửa và quản lý thông tin thành viên.
              </p>
            </Link>

            <Link
              to="/admin/relationships"
              className="bg-surface-container-lowest rounded-3xl border border-outline/10 p-7 hover:-translate-y-1 transition-transform"
            >
              <GitBranch className="w-8 h-8 text-primary mb-5" />

              <h2 className="font-headline-md text-xl text-secondary mb-2">
                Quan hệ gia phả
              </h2>

              <p className="font-body-md text-on-surface-variant">
                Thiết lập quan hệ cha mẹ và con cái.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
