import {
  LayoutDashboard,
  Users,
  UserRound,
  GitBranch,
  Images,
  MessageSquare,
  LogOut,
  Home,
  Menu,
  X,
} from 'lucide-react';
import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const navItems = [
  {
    label: 'Tổng quan',
    path: '/admin',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Gia đình',
    path: '/admin/families',
    icon: Users,
  },
  {
    label: 'Thành viên',
    path: '/admin/members',
    icon: UserRound,
  },
  {
    label: 'Quan hệ gia phả',
    path: '/admin/relationships',
    icon: GitBranch,
  },
  {
    label: 'Khoảnh khắc',
    path: '/admin/moments',
    icon: Images,
  },
  {
    label: 'Lưu bút',
    path: '/admin/guestbook',
    icon: MessageSquare,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [pendingGuestbook, setPendingGuestbook] =
    useState(0);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      setUserEmail(user?.email ?? '');
  
      if (!user) {
        return;
      }
  
      const { count, error } = await supabase
        .from('guestbook_messages')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('is_approved', false);
  
      if (error) {
        console.error(
          'Load pending guestbook count error:',
          error
        );
  
        return;
      }
  
      setPendingGuestbook(count ?? 0);
    }
  
    loadUser();
  }, []);

  async function handleLogout() {
    const confirmed = window.confirm(
      'Bạn có chắc muốn đăng xuất khỏi khu vực quản trị?'
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(
        'Admin logout error:',
        error
      );

      return;
    }

    navigate('/admin/login', {
      replace: true,
    });
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 inset-y-0 left-0
          w-[280px]
          bg-[#07111f]
          text-white
          flex flex-col
          border-r border-white/5
          transform transition-transform duration-300
          lg:translate-x-0
          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* Brand */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/5">
          <button
            type="button"
            onClick={() => {
              navigate('/admin');
              closeMobileMenu();
            }}
            className="flex items-center gap-3 min-w-0"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <HeartIcon />
            </div>

            <div className="text-left min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Quản trị
              </p>

              <p className="font-semibold text-white truncate">
                Love Family
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User */}
        <div className="px-5 py-5 border-b border-white/5">
          <p className="text-xs text-white/40 uppercase tracking-[0.12em]">
            Tài khoản quản trị
          </p>

          <p className="text-sm text-white/80 truncate mt-2">
            {userEmail || 'Admin'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
            Quản lý
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    px-3.5 py-3
                    rounded-xl
                    text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-white/65 hover:text-white hover:bg-white/5'
                    }
                    `
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  <span className="flex-1">
                    {item.label}
                  </span>
                  
                  {item.path === '/admin/guestbook' &&
                    pendingGuestbook > 0 && (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary text-on-primary text-[11px] font-semibold flex items-center justify-center">
                        {pendingGuestbook > 99
                          ? '99+'
                          : pendingGuestbook}
                      </span>
                    )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/5 p-4 space-y-1">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-white/65 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Về trang chủ</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 lg:ml-[280px]">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 h-16 bg-surface border-b border-outline/10 flex items-center px-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-surface-container-low"
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6 text-secondary" />
          </button>

          <div className="ml-3">
            <p className="font-label-md text-primary uppercase tracking-[0.12em] text-[10px]">
              Quản trị
            </p>

            <p className="font-headline-md text-secondary">
              Love Family
            </p>
          </div>
        </div>

        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 text-primary fill-current"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}
