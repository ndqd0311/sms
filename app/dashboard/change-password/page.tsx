"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { Key, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  show: boolean;
  toggleShow: () => void;
  icon: any;
}

// Chuyển Component ra ngoài và dùng style thủ công để tránh lỗi vị trí
const PasswordInput = ({ label, value, onChange, placeholder, show, toggleShow, icon: Icon }: PasswordInputProps) => (
  <div style={{ marginBottom: '1.5rem', width: '100%' }}>
    <label style={{
      display: 'block',
      fontSize: '11px',
      fontWeight: '900',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      marginBottom: '8px',
      marginLeft: '4px'
    }}>
      {label}
    </label>
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Icon bên trái */}
      <div style={{
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#cbd5e1',
        pointerEvents: 'none',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Icon size={18} />
      </div>

      <input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 48px 14px 48px', // Trái phải đều chừa chỗ cho icon
          backgroundColor: '#f8fafc',
          border: '2px solid #f1f5f9',
          borderRadius: '16px',
          fontSize: '15px',
          fontWeight: '600',
          color: '#1e293b',
          outline: 'none',
          transition: 'all 0.2s',
          display: 'block'
        }}
        // Hiệu ứng khi focus
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#f1f5f9';
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />

      {/* Nút ẩn hiện bên phải */}
      <button
        type="button"
        onClick={toggleShow}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#cbd5e1',
          cursor: 'pointer',
          padding: '8px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
        onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPass, setShowPass] = useState({ old: false, next: false, confirm: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await api.put('/auth/password', {
        OldPassword: oldPassword,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword
      });

      setMessage({ type: 'success', text: 'Mật khẩu đã được cập nhật thành công!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Mật khẩu cũ không chính xác hoặc lỗi hệ thống.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[#f8fafc]">
      <div className="w-full max-w-2xl bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-10 md:p-16 border border-slate-100 relative overflow-hidden animate-in fade-in zoom-in duration-500">

        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

        <div className="text-center mb-12 relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
            <ShieldCheck className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-3">Đổi mật khẩu</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            Nâng cấp bảo mật cho tài khoản của bạn
          </p>
        </div>

        {message && (
          <div className={clsx(
            "mb-10 p-5 rounded-[24px] border flex items-center gap-4 animate-in slide-in-from-top-4 duration-500",
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
          )}>
            <div className="p-2 rounded-xl bg-white shadow-sm shrink-0">
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <PasswordInput
            label="Mật khẩu hiện tại"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu đang sử dụng"
            show={showPass.old}
            toggleShow={() => setShowPass({ ...showPass, old: !showPass.old })}
            icon={Lock}
          />

          <div className="grid md:grid-cols-2 gap-x-6">
            <PasswordInput
              label="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ít nhất 6 ký tự"
              show={showPass.next}
              toggleShow={() => setShowPass({ ...showPass, next: !showPass.next })}
              icon={Key}
            />

            <PasswordInput
              label="Xác nhận lại"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              show={showPass.confirm}
              toggleShow={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
              icon={CheckCircle2}
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-slate-200 hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận cập nhật"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full mt-6 py-2 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors uppercase tracking-widest"
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
