import {
  Users,
  UserRound,
  GitBranch,
  Images,
  MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <section className="px-6 md:px-10 py-8 border-b border-outline/10 bg-surface-container-low">
        <p className="font-label-md text-primary uppercase tracking-[0.15em]">
          Tổng quan
        </p>

        <h1 className="font-display-lg text-display-lg text-secondary mt-2">
          Gia đình
        </h1>

        <p className="font-body-lg text-on-surface-variant mt-3 max-w-2xl">
          Quản lý toàn bộ dữ liệu và nội dung của đại gia đình.
        </p>
      </section>

      <section className="px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <DashboardCard
            icon={<Users className="w-6 h-6" />}
            title="Gia đình"
            description="Quản lý các gia đình nhỏ."
            path="/admin/families"
          />

          <DashboardCard
            icon={<UserRound className="w-6 h-6" />}
            title="Thành viên"
            description="Thêm và chỉnh sửa thành viên."
            path="/admin/members"
          />

          <DashboardCard
            icon={<GitBranch className="w-6 h-6" />}
            title="Quan hệ gia phả"
            description="Thiết lập quan hệ huyết thống và hôn phối."
            path="/admin/relationships"
          />

          <DashboardCard
            icon={<Images className="w-6 h-6" />}
            title="Khoảnh khắc"
            description="Quản lý ảnh kỷ niệm."
            path="/admin/moments"
          />
        </div>

        <div className="mt-5">
          <DashboardCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="Lưu bút"
            description="Xem, duyệt và quản lý lời nhắn từ người thân."
            path="/admin/guestbook"
          />
        </div>
      </section>
    </div>
  );
}

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}

function DashboardCard({
  icon,
  title,
  description,
  path,
}: DashboardCardProps) {
  return (
    <Link
      to={path}
      className="group bg-surface-container-lowest rounded-2xl border border-outline/10 p-6 hover:-translate-y-1 hover:border-primary/20 transition-all family-card-shadow"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
        {icon}
      </div>

      <h2 className="font-headline-md text-lg text-secondary">
        {title}
      </h2>

      <p className="font-body-md text-on-surface-variant mt-2 leading-relaxed">
        {description}
      </p>

      <div className="mt-5 text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
        Quản lý →
      </div>
    </Link>
  );
}
