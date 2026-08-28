import { FormEvent, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage('Email hoặc mật khẩu không đúng.');
      setLoading(false);
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <div className="pt-[72px] min-h-screen bg-surface flex items-center justify-center px-margin-mobile md:px-margin-desktop">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline/10 family-card-shadow p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
            <LockKeyhole className="w-7 h-7" />
          </div>

          <p className="font-label-md text-primary uppercase tracking-[0.15em] mb-2">
            Khu vực quản trị
          </p>

          <h1 className="font-headline-lg text-headline-lg text-secondary">
            Đăng nhập quản trị
          </h1>

          <p className="font-body-md text-on-surface-variant mt-3">
            Chỉ dành cho người quản lý gia đình.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-label-md text-sm text-secondary mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block font-label-md text-sm text-secondary mb-2">
              Mật khẩu
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
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
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
