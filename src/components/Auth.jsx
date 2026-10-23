
import { useState } from 'react';
import { ArrowLeft, BookOpen, Eye, EyeOff } from 'lucide-react';

export default function Auth({ mode = 'signup', onBack, onSwitch }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    university: 'Kirinyaga University',
    password: '',
  });
  const [message, setMessage] = useState('');

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isLogin && !form.email.toLowerCase().endsWith('.ac.ke')) {
      setMessage(
        'For this demo, use your university email address. Email verification will be configured later.'
      );
      return;
    }

    setMessage(
      'The form works! Account creation and login will be activated when we connect Supabase.'
    );
  }

  function switchMode() {
    const nextMode = isLogin ? 'signup' : 'login';
    setIsLogin(!isLogin);
    setMessage('');
    onSwitch?.(nextMode);
  }

  return (
    <main className="auth-page">
      <header className="auth-header">
        <a href="#" className="auth-brand" onClick={(event) => {
          event.preventDefault();
          onBack?.();
        }}>
          <span className="auth-logo"><BookOpen size={23} /></span>
          <span>SkillSwap<span className="auth-brand-accent"> Campus</span></span>
        </a>
        <button className="auth-back" onClick={onBack}>
          <ArrowLeft size={17} /> Back to home
        </button>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <span className="auth-eyebrow">LEARN TOGETHER. GROW TOGETHER.</span>
          <h1>Your next skill starts with a connection.</h1>
          <p>
            Meet fellow students, exchange what you know, and learn
            something new—right on campus.
          </p>
          <div className="auth-benefits">
            <span>✓ Connect with fellow students</span>
            <span>✓ Exchange skills and knowledge</span>
            <span>✓ Build your portfolio</span>
          </div>
        </div>

        <div className="auth-card">
          <h2>{isLogin ? 'Welcome back!' : 'Join SkillSwap Campus'}</h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'Sign in to continue learning.'
              : 'Create your student account to get started.'}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  placeholder="Your full name"
                  required
                />

                <label htmlFor="university">University</label>
                <select
                  id="university"
                  name="university"
                  value={form.university}
                  onChange={updateField}
                  required
                >
                  <option>Kirinyaga University</option>
                  <option>Other university (coming soon)</option>
                </select>
              </>
            )}

            <label htmlFor="email">University email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@university.ac.ke"
              required
            />

            <label htmlFor="password">Password</label>
            <div className="auth-password">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={updateField}
                placeholder="Enter your password"
                minLength={8}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <button className="auth-submit" type="submit">
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {message && <p className="auth-message" role="status">{message}</p>}

          <p className="auth-switch">
            {isLogin ? "New to SkillSwap? " : 'Already have an account? '}
            <button type="button" onClick={switchMode}>
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </p>

          <p className="auth-terms">
            By continuing, you agree to use the platform respectfully
            and responsibly.
          </p>
        </div>
      </section>
    </main>
  );
}
