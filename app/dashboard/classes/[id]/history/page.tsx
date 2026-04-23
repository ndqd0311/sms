"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import clsx from 'clsx';
import { Clock } from 'lucide-react';

export default function HistoryPage() {
  const params = useParams();
  const contextId = params.id as string;
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/lessons/by-context/${contextId}`);
        const data = res.data.lessons || res.data || [];
        setLessons(data);
        if (data.length > 0) setSelectedLesson(data[0].id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (contextId) fetchLessons();
  }, [contextId]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedLesson) return;
      try {
        // Backend API currently accepts lessonId in path or query
        const res = await api.get(`/behavior-logs/class/${selectedLesson}`);
        setLogs(res.data.classBehaviors || res.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchHistory();
  }, [selectedLesson]);

  if (loading) return <div className="p-12 text-slate-500">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Lịch sử hành vi</h1>
          <p className="text-slate-500">Xem lại dữ liệu nề nếp của cả lớp theo từng tiết học.</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-slate-500 block mb-2">Chọn tiết học:</label>
        <select 
          className="bg-white border border-slate-300 text-slate-800 text-sm rounded-lg block p-2.5 w-64 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedLesson || ''}
          onChange={e => setSelectedLesson(parseInt(e.target.value))}
        >
          {lessons.map(l => (
            <option key={l.id} value={l.id}>{l.name} - {new Date(l.startAt).toLocaleDateString()}</option>
          ))}
          {lessons.length === 0 && <option value="">Không có tiết học nào</option>}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Học sinh</th>
              <th className="px-6 py-4 font-medium">Hành vi</th>
              <th className="px-6 py-4 font-medium">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-800 font-medium">{log.studentName}</td>
                <td className="px-6 py-4 text-slate-600">{log.behaviorName}</td>
                <td className="px-6 py-4 text-slate-400 flex items-center gap-2">
                  <Clock size={14} /> {new Date(log.occurredAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                  No data to show / Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
