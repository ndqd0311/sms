"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import clsx from 'clsx';

export default function BehaviorCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, name: '', pointValue: 0 });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/behavior-category');
      setCategories(res.data.behaviorCategories || res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: any) => {
    if (category) {
      setForm({ id: category.id, name: category.name, pointValue: category.pointValue });
    } else {
      setForm({ id: 0, name: '', pointValue: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.id === 0) {
        // Create
        const res = await api.post('/behavior-category', { Name: form.name, PointValue: Number(form.pointValue) });
        setCategories([...categories, { id: res.data, name: form.name, pointValue: Number(form.pointValue) }]);
      } else {
        // Update
        await api.put(`/behavior-category/${form.id}`, { Id: form.id, Name: form.name, PointValue: Number(form.pointValue) });
        setCategories(categories.map(c => c.id === form.id ? { ...c, name: form.name, pointValue: Number(form.pointValue) } : c));
      }
      setIsModalOpen(false);
    } catch (e: any) {
      alert(e.response?.data?.title || 'Lỗi khi lưu.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Chắc chắn muốn xoá hành vi này?')) return;
    try {
      await api.delete(`/behavior-category/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (e) {
      alert('Không thể xoá');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Quản lý Hành vi</h1>
          <p className="text-slate-500">Tùy chỉnh các danh mục hành vi và áp dụng cho nhiều lớp.</p>
        </div>
        <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Đang tải...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Tên hành vi</th>
                <th className="px-6 py-4 font-medium">Điểm</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-medium">{c.name}</td>
                  <td className="px-6 py-4">
                    <span className={clsx("px-2 py-1 rounded inline-block text-xs font-bold", c.pointValue >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                      {c.pointValue > 0 ? '+' : ''}{c.pointValue}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(c)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    Không có danh mục hành vi nào được tìm thấy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {form.id === 0 ? 'Thêm hành vi' : 'Cập nhật hành vi'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên hành vi</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Điểm Thưởng/Phạt</label>
                <input required type="number" value={form.pointValue} onChange={e => setForm({...form, pointValue: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Ví dụ: -1 hoặc 5" />
              </div>
              <div className="pt-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
