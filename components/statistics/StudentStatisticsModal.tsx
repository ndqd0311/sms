import React, { useEffect, useState } from 'react';
import { X, TrendingUp, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';
import clsx from 'clsx';

export function StudentStatisticsModal({
  student,
  lessonId,
  classId,
  contextId,
  onClose
}: {
  student: any;
  lessonId?: number;
  classId?: number;
  contextId?: string | number;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'chart' | 'history'>('chart');
  const [chartData, setChartData] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'chart') {
          const res = await api.get(`/statistics/student/${student.id}/points`);
          const rawData = res.data.stats || [];
          
          // Format for recharts — fields: lessonName, lessonStartAt, point
          const formatted = rawData.map((item: any, idx: number) => ({
            name: item.lessonName || `Tiết ${idx + 1}`,
            point: item.point ?? 0,
            date: item.lessonStartAt ? new Date(item.lessonStartAt).toLocaleDateString('vi-VN') : ''
          }));
          setChartData(formatted);
        } else {
          // Fetch ALL logs for this student in this context
          const res = await api.get(`/behavior-logs/student/${student.id}/context/${contextId}`);
          setHistoryData(res.data.logs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (student?.id) {
      fetchData();
    }
  }, [student?.id, activeTab, contextId]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[80vh] relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full shadow-sm transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {student?.fullName || student?.name}
            </h2>
            <p className="text-sm text-slate-500">Phân tích nề nếp & hành vi</p>
          </div>
        </div>

        <div className="flex border-b border-slate-200 px-6 bg-slate-50">
          <button 
            className={clsx("px-4 py-3 text-sm font-bold border-b-2 flex items-center gap-2", activeTab === 'chart' ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700")}
            onClick={() => setActiveTab('chart')}
          >
            <TrendingUp size={16}/> Thống kê Điểm
          </button>
          <button 
            className={clsx("px-4 py-3 text-sm font-bold border-b-2 flex items-center gap-2", activeTab === 'history' ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700")}
            onClick={() => setActiveTab('history')}
          >
            <History size={16}/> Lịch sử
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-full text-slate-400 font-medium">Đang tải dữ liệu...</div>
          ) : activeTab === 'chart' ? (
            <div className="h-full flex flex-col">
              {chartData.length === 0 ? (
                <div className="flex-1 flex justify-center items-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl">Không có dữ liệu thống kê</div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Tiến trình nề nếp</span>
                  </div>
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} width={40} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                        />
                        <Line type="monotone" dataKey="point" name="Điểm" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-full">
              {historyData.length === 0 ? (
                <div className="h-full flex justify-center items-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl">Không có dữ liệu lịch sử</div>
              ) : (
                <div className="space-y-3">
                  {historyData.map((log: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{log.behaviorName || 'Hành vi'}</span>
                        <span className="text-xs text-slate-500">{new Date(log.occurredAt).toLocaleString('vi-VN')}</span>
                      </div>
                      <span className={clsx("font-black text-lg", log.pointValue > 0 ? "text-emerald-600" : log.pointValue < 0 ? "text-red-600" : "text-slate-600")}>
                        {log.pointValue > 0 ? '+' : ''}{log.pointValue}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
