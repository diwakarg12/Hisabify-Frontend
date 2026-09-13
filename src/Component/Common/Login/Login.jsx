import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/authSlice';
import Button from '../Primitives/Button';
import Input from '../Primitives/Input';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaApple } from 'react-icons/fa';

export const Login = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setErrorMsg('Enter your email/phone and password');
      return;
    }

    try {
      await dispatch(login(form)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err?.message || 'Email or password is not correct');
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4 w-full">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Sign in to HisabiFY</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Enter your registered email or phone number to continue.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-[var(--negative-bg)] border border-[var(--negative)]/30 text-xs font-medium text-[var(--negative)]">
          {errorMsg}
        </div>
      )}

      {/* Email / Phone Field */}
      <Input
        label="Email or Phone number"
        name="email"
        type="text"
        placeholder="Enter email or phone"
        value={form.email}
        onChange={handleChange}
        leftIcon={FaUser}
        required
        autoFocus
      />

      {/* Password Field */}
      <Input
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        value={form.password}
        onChange={handleChange}
        leftIcon={FaLock}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </button>
        }
        required
      />

      {/* Remember Me & Reset Link */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)]"
          />
          <span>Remember me</span>
        </label>

        <Link to="/reset-password" className="text-[var(--brand)] font-semibold hover:underline">
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={authLoading}
        >
          Sign in
        </Button>
      </div>

      {/* Social Login Options */}
      <div className="pt-3 border-t border-[var(--border)] text-center space-y-3">
        <span className="text-xs text-[var(--text-muted)]">Or sign in with</span>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--brand)] transition-colors"
            title="Google"
          >
            <FaGoogle className="w-4 h-4 text-blue-500" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--brand)] transition-colors"
            title="Apple"
          >
            <FaApple className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--brand)] transition-colors"
            title="GitHub"
          >
            <FaGithub className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-[var(--text-secondary)] pt-1">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="text-[var(--brand)] font-bold hover:underline"
        >
          Create account
        </button>
      </p>
    </form>
  );
};

export default Login;
