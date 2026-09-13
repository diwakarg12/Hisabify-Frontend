import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { sendResetOtp, verifyResetOtp } from '../../../redux/authSlice';
import Logo from '../Primitives/Logo';
import Button from '../Primitives/Button';
import Input from '../Primitives/Input';
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

export const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authLoading } = useSelector((state) => state.auth);

  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!form.email.trim()) {
      setErrorMsg('Please enter your registered email address');
      return;
    }

    try {
      setErrorMsg('');
      await dispatch(sendResetOtp(form.email.trim())).unwrap();
      setOtpSent(true);
      setSuccessMsg('A 6-digit OTP code has been sent to your email.');
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err?.message || 'Could not send OTP. Please check your email.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!form.otp.trim() || !form.newPassword || !form.confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters long');
      return;
    }

    try {
      setErrorMsg('');
      await dispatch(
        verifyResetOtp({
          email: form.email.trim(),
          otp: form.otp.trim(),
          newPassword: form.newPassword,
        })
      ).unwrap();

      setSuccessMsg('Password updated successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err?.message || 'Invalid or expired OTP code.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background Subtle Depth Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--brand)]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--brand)]/5 blur-3xl pointer-events-none" />

      {/* Top Logo */}
      <div className="mb-6 z-10">
        <Link to="/">
          <Logo size="lg" />
        </Link>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-floating)] overflow-hidden z-10 flex flex-col md:flex-row">
        {/* Left Side: Form Controls */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors mb-3"
            >
              <FaArrowLeft className="w-3 h-3" /> Back to sign in
            </Link>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
              {otpSent ? 'Reset your password' : 'Forgot password?'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {otpSent
                ? 'Enter the OTP sent to your email along with your new password.'
                : 'No worries! Enter your registered email and we will send you an OTP.'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--negative-bg)] border border-[var(--negative)]/30 text-xs font-medium text-[var(--negative)]">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--positive-bg)] border border-[var(--positive)]/30 text-xs font-medium text-[var(--positive)] flex items-center gap-2">
              <FaCheckCircle className="w-4 h-4 shrink-0 text-[var(--positive)]" />
              <span>{successMsg}</span>
            </div>
          )}

          {!otpSent ? (
            /* STEP 1: Request OTP Form */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Registered email address"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                leftIcon={FaEnvelope}
                required
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={authLoading}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            /* STEP 2: Enter OTP & New Password Form */
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Email (Readonly) */}
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                disabled
                leftIcon={FaEnvelope}
              />

              {/* OTP Field */}
              <Input
                label="OTP Verification code"
                name="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={form.otp}
                onChange={handleChange}
                leftIcon={FaKey}
                required
                autoFocus
              />

              {/* New Password */}
              <Input
                label="New password"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={form.newPassword}
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

              {/* Confirm Password */}
              <Input
                label="Confirm new password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={handleChange}
                leftIcon={FaLock}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={authLoading}
                >
                  Update password
                </Button>

                <div className="flex justify-between items-center text-xs pt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[var(--brand)] font-semibold hover:underline"
                    disabled={authLoading}
                  >
                    Resend OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Change email
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Security & Progress Marketing Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)] border-l border-[var(--border)] p-10 flex-col justify-between items-center text-center">
          <div className="space-y-3 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--brand-light)] text-[var(--brand)] flex items-center justify-center mx-auto shadow-sm">
              <FaShieldAlt className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">
              Secure Account Recovery
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
              We protect your account with single-use OTP codes sent directly to your registered inbox.
            </p>
          </div>

          {/* 2-Step Progress Indicator Card */}
          <div className="w-full p-5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] shadow-[var(--shadow-3d)] my-6 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  otpSent
                    ? 'bg-[var(--positive-bg)] text-[var(--positive)] border border-[var(--positive)]/30'
                    : 'bg-[var(--brand)] text-white'
                }`}
              >
                {otpSent ? '✓' : '1'}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">Step 1: Request OTP</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Enter email address to receive code</p>
              </div>
            </div>

            <div className="h-px bg-[var(--border)] my-1 ml-3" />

            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  otpSent
                    ? 'bg-[var(--brand)] text-white'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]'
                }`}
              >
                2
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">Step 2: Set New Password</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Verify OTP code & confirm new password</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            HisabiFY Account Security System
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
