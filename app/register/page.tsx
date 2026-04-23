"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu và Xác nhận mật khẩu không khớp.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', { 
        FullName: fullName, 
        Email: email, 
        Password: password,
        ConfirmPassword: confirmPassword 
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.errors && typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors).flat().join(' ');
        setError(errorMessages);
      } else {
        const errMsg = typeof data === 'string' ? data : (data?.title || data?.detail || 'Đăng ký thất bại. Kiểm tra dữ liệu đầu vào.');
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Đăng Ký Tài Khoản</h1>
        <p className="text-slate-500 mb-6">Tạo tài khoản giáo viên mới trên hệ thống.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-200">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Họ Tên</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Tạo Tải Khoản'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
