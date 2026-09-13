import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, updateEmail, updatePhone } from '../../../redux/authSlice';
import Card from '../../Common/Primitives/Card';
import Button from '../../Common/Primitives/Button';
import Input from '../../Common/Primitives/Input';
import ProfilePhoto from './ProfilePhoto';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaMoneyBillWave,
  FaPen,
  FaSave,
  FaTimes,
} from 'react-icons/fa';

export const ProfilePage = () => {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editable, setEditable] = useState(false);
  const [userData, setUserData] = useState(user || {});
  const [emailUpdate, setEmailUpdate] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async () => {
    setIsSubmitting(true);
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      dob: userData.dob,
      gender: userData.gender,
      occupation: userData.occupation,
      income: userData.income,
      profile: userData.profile,
    };

    try {
      await dispatch(updateProfile(payload)).unwrap();
      setIsSubmitting(false);
      setEditable(false);
      setMsg('Profile updated successfully');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setIsSubmitting(false);
      setMsg('Could not update profile. Check connection.');
    }
  };

  const handleEmailSave = async () => {
    try {
      await dispatch(updateEmail(userData.email)).unwrap();
      setEmailUpdate(false);
    } catch (err) {
      // Toast handles error feedback
    }
  };

  const handlePhoneSave = async () => {
    try {
      await dispatch(updatePhone(userData.phone)).unwrap();
      setPhoneUpdate(false);
    } catch (err) {
      // Toast handles error feedback
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Alignment */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight">
            Profile settings
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] truncate">
            Manage your personal profile and account credentials
          </p>
        </div>

        {editable ? (
          <div className="flex items-center gap-2 shrink-0">
            {/* <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditable(false)}
              icon={FaTimes}
              className="whitespace-nowrap"
            >
              Cancel
            </Button> */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleProfileUpdate}
              isLoading={isSubmitting}
              icon={FaSave}
              className="whitespace-nowrap"
            >
              Save profile
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditable(true)}
            icon={FaPen}
            className="shrink-0 whitespace-nowrap"
          >
            Edit profile
          </Button>
        )}
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-[var(--positive-bg)] border border-[var(--positive)]/30 text-xs font-semibold text-[var(--positive)] animate-fadeIn">
          {msg}
        </div>
      )}

      {/* Main Profile Info Header Card - Centered Photo, Name, Email */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-3 w-full">
          <div className="flex justify-center items-center w-full">
            <ProfilePhoto profile={userData.profile} setUserData={setUserData} />
          </div>
          <div className="space-y-1 text-center w-full flex flex-col items-center">
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)] text-center">
              {userData.firstName} {userData.lastName}
            </h3>
            <p className="text-sm font-medium text-[var(--text-secondary)] text-center">{userData.email}</p>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[var(--brand-light)] text-[var(--brand)] text-xs font-bold text-center mt-2 shadow-sm">
              Active account
            </span>
          </div>
        </div>
      </Card>

      {/* Grid of Profile Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Details Card */}
        <Card className="space-y-4">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider pb-2 border-b border-[var(--border)]">
            Personal details
          </h4>

          <Input
            label="First name"
            name="firstName"
            value={userData.firstName || ''}
            onChange={handleChange}
            disabled={!editable}
            leftIcon={FaUser}
          />

          <Input
            label="Last name"
            name="lastName"
            value={userData.lastName || ''}
            onChange={handleChange}
            disabled={!editable}
          />

          {/* Email field with standalone inline save */}
          <div className="relative">
            <Input
              label="Email address"
              name="email"
              value={userData.email || ''}
              onChange={handleChange}
              disabled={!emailUpdate}
              leftIcon={FaEnvelope}
              rightElement={
                <button
                  type="button"
                  onClick={emailUpdate ? handleEmailSave : () => setEmailUpdate(true)}
                  className="text-xs font-bold text-[var(--brand)] hover:underline px-1 py-0.5"
                >
                  {emailUpdate ? 'Save' : 'Update'}
                </button>
              }
            />
          </div>

          {/* Phone field with standalone inline save */}
          <div className="relative">
            <Input
              label="Phone number"
              name="phone"
              value={userData.phone || ''}
              onChange={handleChange}
              disabled={!phoneUpdate}
              leftIcon={FaPhone}
              rightElement={
                <button
                  type="button"
                  onClick={phoneUpdate ? handlePhoneSave : () => setPhoneUpdate(true)}
                  className="text-xs font-bold text-[var(--brand)] hover:underline px-1 py-0.5"
                >
                  {phoneUpdate ? 'Save' : 'Update'}
                </button>
              }
            />
          </div>
        </Card>

        {/* Work & Financial Details Card */}
        <Card className="space-y-4">
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider pb-2 border-b border-[var(--border)]">
            Work & Financial info
          </h4>

          <Input
            label="Occupation"
            name="occupation"
            value={userData.occupation || ''}
            onChange={handleChange}
            disabled={!editable}
            leftIcon={FaBriefcase}
            placeholder="Software Engineer"
          />

          <Input
            label="Monthly income (₹)"
            name="income"
            type="number"
            inputMode="decimal"
            value={userData.income || ''}
            onChange={handleChange}
            disabled={!editable}
            leftIcon={FaMoneyBillWave}
            placeholder="50000"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 block">
                Gender
              </label>
              <select
                name="gender"
                value={userData.gender || 'male'}
                onChange={handleChange}
                disabled={!editable}
                className="tactile-input w-full h-11 px-3 text-xs sm:text-sm font-medium"
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
                value={userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                disabled={!editable}
                className="tactile-input w-full h-11 px-3 text-xs font-medium"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Save Profile Button */}
      {editable && (
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] animate-fadeIn">
          <Button variant="secondary" onClick={() => setEditable(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProfileUpdate} isLoading={isSubmitting} icon={FaSave}>
            Save profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
