import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../../../redux/expenseSlice';
import { getAllGroup } from '../../../redux/groupSlice';
import { toast } from 'react-toastify';
import {
  FaQrcode,
  FaTimes,
  FaCamera,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaUsers,
  FaUser,
  FaTag,
} from 'react-icons/fa';

/**
 * Parses standard UPI QR Code URI strings into structured objects
 * Format: upi://pay?pa=address@upi&pn=Name&am=100.00&tn=Note&cu=INR
 */
export const parseUpiQr = (qrString) => {
  if (!qrString) return null;
  const trimmed = qrString.trim();

  if (trimmed.toLowerCase().startsWith('upi://pay')) {
    try {
      const url = new URL(trimmed.replace(/^upi:\/\//i, 'http://'));
      const params = new URLSearchParams(url.search);
      return {
        pa: params.get('pa') || '',
        pn: params.get('pn') ? decodeURIComponent(params.get('pn')) : '',
        am: params.get('am') || '',
        tn: params.get('tn') ? decodeURIComponent(params.get('tn')) : '',
        cu: params.get('cu') || 'INR',
        raw: trimmed,
      };
    } catch (e) {
      // Fallback manual regex match
      const paMatch = trimmed.match(/pa=([^&]+)/i);
      const pnMatch = trimmed.match(/pn=([^&]+)/i);
      const amMatch = trimmed.match(/am=([^&]+)/i);
      const tnMatch = trimmed.match(/tn=([^&]+)/i);
      return {
        pa: paMatch ? decodeURIComponent(paMatch[1]) : '',
        pn: pnMatch ? decodeURIComponent(pnMatch[1]) : '',
        am: amMatch ? decodeURIComponent(amMatch[1]) : '',
        tn: tnMatch ? decodeURIComponent(tnMatch[1]) : '',
        cu: 'INR',
        raw: trimmed,
      };
    }
  }

  // Simple VPA / UPI ID format (e.g. 9876543210@paytm)
  if (/^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/.test(trimmed)) {
    return {
      pa: trimmed,
      pn: trimmed.split('@')[0],
      am: '',
      tn: '',
      cu: 'INR',
      raw: `upi://pay?pa=${trimmed}&cu=INR`,
    };
  }

  return null;
};

export const ScanAndPayModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { groups = [] } = useSelector((state) => state.group);
  const currentUser = useSelector((state) => state.auth.user);

  // Steps: 'scan' | 'details'
  const [step, setStep] = useState('scan');
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState(null);

  // Expense Form State
  const [expenseType, setExpenseType] = useState('personal'); // 'personal' | 'group'
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('foodDining');
  const [upiId, setUpiId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const html5QrCodeRef = useRef(null);

  // Fetch groups if not already loaded when modal opens
  useEffect(() => {
    if (open && (!groups || groups.length === 0)) {
      dispatch(getAllGroup());
    }
  }, [open, groups, dispatch]);

  // Initialize QR scanner when modal opens in 'scan' step
  useEffect(() => {
    if (!open) {
      stopScanner();
      return;
    }

    if (step === 'scan') {
      // Small timeout to ensure DOM container #qr-reader is ready
      const timer = setTimeout(() => {
        startScanner();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, step]);

  const startScanner = async () => {
    setScannerError(null);
    try {
      if (html5QrCodeRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      setIsScanning(true);
      await html5QrCode.start(
        { facingMode: 'environment' }, // Rear camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleQrSuccess(decodedText);
        },
        () => {
          // ignore scan frame errors
        }
      );
    } catch (err) {
      console.error('Camera Scanner Error:', err);
      setIsScanning(false);
      setScannerError('Could not access camera. Please allow camera permissions or enter UPI ID manually.');
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        // ignore cleanup errors
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQrSuccess = async (qrText) => {
    await stopScanner();
    const parsed = parseUpiQr(qrText);

    if (parsed) {
      setScannedData(parsed);
      setUpiId(parsed.pa);
      setPayeeName(parsed.pn || parsed.pa);
      if (parsed.am) setAmount(parsed.am);
      setTitle(parsed.tn || (parsed.pn ? `Payment to ${parsed.pn}` : 'UPI Expense'));
      setStep('details');
      toast.success('UPI QR Code scanned successfully!');
    } else {
      toast.error('Scanned QR code is not a valid UPI code. Please try again.');
      setStep('scan');
    }
  };

  const handleManualEntry = () => {
    stopScanner();
    setScannedData({
      pa: '',
      pn: '',
      am: '',
      tn: '',
      cu: 'INR',
    });
    setStep('details');
  };

  const handleCloseModal = async () => {
    await stopScanner();
    setStep('scan');
    setScannedData(null);
    setTitle('');
    setAmount('');
    setUpiId('');
    setPayeeName('');
    onClose();
  };

  const handlePayViaUpi = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter an expense title');
      return;
    }
    if (expenseType === 'group' && !selectedGroupId) {
      toast.error('Please select a group');
      return;
    }

    if (upiId) {
      const numericAmount = Number(amount);
      const encodedPn = encodeURIComponent(payeeName || upiId);
      const encodedTn = encodeURIComponent(title.trim() || 'Hisabify Expense');
      const upiUrl = `upi://pay?pa=${upiId}&pn=${encodedPn}&am=${numericAmount}&tn=${encodedTn}&cu=INR`;

      toast.info('Opening UPI payment app...');
      window.location.href = upiUrl;
    }
    setStep('confirm');
  };

  const handleSaveExpense = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter an expense title');
      return;
    }
    if (expenseType === 'group' && !selectedGroupId) {
      toast.error('Please select a group');
      return;
    }

    try {
      setIsSubmitting(true);
      const numericAmount = Number(amount);

      let payloadData = {
        title: title.trim(),
        description: title.trim(),
        amount: numericAmount,
        category: category || 'other',
        createdBy: currentUser?._id,
        createdFor: currentUser?._id,
        paymentMode: 'UPI',
        date: new Date().toISOString().split('T')[0],
      };

      if (expenseType === 'group') {
        const groupObj = groups.find((g) => String(g._id) === String(selectedGroupId));
        const realMembers = (groupObj?.members || []).map((m) => ({ userId: m._id || m }));
        const dummyMembers = (groupObj?.dummyMembers || []).map((d) => ({
          dummyId: d._id,
          name: d.name,
        }));
        const splitwith = [...realMembers, ...dummyMembers];

        payloadData = {
          ...payloadData,
          splitwith,
        };
      }

      // Dispatch Add Expense to Redux/Backend ONLY after user confirmation
      await dispatch(
        addExpense({
          data: payloadData,
          groupId: expenseType === 'group' ? selectedGroupId : null,
        })
      ).unwrap();

      handleCloseModal();
    } catch (err) {
      console.error('Failed to save expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-floating)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-hover)] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {step === 'details' ? (
              <button
                onClick={() => {
                  setStep('scan');
                  startScanner();
                }}
                className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                title="Back to camera"
              >
                <FaArrowLeft className="w-4 h-4 text-white" />
              </button>
            ) : step === 'confirm' ? (
              <button
                onClick={() => setStep('details')}
                className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                title="Back to details"
              >
                <FaArrowLeft className="w-4 h-4 text-white" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                <FaQrcode className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold leading-tight">
                {step === 'scan'
                  ? 'Scan & Pay via UPI'
                  : step === 'confirm'
                  ? 'Confirm Payment Status'
                  : 'Expense & Payment Details'}
              </h3>
              <p className="text-xs opacity-80">
                {step === 'scan'
                  ? 'Scan GPay, PhonePe, Paytm or BharatPe QR'
                  : step === 'confirm'
                  ? 'Did your UPI payment complete?'
                  : 'Auto-filled from UPI QR Code'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: SCANNER VIEWPORT */}
          {step === 'scan' && (
            <div className="space-y-4 text-center">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-[280px] mx-auto border-2 border-[var(--brand)] shadow-inner flex items-center justify-center">
                <div id="qr-reader" className="w-full h-full"></div>

                {!isScanning && !scannerError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 space-y-2 bg-black/80">
                    <FaCamera className="w-8 h-8 animate-pulse text-[var(--brand)]" />
                    <span className="text-xs font-medium">Starting camera...</span>
                  </div>
                )}
              </div>

              {scannerError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-medium">
                  {scannerError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleManualEntry}
                  className="text-xs font-bold text-[var(--brand)] hover:underline inline-flex items-center gap-1.5"
                >
                  Enter UPI ID / Amount Manually →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EXPENSE & PAYMENT DETAILS */}
          {step === 'details' && (
            <div className="space-y-4">
              {/* Payee Info Card */}
              {upiId && (
                <div className="p-3.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-light)] text-[var(--brand)] flex items-center justify-center shrink-0">
                    <FaCheckCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {payeeName || 'Verified Payee'}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] truncate">{upiId}</div>
                  </div>
                </div>
              )}

              {/* Expense Type Selection (Personal vs Group) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setExpenseType('personal')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    expenseType === 'personal'
                      ? 'bg-[var(--surface-1)] text-[var(--brand)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <FaUser className="w-3.5 h-3.5" /> Personal
                </button>
                <button
                  type="button"
                  onClick={() => setExpenseType('group')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    expenseType === 'group'
                      ? 'bg-[var(--surface-1)] text-[var(--brand)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <FaUsers className="w-3.5 h-3.5" /> Group Split
                </button>
              </div>

              {/* Select Group (if Group Expense) */}
              {expenseType === 'group' && (
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">Select Group</label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => {
                      setSelectedGroupId(e.target.value);
                      e.target.blur();
                    }}
                    className="w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
                  >
                    <option value="">-- Choose Group --</option>
                    {groups.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.groupName} ({g.members?.length || 0} members)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl text-lg font-extrabold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] tabular-nums"
                  required
                />
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Expense Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner, Grocery Split"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
                  required
                />
              </div>

              {/* Category & UPI ID Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      e.target.blur();
                    }}
                    className="w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
                  >
                    <option value="foodDining">Food & Dining</option>
                    <option value="groceries">Groceries</option>
                    <option value="transport">Transport</option>
                    <option value="utilities">Utilities & Bills</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="health">Medical & Health</option>
                    <option value="rent">Rent & Stay</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">UPI ID (VPA)</label>
                  <input
                    type="text"
                    placeholder="merchant@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT CONFIRMATION BEFORE SAVING */}
          {step === 'confirm' && (
            <div className="space-y-4 text-center py-2 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[var(--brand-light)] text-[var(--brand)] mx-auto flex items-center justify-center shadow-inner">
                <FaCheckCircle className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-[var(--text-primary)]">Did your payment complete?</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs mx-auto">
                  Confirm whether your payment of{' '}
                  <span className="font-extrabold text-[var(--brand)]">₹{amount}</span> to{' '}
                  <span className="font-bold text-[var(--text-primary)]">{payeeName || upiId || 'Payee'}</span> succeeded in your UPI app.
                </p>
              </div>

              <div className="p-3.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)] font-medium">Expense Title:</span>
                  <span className="font-bold text-[var(--text-primary)]">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)] font-medium">Amount:</span>
                  <span className="font-extrabold text-[var(--brand)]">₹{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)] font-medium">Expense Type:</span>
                  <span className="font-semibold capitalize text-[var(--text-primary)]">{expenseType}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSaveExpense}
                  className="w-full py-3 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-hover)] text-white text-xs font-extrabold rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <FaCheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'Saving Expense...' : 'Yes, Payment Done — Save Expense'}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCloseModal}
                  className="w-full py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold rounded-xl transition-all"
                >
                  ✕ No, Payment Failed / Cancelled (Discard)
                </button>

                {upiId && (
                  <button
                    type="button"
                    onClick={() => {
                      const numericAmount = Number(amount);
                      const encodedPn = encodeURIComponent(payeeName || upiId);
                      const encodedTn = encodeURIComponent(title.trim() || 'Hisabify Expense');
                      window.location.href = `upi://pay?pa=${upiId}&pn=${encodedPn}&am=${numericAmount}&tn=${encodedTn}&cu=INR`;
                    }}
                    className="text-xs font-semibold text-[var(--brand)] hover:underline block mx-auto pt-1"
                  >
                    Re-open GPay / PhonePe App →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Action Buttons for Details Step */}
        {step === 'details' && (
          <div className="p-4 bg-[var(--surface-2)] border-t border-[var(--border)] space-y-2 shrink-0">
            {upiId && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePayViaUpi}
                className="w-full py-2.5 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-hover)] text-white text-xs font-extrabold rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <FaExternalLinkAlt className="w-3.5 h-3.5" />
                Pay via GPay / PhonePe
              </button>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveExpense}
              className="w-full py-2 bg-[var(--surface-1)] border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] text-xs font-bold rounded-xl transition-all"
            >
              Save Expense Directly (Without UPI App)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanAndPayModal;
