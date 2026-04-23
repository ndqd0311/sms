"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Edit2, Trash2, X, Users, Briefcase } from 'lucide-react';

export default function StudentsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Student Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: 0, name: '', dob: '' });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/teaching-context');
        const contexts = res.data.teachingContexts || res.data || [];

        // Extract unique classes
        const uniqueClassesMap = new Map();
        contexts.forEach((c: any) => {
          if (!uniqueClassesMap.has(c.classId)) {
            uniqueClassesMap.set(c.classId, {
              classId: c.classId,
              className: c.className || 'Lớp chưa đặt tên',
              defaultContextId: c.id
            });
          }
        });

        const uniqueClasses = Array.from(uniqueClassesMap.values());
        setClasses(uniqueClasses);

        if (uniqueClasses.length > 0) {
          handleSelectClass(uniqueClasses[0]);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSelectClass = async (cls: any) => {
    setSelectedClass(cls);
    setLoading(true);
    try {
      const res = await api.get(`/student/class/${cls.classId}`);
      setStudents(res.data.students || res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (student?: any) => {
    if (student) {
      setForm({
        id: student.id,
        name: student.fullName || student.name,
        dob: student.birthday ? new Date(student.birthday).toISOString().split('T')[0] : ''
      });
    } else {
      setForm({ id: 0, name: '', dob: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    try {
      if (form.id === 0) {
        let shortName = form.name.split(' ').slice(-2).join(' ');
        if (!shortName) shortName = form.name;

        const res = await api.post('/student', {
          ClassId: selectedClass.classId,
          FullName: form.name,
          DisplayName: shortName,
          BirthDay: form.dob ? new Date(form.dob).toISOString() : null,
          TeachingContextId: selectedClass.defaultContextId,
          OrdinalIndex: -1 // Unseated
        });
        setStudents([...students, { id: res.data, classId: selectedClass.classId, fullName: form.name, birthday: form.dob }]);
      } else {
        await api.put('/student', {
          StudentId: form.id,
          ClassId: selectedClass.classId,
          FullName: form.name,
          BirthDay: form.dob ? new Date(form.dob).toISOString() : null,
        });
        setStudents(students.map(s => s.id === form.id ? { ...s, fullName: form.name, birthday: form.dob } : s));
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.title || 'Lỗi khi lưu học sinh.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa học sinh này có thể ảnh hưởng đến lịch sử học tập. Bạn chắc chắn chứ?')) return;
    try {
      await api.delete(`/student/${id}`);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      alert('Không thể xóa học sinh này.');
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar chọn lớp */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Briefcase size={16} /> Chọn Lớp Học
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {classes.length === 0 && !loading && (
            <p className="text-sm text-slate-500 text-center py-4">Chưa có lớp nào được tạo.</p>
          )}
          {classes.map(cls => (
            <button
              key={cls.classId}
              onClick={() => handleSelectClass(cls)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold ${selectedClass?.classId === cls.classId ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
            >
              {cls.className}
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung danh sách học sinh */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedClass ? (
          <>
            <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Học sinh lớp {selectedClass.className}</h1>
                <p className="text-sm font-medium text-slate-500">Quản lý toàn bộ danh sách học sinh tham gia lớp.</p>
              </div>
              <button
                onClick={() => openModal()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Plus size={18} /> Thêm Học Sinh Mới
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="p-12 text-center text-slate-500 font-medium">Đang tải dữ liệu...</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                      <tr>
                        <th className="px-6 py-4 font-bold">Họ và Tên đầy đủ</th>
                        <th className="px-6 py-4 font-bold">Ngày sinh</th>
                        <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-800 font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                              {s.fullName?.[0] || '?'}
                            </div>
                            {s.fullName || 'Chưa cập nhật'}
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">
                            {s.birthday ? new Date(s.birthday).toLocaleDateString('vi-VN') : '---'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => openModal(s)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                            Lớp học hiện tại chưa có học sinh nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            {classes.length > 0 ? 'Vui lòng chọn một lớp học bên trái' : 'Chưa có dữ liệu lớp học'}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {form.id === 0 ? 'Thêm học sinh' : 'Cập nhật học sinh'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Họ và Tên đầy đủ</label>
                <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ngày sinh</label>
                <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 font-medium" />
              </div>
              <div className="pt-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
