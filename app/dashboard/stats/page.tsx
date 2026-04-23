"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { TrendingUp, Search, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import clsx from 'clsx';

export default function StatisticsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedContext, setSelectedContext] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loadingContexts, setLoadingContexts] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [search, setSearch] = useState('');

  // Fetch all teaching contexts
  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const res = await api.get('/teaching-context');
        setClasses(res.data.teachingContexts || res.data || []);
      } catch { /* silent */ } finally { setLoadingContexts(false); }
    };
    fetchContexts();
  }, []);

  // Fetch students when context changes
  useEffect(() => {
    if (!selectedContext?.classId) return;
    const fetchStudents = async () => {
      try {
        const res = await api.get(`/student/class/${selectedContext.classId}`);
        setStudents(res.data.students || res.data || []);
        setSelectedStudent(null);
        setChartData([]);
        setTotalPoints(0);
      } catch { /* silent */ }
    };
    fetchStudents();
  }, [selectedContext?.classId]);

  // Fetch chart data when student changes
  useEffect(() => {
    if (!selectedStudent?.id || !selectedContext?.id) return;
    const fetchData = async () => {
      setLoadingChart(true);
      try {
        const res = await api.get(`/statistics/student/${selectedStudent.id}/points`);
        const rawData = res.data.stats || [];
        const total = res.data.totalPoints ?? rawData.reduce((s: number, i: any) => s + (i.point ?? 0), 0);
        setTotalPoints(total);
        setChartData(rawData.map((item: any, idx: number) => ({
          name: item.lessonName || `Tiết ${idx + 1}`,
          point: item.point ?? 0,
        })));
      } catch { /* silent */ } finally { setLoadingChart(false); }

      setLoadingHistory(true);
      try {
        const res = await api.get(`/behavior-logs/student/${selectedStudent.id}/context/${selectedContext.id}`);
        setHistoryData(res.data.logs || []);
      } catch { /* silent */ } finally { setLoadingHistory(false); }
    };
    fetchData();
  }, [selectedStudent?.id, selectedContext?.id]);

  const filteredStudents = students.filter(s =>
    (s.fullName || s.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <TrendingUp className="text-indigo-600" size={32} />
            Thống kê Điểm Nề nếp
          </h1>
          <p className="text-slate-500 mt-1">Theo dõi tiến trình điểm nề nếp qua các tiết học</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: class + student picker */}
          <div className="space-y-4">
            {/* Class selector */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chọn Lớp học</h3>
              {loadingContexts ? (
                <div className="text-slate-400 text-sm text-center py-4">Đang tải...</div>
              ) : classes.length === 0 ? (
                <div className="text-slate-400 text-sm text-center py-4">Chưa có lớp nào</div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {classes.map((ctx: any) => (
                    <button
                      key={ctx.id}
                      onClick={() => setSelectedContext(ctx)}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedContext?.id === ctx.id
                          ? "bg-indigo-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {ctx.contextName || ctx.className}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Student selector */}
            {selectedContext && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chọn Học sinh</h3>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm học sinh..."
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="text-slate-400 text-sm text-center py-4">Không có học sinh</div>
                  ) : filteredStudents.map((s: any) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedStudent?.id === s.id
                          ? "bg-indigo-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {s.fullName || s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: chart */}
          <div className="md:col-span-2 space-y-4">
            {!selectedStudent ? (
              <div className="h-80 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={48} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">Chọn lớp và học sinh để xem biểu đồ</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Học sinh</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{selectedStudent.fullName || selectedStudent.name}</p>
                  </div>
                  <div className={clsx(
                    "rounded-2xl border shadow-sm p-5",
                    totalPoints >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                  )}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng điểm</p>
                    <p className={clsx("text-3xl font-black mt-1", totalPoints >= 0 ? "text-emerald-600" : "text-red-600")}>
                      {totalPoints > 0 ? '+' : ''}{totalPoints}
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">Tiến trình điểm nề nếp</h3>
                  {loadingChart ? (
                    <div className="h-56 flex items-center justify-center text-slate-400">Đang tải biểu đồ...</div>
                  ) : chartData.length === 0 ? (
                    <div className="h-56 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      Học sinh chưa tham gia tiết học nào
                    </div>
                  ) : (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPoint" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={35} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                          />
                          <Area type="monotone" dataKey="point" name="Điểm" stroke="#6366f1" strokeWidth={3} fill="url(#colorPoint)" dot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* History List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">Lịch sử hành vi chi tiết</h3>
                  {loadingHistory ? (
                    <div className="text-center py-8 text-slate-400">Đang tải lịch sử...</div>
                  ) : historyData.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                      Chưa có ghi nhận hành vi nào
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {historyData.map((log: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{log.behaviorName || 'Hành vi'}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 rounded text-slate-600 font-bold uppercase tracking-tight">
                                {log.lessonName || 'Tiết học'}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(log.occurredAt).toLocaleString('vi-VN')}
                              </span>
                            </div>
                          </div>
                          <span className={clsx(
                            "font-black text-xl",
                            log.pointValue > 0 ? "text-emerald-600" : log.pointValue < 0 ? "text-red-600" : "text-slate-600"
                          )}>
                            {log.pointValue > 0 ? '+' : ''}{log.pointValue}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
