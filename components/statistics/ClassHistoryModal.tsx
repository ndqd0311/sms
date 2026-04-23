import React, { useEffect, useState } from 'react';
import { X, History } from 'lucide-react';
import api from '@/lib/api';

export function ClassHistoryModal({
  lessonId,
  contextId,
  onClose
}: {
  lessonId?: number;
  contextId: string | number;
  onClose: () => void;
}) {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(lessonId || null);
  const [loading, setLoading] = useState(true);

  // Load lesson list on mount
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/lessons/by-context/${contextId}`);
        const list = res.data.lessons || res.data || [];
        setLessons(list);
        // auto-select: active lesson first, else the most recent
        if (!selectedLessonId && list.length > 0) {
          setSelectedLessonId(list[0].id);
        }
      } catch { /* silent */ }
    };
    fetchLessons();
  }, [contextId]);

  // Load history when selectedLessonId changes
  useEffect(() => {
    if (!selectedLessonId) { setLoading(false); return; }
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/behavior-logs/class/lesson/${selectedLessonId}`).catch(() => ({ data: [] }));
        setHistoryData(Array.isArray(res.data) ? res.data : (res.data.logs || []));
      } catch { /* silent */ } finally { setLoading(false); }
    };
    fetchHistory();
  }, [selectedLessonId]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <History size={20} className="text-indigo-600" />
            Lịch sử hành vi — Cả lớp
          </h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Lesson Picker */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white">
          <select
            value={selectedLessonId ?? ''}
            onChange={e => setSelectedLessonId(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          >
            {lessons.length === 0 && <option value="">Chưa có tiết học nào</option>}
            {lessons.map((l: any) => (
              <option key={l.id} value={l.id}>
                {l.name}{l.lessonStatus === 1 ? ' 🟢' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-full text-slate-400 font-medium">Đang tải dữ liệu...</div>
          ) : !selectedLessonId ? (
            <div className="h-full flex justify-center items-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl">
              Chọn một tiết học ở trên để xem lịch sử
            </div>
          ) : historyData.length === 0 ? (
            <div className="h-full flex justify-center items-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl">
              Không có dữ liệu hành vi cho tiết học này
            </div>
          ) : (
            <div className="space-y-3">
              {historyData.map((log: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-indigo-600">{log.studentName || 'Học sinh'}</span>
                    <span className="font-semibold text-slate-800 mt-0.5">{log.behaviorName || 'Hành vi'}</span>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(log.occurredAt).toLocaleString('vi-VN')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
