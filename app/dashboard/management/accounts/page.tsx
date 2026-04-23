"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { UserPlus, Edit2, Trash2, Shield, User, Loader2, X, Key } from 'lucide-react';
import clsx from 'clsx';

interface Teacher {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  roleName: string;
}

export default function AccountManagementPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/teachers');
      setTeachers(res.data.teachers || []);
    } catch (err) {
      console.error('Failed to fetch teachers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const openModal = (teacher: Teacher | null = null) => {
    setSelectedTeacher(teacher);
    if (teacher) {
      setFullName(teacher.fullName);
      setEmail(teacher.email);
      setRoleId(teacher.roleId);
      setPassword(''); // Leave empty for update unless changing
    } else {
      setFullName('');
      setEmail('');
      setPassword('');
      setRoleId(1);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedTeacher) {
        await api.put(`/teachers/${selectedTeacher.id}`, {
          Id: selectedTeacher.id,
          FullName: fullName,
          Email: email,
          Password: password || null,
          RoleId: roleId
        });
      } else {
        await api.post('/teachers', {
          FullName: fullName,
          Email: email,
          Password: password,
          RoleId: roleId
        });
      }
      fetchTeachers();
      closeModal();
    } catch (err) {
      console.error('Save failed', err);
      alert('Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.')) return;
    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      alert('Không thể xóa tài khoản. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Danh sách tài khoản</h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-0.5">Quản trị viên hệ thống</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <UserPlus size={18} />
            Thêm tài khoản
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-medium">Đang tải danh sách tài khoản...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Họ tên</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Email</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Vai trò</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{t.fullName}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{t.email}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight flex items-center gap-1 w-fit",
                        t.roleName === 'Admin' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {t.roleName === 'Admin' ? <Shield size={12} /> : <User size={12} />}
                        {t.roleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(t)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">
                  {selectedTeacher ? 'Sửa tài khoản' : 'Thêm tài khoản'}
                </h2>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Họ tên</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-800"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-800"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@school.edu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Mật khẩu {selectedTeacher && <span className="text-slate-400 lowercase italic">(Để trống nếu không đổi)</span>}
                  </label>
                  <div className="relative">
                    <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="password"
                      required={!selectedTeacher}
                      className="w-full pl-12 pr-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-800"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Vai trò</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRoleId(1)}
                      className={clsx(
                        "py-3 rounded-2xl font-bold border-2 transition-all flex items-center justify-center gap-2",
                        roleId === 1 ? "bg-indigo-50 border-indigo-500 text-indigo-600" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                      )}
                    >
                      <User size={18} />
                      Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleId(2)}
                      className={clsx(
                        "py-3 rounded-2xl font-bold border-2 transition-all flex items-center justify-center gap-2",
                        roleId === 2 ? "bg-amber-50 border-amber-500 text-amber-600" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                      )}
                    >
                      <Shield size={18} />
                      Admin
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting && <Loader2 size={20} className="animate-spin" />}
                    {selectedTeacher ? 'Cập nhật tài khoản' : 'Tạo tài khoản ngay'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
