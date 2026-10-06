'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Unable to sign in.');
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Ambica Decorators">
        <div className="visual-glow visual-glow-one" />
        <div className="visual-glow visual-glow-two" />
        <div className="visual-ring ring-one" />
        <div className="visual-ring ring-two" />

        <div className="visual-content">
          <img className="login-logo-white" src="/assets/logo-white.png" alt="Ambica Decorators" />
          <div className="visual-rule" />
          <p className="visual-kicker">Wedding · Events · Décor</p>
          <h1>Crafting celebrations<br /><em>worth remembering.</em></h1>
          <p className="visual-copy">
            Your private workspace for managing enquiries, showcasing your work,
            and keeping the Ambica Decorators website beautifully up to date.
          </p>
        </div>

        <div className="visual-footer">
          <span>Ambica Decorators</span>
          <span>Admin Studio</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel-inner">
          <div className="mobile-brand">
            <img src="/assets/logo-purple.png" alt="Ambica Decorators" />
            <div>
              <strong>Ambica Decorators</strong>
              <span>Admin Studio</span>
            </div>
          </div>

          <div className="login-heading">
            <span className="login-eyebrow">Private workspace</span>
            <h2>Welcome back.</h2>
            <p>Sign in to manage your website and client enquiries.</p>
          </div>

          <form className="login-form" onSubmit={submit}>
            <label className="login-field">
              <span>Email address</span>
              <div className="login-input-wrap">
                <span className="field-icon" aria-hidden="true">@</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ambicadecorators.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="login-field">
              <span>Password</span>
              <div className="login-input-wrap">
                <span className="field-icon lock-icon" aria-hidden="true">◆</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {error && (
              <div className="login-error" role="alert">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <button className="login-submit" disabled={busy} type="submit">
              <span>{busy ? 'Signing in…' : 'Sign in to Admin Studio'}</span>
              {!busy && <span className="submit-arrow">→</span>}
            </button>
          </form>

          <div className="login-note">
            <span className="secure-dot" />
            <span>Secure admin access</span>
          </div>

          <p className="login-legal">Ambica Decorators · Internal use only</p>
        </div>
      </section>
    </main>
  );
}
