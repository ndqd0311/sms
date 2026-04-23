"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, Users, LayoutDashboard } from 'lucide-react';

export default function ClassesPage() {
  const [contexts, setContexts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const resSettings = await api.get('/teaching-context');
        setContexts(resSettings.data.teachingContexts || resSettings.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContexts();
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Đang tải danh sách lớp học...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Lớp Học Của Tôi</h1>
          <p className="text-slate-500">Quản lý sơ đồ và các lớp học bạn đang giảng dạy.</p>
        </div>
        <Link 
          href="/dashboard/classes/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tạo Lớp Học Mới
        </Link>
      </div>

      {contexts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có lớp học nào</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">Bạn chưa tạo hoặc tham gia lớp học nào. Hãy bắt đầu bằng cách tạo một sơ đồ lớp học mới.</p>
          <Link href="/dashboard/classes/create" className="text-indigo-600 font-bold hover:underline">
            Tạo Lớp Học Đầu Tiên
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contexts.map((ctx) => (
            <div key={ctx.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800 mb-1">{ctx.className || 'Lớp học'}</h2>
                <p className="text-sm font-medium text-slate-500">{ctx.contextName}</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-600 mb-6">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <LayoutDashboard size={16} className="text-slate-400"/>
                  {ctx.numCols}x{ctx.numRows}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-400">Bàn:</span>
                  {ctx.seatsPerTable} chỗ
                </div>
              </div>
              
              <Link 
                href={`/dashboard/classes/${ctx.id}/seating`}
                className="block text-center w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-2.5 rounded-xl transition-colors"
              >
                Mở Sơ Đồ
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
