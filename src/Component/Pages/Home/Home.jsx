import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../../Common/Primitives/Logo';
import Button from '../../Common/Primitives/Button';
import Card from '../../Common/Primitives/Card';
import Badge from '../../Common/Primitives/Badge';
import {
  FaCheckCircle,
  FaShieldAlt,
  FaMobileAlt,
  FaUsers,
  FaChartLine,
  FaExchangeAlt,
  FaLock,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans">
      {/* 1. Marketing Top Navigation (No App Sidebar!) (Rule 7.1) */}
      <header className="h-16 bg-[var(--surface-1)] border-b border-[var(--border)] px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Logo size="md" />

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
            How it works
          </a>
          <a href="#security" className="hover:text-[var(--text-primary)] transition-colors">
            Security & privacy
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button size="sm" variant="primary" onClick={handleCtaClick}>
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button size="sm" variant="primary" onClick={() => navigate('/login')}>
                Get started free
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-[var(--text-primary)]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--surface-1)] border-b border-[var(--border)] p-4 space-y-3 z-40">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--text-primary)] py-1"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--text-primary)] py-1"
          >
            How it works
          </a>
          <a
            href="#security"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--text-primary)] py-1"
          >
            Security & privacy
          </a>
          <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
            {isAuthenticated ? (
              <Button variant="primary" onClick={handleCtaClick}>
                Go to dashboard
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Get started free
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="px-4 md:px-8 py-12 md:py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <Badge variant="neutral" className="inline-flex">
            Built for phone-first bill splitting
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]">
            Know who owes whom fast, with zero confusion.
          </h1>

          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            HisabiFY cuts through messy spreadsheets and unreadable charts. Split group bills standing at the table in under 10 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Button size="lg" variant="primary" onClick={handleCtaClick} className="w-full sm:w-auto">
              {isAuthenticated ? 'Go to dashboard' : 'Get started free'}
            </Button>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full">
                See how it works
              </Button>
            </a>
          </div>
        </div>

        {/* 3D Tactile Mock of the Signature Settle-Up Flow */}
        <div className="lg:col-span-6">
          <Card className="tactile-card p-6 bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] border border-[var(--border)] shadow-[var(--shadow-floating)] max-w-md mx-auto relative">
            <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Live settle-up preview</span>
              <span className="text-[var(--positive)] font-bold">● Active</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] shadow-sm space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[var(--text-primary)]">Vivek Sharma</span>
                <span className="font-bold text-[var(--positive)] tabular-nums">+₹3,204 owed</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Trip to Goa Dinner</span>
                <span>Yesterday</span>
              </div>

              <div className="p-3 bg-[var(--positive-bg)] rounded-lg text-[var(--positive)] flex items-center justify-between text-xs font-semibold border border-[var(--positive)]/30">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4" />
                  <span>Settling balance</span>
                </div>
                <span className="tabular-nums">₹3,204</span>
              </div>

              <Button size="sm" variant="primary" fullWidth onClick={() => navigate('/login')}>
                Settle up now
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Three-Item Feature Section */}
      <section id="features" className="py-16 bg-[var(--surface-1)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Why people choose HisabiFY
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Designed around one primary rule: clear figures, phone-first splits, zero guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="tactile-card space-y-3 p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-light)] text-[var(--brand)] flex items-center justify-center font-bold">
                <FaMobileAlt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                10-second bill logging
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Keypad opens instantly. Categories and splits default automatically so you log expenses before leaving the counter.
              </p>
            </Card>

            <Card className="tactile-card space-y-3 p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--positive-bg)] text-[var(--positive)] flex items-center justify-center font-bold">
                <FaExchangeAlt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Unambiguous balances
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Color-coded money semantics mean green is always what you're owed and red is always what you owe. No generic confusion.
              </p>
            </Card>

            <Card className="tactile-card space-y-3 p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] text-[var(--text-primary)] flex items-center justify-center font-bold">
                <FaChartLine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Horizontal breakdown charts
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                No overlapping pie slices or 0% donut charts. Scannable horizontal bar lists group top categories cleanly.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Numbered How-It-Works Sequence */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            How it works
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Three simple steps to financial clarity with friends and roommates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--brand)] text-white text-xl font-extrabold flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Create your group</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Name your group and invite friends by email or guest names.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--brand)] text-white text-xl font-extrabold flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Log expenses on the go</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Enter amounts quickly with live equal or custom split calculations.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--brand)] text-white text-xl font-extrabold flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Settle up seamlessly</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Record settlements in one tap and keep everyone's net position at zero.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Trust & Privacy Section */}
      <section id="security" className="py-12 bg-[var(--surface-1)] border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <FaLock className="w-8 h-8 text-[var(--brand)] mx-auto" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Your expense data is private & encrypted
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
            HisabiFY uses industry-standard JWT authentication and encrypted MongoDB storage. We never sell your spending habits or financial transactions.
          </p>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-8 bg-[var(--bg-page)] border-t border-[var(--border)] px-4 md:px-8 text-center text-xs text-[var(--text-secondary)] space-y-2">
        <Logo size="sm" className="justify-center mb-2" />
        <p>© {new Date().getFullYear()} HisabiFY. Smart personal & group expense tracking.</p>
      </footer>

      {/* 7. Sticky Mobile CTA Bar (Rule 7.1) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-[var(--surface-1)] border-t border-[var(--border)] z-50 shadow-[var(--shadow-floating)]">
        <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
          Get started free
        </Button>
      </div>
    </div>
  );
};

export default Home;
