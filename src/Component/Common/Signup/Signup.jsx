import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../../redux/authSlice';
import Button from '../Primitives/Button';
import Input from '../Primitives/Input';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export const Signup = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: 'male',
    dob: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setErrorMsg('Please agree to Terms and Conditions');
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    // Auto-prefix +91 if user entered a 10-digit Indian phone number without country code
    let formattedPhone = form.phone.trim();
    if (/^[6-9]\d{9}$/.test(formattedPhone)) {
      formattedPhone = `+91${formattedPhone}`;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await dispatch(register({ ...form, phone: formattedPhone })).unwrap();
      setLoading(false);
      if (response && !response.error) {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      const message = typeof err === 'string' ? err : err?.message || 'Could not register account. Please check inputs.';
      setErrorMsg(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-h-[75vh] overflow-y-auto pr-1">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Create your account</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Start splitting expenses with friends in seconds.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-[var(--negative-bg)] border border-[var(--negative)]/30 text-xs font-medium text-[var(--negative)]">
          {errorMsg}
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First name"
          name="firstName"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange}
          leftIcon={FaUser}
          required
        />
        <Input
          label="Last name"
          name="lastName"
          placeholder="Last name"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Phone & Email */}
      <div>
        <Input
          label="Phone number (with country code)"
          name="phone"
          type="tel"
          placeholder="e.g. +919876543210"
          value={form.phone}
          onChange={handleChange}
          leftIcon={FaPhone}
          required
        />
        <p className="text-[11px] text-[var(--text-secondary)] mt-1">
          Include country code (e.g. <span className="font-semibold text-[var(--brand)]">+91</span>) before your 10-digit mobile number.
        </p>
      </div>

      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="name@example.com"
        value={form.email}
        onChange={handleChange}
        leftIcon={FaEnvelope}
        required
      />

      {/* Gender & DOB */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 block">
            Gender
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="tactile-input w-full h-11 px-3 text-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 block">
            Date of birth
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="tactile-input w-full h-11 px-3 text-xs"
          />
        </div>
      </div>

      {/* Password */}
      <Input
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        leftIcon={FaLock}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
          >
            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </button>
        }
        required
      />

      {/* Terms Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer text-xs text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 rounded border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)]"
          />
          <span>I agree to the Terms of Service & Privacy Policy</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth isLoading={loading}>
          Create account
        </Button>
      </div>

      <p className="text-xs text-center text-[var(--text-secondary)] pt-1">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="text-[var(--brand)] font-bold hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default Signup;
