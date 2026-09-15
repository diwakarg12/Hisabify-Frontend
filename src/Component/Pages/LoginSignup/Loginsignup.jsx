import React, { useState } from 'react';
import Login from '../../Common/Login/Login';
import Signup from '../../Common/Signup/Signup';
import Logo from '../../Common/Primitives/Logo';

export const Loginsignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background Subtle Depth Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--brand)]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--brand)]/5 blur-3xl pointer-events-none" />

      {/* Top Logo */}
      <div className="mb-6 z-10">
        <Logo size="lg" />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-4xl bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-floating)] overflow-hidden z-10 flex flex-col md:flex-row">
        {/* Left Side: Dynamic Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors ${
                isLogin
                  ? 'border-[var(--brand)] text-[var(--brand)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors ${
                !isLogin
                  ? 'border-[var(--brand)] text-[var(--brand)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Create account
            </button>
          </div>

          {isLogin ? (
            <Login isLogin={isLogin} setIsLogin={setIsLogin} />
          ) : (
            <Signup isLogin={isLogin} setIsLogin={setIsLogin} />
          )}
        </div>

        {/* Right Side: Marketing Visual Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)] border-l border-[var(--border)] p-10 flex-col justify-between items-center text-center">
          <div className="space-y-3 mt-6">
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">
              {isLogin ? 'Welcome back!' : 'Join HisabiFY today'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
              Track personal expenses, split group bills with roommates, and settle up in under 10 seconds.
            </p>
          </div>

          {/* 3D Visual Card Illustration */}
          <div className="w-full p-5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] shadow-[var(--shadow-3d)] my-6 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
              <span>Trip to Goa Dinner</span>
              <span className="text-[var(--positive)] font-bold">● Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--text-primary)]">Vivek Sharma</span>
              <span className="text-sm font-bold text-[var(--positive)] tabular-nums">+₹3,204 to get</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--brand)] w-3/4 rounded-full" />
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Protected by end-to-end encryption & secure JWT auth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loginsignup;