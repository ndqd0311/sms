"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Users, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function CreateClassPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'manual' | 'sharecode'>('manual');

  // Manual Form State
  const [className, setClassName] = useState('');
  const [cols, setCols] = useState('');
  const [rows, setRows] = useState('');
  const [seatsPerTable, setSeatsPerTable] = useState('1'); // Default to 1

  // Share Code Form State
  const [shareCode, setShareCode] = useState('');

  // App State
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const newErrors: Record<string, boolean> = {};
    if (!className.trim()) newErrors.className = true;
    if (!cols) newErrors.cols = true;
    if (!rows) newErrors.rows = true;
    if (!seatsPerTable) newErrors.seatsPerTable = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setApiError('Vui lòng điền đầy đủ cấu hình sơ đồ lớp!');
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const classRes = await api.post('/classes', { Name: className });
      const createdClassId = classRes.data;

      const timeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
      const isAM = new Date().getHours() < 12;
      const autoContextName = `${className} - ${isAM ? 'Sáng' : 'Chiều'} ${timeString}`;

      const contextRes = await api.post('/teaching-context', {
        classId: createdClassId,
        className: className,
        teachingContextName: autoContextName,
        numCols: parseInt(cols),
        numRows: parseInt(rows),
        seatsPerTable: parseInt(seatsPerTable)
      });

      router.push(`/dashboard/classes/${contextRes.data}/seating`);
    } catch (err: any) {
      setApiError(err.response?.data?.title || 'Đã có lỗi xảy ra khi tạo lớp.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!shareCode.trim()) {
      setErrors({ shareCode: !shareCode.trim() });
      setApiError('Vui lòng nhập mã chia sẻ!');
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      // POST /api/share-code/import
      const res = await api.post('/share-code/import', {
        shareCode: shareCode.trim()
      });
      router.push(`/dashboard/classes/${res.data.teachingContextId}/seating`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Mã chia sẻ không hợp lệ hoặc đã hết hạn!';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Tạo lớp học mới</h1>
        <p className="text-slate-500">Thiết lập cấu hình sơ đồ lớp hoặc nhập từ mã chia sẻ.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setTab('manual')}
            className={clsx(
              "flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2",
              tab === 'manual' ? "bg-white text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <Users size={18} />
            Tạo thủ công
          </button>
          <button
            onClick={() => setTab('sharecode')}
            className={clsx(
              "flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2",
              tab === 'sharecode' ? "bg-white text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <Copy size={18} />
            Nhập từ mã chia sẻ
          </button>
        </div>

        <div className="p-8">
          {apiError && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{apiError}</span>
            </div>
          )}

          {tab === 'manual' ? (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tên lớp học</label>
                <input
                  type="text"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className={clsx(
                    "w-full bg-white border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
                    errors.className ? "border-red-500" : "border-slate-300"
                  )}
                  placeholder="VD: 10A1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số dãy bàn (Cột)</label>
                  <input
                    type="number" min="1" max="10"
                    value={cols}
                    onChange={e => setCols(e.target.value)}
                    className={clsx(
                      "w-full bg-white border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
                      errors.cols ? "border-red-500" : "border-slate-300"
                    )}
                    placeholder="VD: 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số hàng ngang</label>
                  <input
                    type="number" min="1" max="15"
                    value={rows}
                    onChange={e => setRows(e.target.value)}
                    className={clsx(
                      "w-full bg-white border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
                      errors.rows ? "border-red-500" : "border-slate-300"
                    )}
                    placeholder="VD: 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Chỗ ngồi / Bàn</label>
                  <input
                    type="number" min="1" max="4"
                    value={seatsPerTable}
                    onChange={e => setSeatsPerTable(e.target.value)}
                    className={clsx(
                      "w-full bg-white border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
                      errors.seatsPerTable ? "border-red-500" : "border-slate-300"
                    )}
                    placeholder="VD: 2"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận Lưu'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleShareCodeSubmit} className="space-y-6">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-700">
                Nhập mã chia sẻ do giáo viên khác cung cấp để sao chép lớp học của họ thành lớp mới của bạn.
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mã chia sẻ (Share Code)</label>
                <input
                  type="text"
                  value={shareCode}
                  onChange={e => setShareCode(e.target.value)}
                  className={clsx(
                    "w-full bg-white border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono tracking-widest text-lg",
                    errors.shareCode ? "border-red-500" : "border-slate-300"
                  )}
                  placeholder="Nhập mã chia sẻ..."
                  autoFocus
                />
                {errors.shareCode && <p className="mt-1 text-xs text-red-500">Vui lòng nhập mã chia sẻ</p>}
              </div>
              <div className="pt-4 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => { setTab('manual'); setErrors({}); setApiError(''); }}
                  className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang tìm lớp...' : 'Vào lớp học'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
