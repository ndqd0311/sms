"use client";

import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { StudentNode } from '@/components/seating/StudentNode';
import { AlertCircle, Save, Plus, Play, Square, Settings, X, Edit2, Trash2, TrendingUp, History, Copy, ChevronLeft } from 'lucide-react';
import { ClassHistoryModal } from '@/components/statistics/ClassHistoryModal';
import api from '@/lib/api';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { StudentStatisticsModal } from '@/components/statistics/StudentStatisticsModal';

export default function SeatingPage() {
  const params = useParams();
  const contextId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Lesson state
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  // Unsaved changes warning
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSeat, setCurrentSeat] = useState<any>(null);
  const [studentForm, setStudentForm] = useState({ id: 0, displayName: '', name: '', dateOfBirth: '' });
  const [addMode, setAddMode] = useState<'new' | 'existing'>('new');
  const [selectedExistingStudentId, setSelectedExistingStudentId] = useState('');

  // Statistics Modal state
  const [viewingStatsStudent, setViewingStatsStudent] = useState<any>(null);
  const [showClassHistory, setShowClassHistory] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Behavior states
  const [behaviors, setBehaviors] = useState<any[]>([]);
  const [isBehaviorModalOpen, setIsBehaviorModalOpen] = useState(false);
  const [studentForBehavior, setStudentForBehavior] = useState<any>(null);

  const fetchContext = async () => {
    try {
      const resSettings = await api.get(`/teaching-context`);
      const currentCtx = resSettings.data.teachingContexts.find((x: any) => x.id === parseInt(contextId));
      if (currentCtx) {
        setConfig(currentCtx);
      }

      const resSeats = await api.get(`/seat/${contextId}`);
      const apiSeats = resSeats.data.seatAssignments || resSeats.data || [];

      const totalSeats = currentCtx.numCols * currentCtx.numRows * currentCtx.seatsPerTable;
      const generatedSeats = Array.from({ length: totalSeats }, (_, i) => {
        const matching = apiSeats.find((s: any) => s.ordinalIndex === i);
        return matching ? { ...matching, id: matching.id || `seat-${i}` } : { id: `empty-${i}`, ordinalIndex: i, studentId: null };
      });
      setSeats(generatedSeats);

      let studentsData = [];
      if (currentCtx?.classId) {
        const resStudents = await api.get(`/student/class/${currentCtx.classId}`);
        studentsData = resStudents.data.students || resStudents.data || [];
        setStudents(studentsData);
      }

      // Khởi tạo điểm cho từng học sinh = 0 (Chưa fetch từ db vì API get class / get context chưa có lesson points realtime)
      // Mặc định `points` field không tồn tại, sẽ được update local

      // Load Hành vi
      const behaviorRes = await api.get('/behavior-category');
      setBehaviors(behaviorRes.data.behaviorCategories || behaviorRes.data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contextId) fetchContext();
  }, [contextId]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const sourceId = active.id.toString().replace('drag-', '');
    const destId = over.id.toString().replace('drop-', '');

    if (sourceId === destId) return;

    setSeats((prev) => {
      const newSeats = [...prev];
      const sourceIndex = newSeats.findIndex(s => s.id.toString() === sourceId);
      const destIndex = newSeats.findIndex(s => s.id.toString() === destId);

      if (sourceIndex > -1 && destIndex > -1) {
        // Swap studentId AND displayName together — the displayName belongs to the student, not the seat
        const tempStudentId = newSeats[sourceIndex].studentId;
        const tempDisplayName = newSeats[sourceIndex].displayName;
        newSeats[sourceIndex] = { ...newSeats[sourceIndex], studentId: newSeats[destIndex].studentId, displayName: newSeats[destIndex].displayName };
        newSeats[destIndex] = { ...newSeats[destIndex], studentId: tempStudentId, displayName: tempDisplayName };
        setHasUnsavedChanges(true);
      }
      return newSeats;
    });
  };

  const handleSave = async () => {
    try {
      const seatPayload = seats.filter(s => s.studentId).map(s => ({
        StudentId: s.studentId,
        OrdinalIndex: s.ordinalIndex,
        DisplayName: s.displayName || null
      }));
      await api.put('/seat', { TeachingContextId: parseInt(contextId), Seats: seatPayload });
      setHasUnsavedChanges(false);
      alert('Đã lưu cấu hình sơ đồ!');
    } catch (e) {
      alert('Lỗi lưu sơ đồ!');
    }
  };

  const startLesson = async () => {
    try {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const buoi = hour < 12 ? 'Sáng' : hour < 18 ? 'Chiều' : 'Tối';
      const timeStr = `${hour}h${minute > 0 ? String(minute).padStart(2, '0') : ''}`;
      const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      const lessonName = `${buoi}-${timeStr}-${dateStr}`;

      const res = await api.post('/lessons/start', { teachingContextId: parseInt(contextId), name: lessonName });
      setActiveLessonId(res.data);
    } catch (e) {
      alert('Không thể bắt đầu tiết học. Có thể do lỗi API.');
    }
  };

  const endLesson = async () => {
    if (!activeLessonId) return;
    try {
      await api.put(`/lessons/${activeLessonId}/end`);
      setActiveLessonId(null);
    } catch (e) {
      alert('Không thể kết thúc tiết học');
    }
  };

  const openStudentModal = (seat: any, existingStudent?: any) => {
    if (activeLessonId) {
      if (!existingStudent) {
        alert("Bàn trống, không thể ghi nhận hành vi.");
        return;
      }
      setStudentForBehavior(existingStudent);
      setIsBehaviorModalOpen(true);
      return;
    }
    setCurrentSeat(seat);
    setAddMode('new');
    setSelectedExistingStudentId('');
    if (existingStudent) {
      setStudentForm({
        id: existingStudent.id,
        displayName: existingStudent.displayName || '',
        name: existingStudent.fullName || existingStudent.name || '',
        dateOfBirth: existingStudent.birthday || existingStudent.dateOfBirth ? new Date(existingStudent.birthday || existingStudent.dateOfBirth).toISOString().split('T')[0] : ''
      });
    } else {
      setStudentForm({ id: 0, displayName: '', name: '', dateOfBirth: '' });
    }
    setIsModalOpen(true);
  };

  const submitStudentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      if (studentForm.id === 0) {
        if (addMode === 'new') {
          let shortName = studentForm.displayName;
          if (!shortName) {
            shortName = studentForm.name.split(' ').slice(-2).join(' ');
            if (!shortName) shortName = studentForm.name;
          }

          const res = await api.post('/student', {
            ClassId: config.classId,
            FullName: studentForm.name,
            DisplayName: shortName,
            BirthDay: studentForm.dateOfBirth ? new Date(studentForm.dateOfBirth).toISOString() : null,
            TeachingContextId: parseInt(contextId),
            OrdinalIndex: currentSeat.ordinalIndex
          });

          const newStudentId = res.data;
          const newStudent = { id: newStudentId, classId: config.classId, fullName: studentForm.name, birthday: studentForm.dateOfBirth };
          setStudents([...students, newStudent]);

          // Map to seat locally
          setSeats(seats.map(s => s.id === currentSeat.id ? { ...s, studentId: newStudentId } : s));
          setHasUnsavedChanges(true); // Yêu cầu lưu lại sơ đồ vì đã local
        } else if (addMode === 'existing') {
          const sid = parseInt(selectedExistingStudentId);
          setSeats(seats.map(s => s.id === currentSeat.id ? { ...s, studentId: sid } : s));
          setHasUnsavedChanges(true);
        }
      } else {
        // Update existing student's profile
        const newDisplayName = studentForm.displayName || studentForm.name.split(' ').slice(-2).join(' ') || studentForm.name;
        await api.put('/student', {
          StudentId: studentForm.id,
          ClassId: config.classId,
          FullName: studentForm.name,
          DisplayName: newDisplayName,
          BirthDay: studentForm.dateOfBirth ? new Date(studentForm.dateOfBirth).toISOString() : null,
        });
        // Update student in list
        setStudents(students.map(s => s.id === studentForm.id ? { ...s, fullName: studentForm.name, birthday: studentForm.dateOfBirth } : s));
        // Update displayName in the seat that holds this student
        setSeats(seats.map(s => s.studentId === studentForm.id ? { ...s, displayName: newDisplayName } : s));
        setHasUnsavedChanges(true);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.title || 'Lỗi khi lưu học sinh. Kiểm tra kết nối.');
    }
  };

  const handleDeleteStudent = async () => {
    if (!confirm('Bạn có chắc muốn xóa học sinh này khỏi hệ thống?')) return;
    try {
      await api.delete(`/student/${studentForm.id}`);
      setStudents(students.filter(s => s.id !== studentForm.id));
      setSeats(seats.map(s => s.studentId === studentForm.id ? { ...s, studentId: null, displayName: '' } : s));
      setHasUnsavedChanges(true);
      setIsModalOpen(false);
    } catch (err) {
      alert('Lỗi xóa học sinh');
    }
  };

  const handleLogBehavior = async (behaviorId: number, pointValue: number) => {
    if (!activeLessonId || !studentForBehavior) return;
    try {
      await api.post('/behavior-logs', {
        LessonId: activeLessonId,
        StudentId: studentForBehavior.id,
        BehaviorCategoryId: behaviorId
      });

      // Update local points
      setStudents(students.map(s => {
        if (s.id === studentForBehavior.id) {
          return { ...s, points: (s.points || 0) + pointValue };
        }
        return s;
      }));

      setIsBehaviorModalOpen(false);
      setStudentForBehavior(null);
    } catch (err: any) {
      alert(err.response?.data?.title || 'Không thể ghi nhận hành vi.');
    }
  };

  if (loading) return <div className="text-slate-500 p-12">Đang tải...</div>;
  if (!config) return <div className="text-slate-500 p-12">Không tìm thấy bối cảnh/lớp học.</div>;

  const gridTemplateColumns = `repeat(${config.numCols}, minmax(0, 1fr))`;

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-800 relative">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
            title="Quay lại"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{config.contextName || config.className}</h1>
            <p className="text-xs text-slate-500">Sơ đồ ngồi: {config.numCols} Cột x {config.numRows} Hàng</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-sm font-medium text-amber-600 mr-2 flex items-center gap-1">
              <AlertCircle size={14} /> Chưa lưu
            </span>
          )}

          <button
            type="button"
            onClick={() => openStudentModal({ id: `unseated--1`, ordinalIndex: -1, studentId: null })}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Thêm Học Sinh
          </button>

          <button
            onClick={activeLessonId ? endLesson : startLesson}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors",
              activeLessonId ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
            )}
          >
            {activeLessonId ? <><Square size={16} /> Kết thúc tiết học</> : <><Play size={16} fill="currentColor" /> Bắt đầu tiết học</>}
          </button>

          {/* L&#7883;ch s&#7917; h&#224;nh vi c&#7843; l&#7899;p */}
          <button
            type="button"
            onClick={() => setShowClassHistory(true)}
            className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <History size={16} /> L&#7883;ch s&#7917; L&#7899;p
          </button>

          <button
            type="button"
            onClick={async () => {
              try {
                const res = await api.post('/share-code', { TeachingContextId: parseInt(contextId) });
                const code = res.data;
                await navigator.clipboard.writeText(code);
                alert(`Mã chia sẻ: ${code}\n\n(Đã sao chép vào clipboard!)`);
              } catch {
                alert('Không thể tạo mã chia sẻ.');
              }
            }}
            className="px-4 py-2 bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Copy size={16} /> Chia sẻ lớp
          </button>

          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
          >
            <Save size={16} /> Lưu Sơ đồ
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 relative">
        <div className="mb-12 bg-white h-10 w-2/3 mx-auto flex items-center justify-center rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-500">
          Khu vực Bảng / Giáo viên
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="grid gap-6 mx-auto w-fit"
            style={{ gridTemplateColumns }}
          >
            {Array.from({ length: config.numCols * config.numRows }).map((_, tableIndex) => (
              <div key={tableIndex} className={`bg-slate-200/50 rounded-2xl p-2 flex ${config.seatsPerTable > 1 ? 'gap-2 flex-wrap justify-center border-2 border-slate-300 border-dashed' : ''}`}>
                {Array.from({ length: config.seatsPerTable }).map((_, seatIdx) => {
                  const seatOrdinal = tableIndex * config.seatsPerTable + seatIdx;
                  const seat = seats[seatOrdinal];
                  if (!seat) return null;

                  const studentData = students.find(s => s.id === seat.studentId);
                  const effectiveStudent = studentData ? { ...studentData, displayName: seat.displayName } : null;

                  return (
                    <div key={seat.id} className="flex-1 min-w-[80px]">
                      <StudentNode
                        id={seat.id.toString()}
                        student={effectiveStudent}
                        onClick={() => openStudentModal(seat, effectiveStudent)}
                        onRemove={!activeLessonId ? () => {
                          setSeats(seats.map(s => s.id === seat.id ? { ...s, studentId: null, displayName: '' } : s));
                          setHasUnsavedChanges(true);
                        } : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </DndContext>
      </div>

      {/* Modal Cập nhật Học Sinh */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {studentForm.id === 0 ? 'Thêm học sinh vào Bàn' : 'Cập nhật học sinh'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitStudentForm} className="p-6 space-y-4">
              {studentForm.id === 0 && currentSeat?.ordinalIndex !== -1 && (
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                  <button type="button" onClick={() => setAddMode('new')} className={clsx("flex-1 py-1.5 text-sm font-bold rounded-md transition-all", addMode === 'new' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700')}>Tạo Mới</button>
                  <button type="button" onClick={() => setAddMode('existing')} className={clsx("flex-1 py-1.5 text-sm font-bold rounded-md transition-all", addMode === 'existing' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700')}>Chọn Đã Có</button>
                </div>
              )}

              {addMode === 'existing' && studentForm.id === 0 && currentSeat?.ordinalIndex !== -1 ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Chọn học sinh trong lớp</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={selectedExistingStudentId}
                    onChange={e => setSelectedExistingStudentId(e.target.value)}
                  >
                    <option value="">-- Chọn học sinh chưa có bàn --</option>
                    {students.filter(s => !seats.some(seat => seat.studentId === s.id)).map(s => (
                      <option key={s.id} value={s.id}>{s.fullName || s.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Họ và Tên đầy đủ</label>
                    <input required type="text" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                  </div>
                  {(addMode === 'new' || studentForm.id > 0) && (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tên Hiển Thị (Tùy chọn)</label>
                        <input
                          type="text"
                          value={studentForm.displayName || ''}
                          onChange={e => setStudentForm({ ...studentForm, displayName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Ví dụ: Cường Lê"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh</label>
                        <input
                          type="date"
                          value={studentForm.dateOfBirth}
                          onChange={e => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="flex flex-col gap-2 w-full">
                {studentForm.id > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setViewingStatsStudent(studentForm)}
                      className="px-3 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-lg flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={16} /> Thống kê & Lịch sử
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSeats(seats.map(s => s.id === currentSeat.id ? { ...s, studentId: null, displayName: '' } : s));
                        setHasUnsavedChanges(true);
                        setIsModalOpen(false);
                      }}
                      className="px-3 py-2 text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 hover:bg-amber-100 rounded-lg"
                    >
                      Xóa khỏi lớp
                    </button>
                    <button type="button" onClick={handleDeleteStudent} className="px-3 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg">
                      Xóa vĩnh viễn
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-lg flex-1">
                  Hủy
                </button>
                <button type="submit" disabled={addMode === 'existing' && studentForm.id === 0 && !selectedExistingStudentId} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex-1">
                  Lưu
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Chọn Hành Vi */}
      {isBehaviorModalOpen && studentForBehavior && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => { setIsBehaviorModalOpen(false); setStudentForBehavior(null); }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                Ghi nhận hành vi: <span className="text-indigo-600">{studentForBehavior.fullName || studentForBehavior.name}</span>
              </h2>
              <button type="button" onClick={() => { setIsBehaviorModalOpen(false); setStudentForBehavior(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] bg-slate-50">
              {behaviors.length === 0 ? (
                <div className="text-center text-slate-500 py-8">Chưa có danh mục hành vi nào. Vui lòng thêm trong Cài đặt Hành vi.</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {behaviors.map(b => (
                    <button
                      key={b.id}
                      onClick={() => handleLogBehavior(b.id, b.pointValue)}
                      className={clsx(
                        "p-4 rounded-xl border text-left flex flex-col gap-2 transition-all hover:shadow-md",
                        b.pointValue > 0 ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400" :
                          b.pointValue < 0 ? "bg-red-50 border-red-200 hover:border-red-400" : "bg-white border-slate-200 hover:border-slate-400"
                      )}
                    >
                      <span className="font-bold text-slate-800 line-clamp-2 leading-tight">{b.name}</span>
                      <span className={clsx(
                        "text-sm font-black",
                        b.pointValue > 0 ? "text-emerald-600" :
                          b.pointValue < 0 ? "text-red-600" : "text-slate-500"
                      )}>
                        {b.pointValue > 0 ? '+' : ''}{b.pointValue} điểm
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => { setIsBehaviorModalOpen(false); setStudentForBehavior(null); }}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thống Kê & Lịch Sử Cá Nhân */}
      {viewingStatsStudent && (
        <StudentStatisticsModal
          student={viewingStatsStudent}
          classId={config?.classId}
          contextId={contextId}
          lessonId={activeLessonId || undefined}
          onClose={() => setViewingStatsStudent(null)}
        />
      )}

      {/* Modal Lịch sử hành vi Cả Lớp */}
      {showClassHistory && (
        <ClassHistoryModal
          contextId={contextId}
          lessonId={activeLessonId || undefined}
          onClose={() => setShowClassHistory(false)}
        />
      )}

    </div>
  );
}
