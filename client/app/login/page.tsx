'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@portfolio.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      if (res.success) {
        router.push('/admin');
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setErrorMsg('Login failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 mb-4">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Admin Portal Login
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage projects, skills, content, and inquiries
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs text-blue-600 dark:text-blue-400">
          <p className="font-bold mb-1">Default Admin Credentials:</p>
          <p>Email: <span className="font-mono font-medium">admin@portfolio.com</span></p>
          <p>Password: <span className="font-mono font-medium">admin123</span></p>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-muted-foreground hover:text-blue-600 hover:underline">
            ← Back to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
