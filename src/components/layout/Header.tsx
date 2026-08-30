import {
  Heart,
  Menu,
  LockKeyhole,
  X,
} from 'lucide-react';
import React, {
  FormEvent,
  useState,
} from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loginOpen, setLoginOpen] =
    useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const navItems = [
    { path: '/', label: 'Trang Chủ' },
    { path: '/family-tree', label: 'Gia Phả' },
    { path: '/story', label: 'Câu Chuyện' },
    { path: '/moments', label: 'Khoảnh Khắc' },
    { path: '/guestbook', label: 'Lưu Bút' },
  ];

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;

    return isActive
      ? 'text-on-primary font-label-md text-label-md relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[2px] after:bg-on-primary'
      : 'text-on-primary/80 hover:text-on-primary transition-colors font-label-md text-label-md';
  };

  function openLogin() {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setLoginOpen(true);
  }

  function closeLogin() {
    if (loading) return;

    setLoginOpen(false);
    setErrorMessage('');
  }

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage('');
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      setErrorMessage(
        'Email hoặc mật khẩu không đúng.'
      );

      setLoading(false);
      return;
    }

    setLoading(false);
    setLoginOpen(false);

    navigate('/admin');
  }

  return (
    <>
      <nav className="fixed top-0 w-full h-[72px] bg-primary z-50 shadow-md flex items-center">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group shrink-0"
          >
            <Heart
              className="text-on-primary w-8 h-8 fill-on-primary group-hover:scale-110 transition-transform"
            />

            <span className="font-display-lg text-headline-md text-on-primary">
              Love Family
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-on-primary p-2"
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getLinkClass(item.path)}
              >
                {item.label}
              </Link>
            ))}

            {/* Admin login */}
            <button
              type="button"
              onClick={openLogin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-on-primary/30 text-on-primary/90 hover:text-on-primary hover:bg-on-primary/10 transition-colors font-label-md text-sm"
            >
              <LockKeyhole className="w-4 h-4" />
              Đăng nhập
            </button>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {loginOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-sm flex items-center justify-center px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLogin();
            }
          }}
        >
          <div
            className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline/10 shadow-2xl p-8 md:p-10"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeLogin}
              disabled={loading}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-low transition-colors disabled:opacity-50"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                <LockKeyhole className="w-7 h-7" />
              </div>

              <p className="font-label-md text-primary uppercase tracking-[0.15em] mb-2">
                Khu vực quản trị
              </p>

              <h2 className="font-headline-lg text-headline-lg text-secondary">
                Đăng nhập quản trị
              </h2>

              <p className="font-body-md text-on-surface-variant mt-3">
                Chỉ dành cho người quản lý gia đình.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Mật khẩu
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {errorMessage && (
                <div className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
                  <p className="font-body-md text-sm text-primary">
                    {errorMessage}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-3.5 rounded-full font-label-md hover:bg-primary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Đang đăng nhập...'
                  : 'Đăng nhập'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
