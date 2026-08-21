
import React, { useState, useEffect } from 'react';
import { Teacher, Subject, Classroom } from '../types';
import { db, DB_KEYS } from '../services/db';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    subjectIds: [] as string[], 
    classroomIds: [] as string[] 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setTeachers(db.get(DB_KEYS.TEACHERS, []));
    setSubjects(db.get(DB_KEYS.SUBJECTS, []));
    setClassrooms(db.get(DB_KEYS.CLASSROOMS, []));
  }, []);

  const saveTeachers = (newList: Teacher[]) => {
    setTeachers(newList);
    db.set(DB_KEYS.TEACHERS, newList);
  };

  const handleToggleSubject = (id: string) => {
    setForm(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id) 
        ? prev.subjectIds.filter(x => x !== id) 
        : [...prev.subjectIds, id]
    }));
  };

  const handleToggleClassroom = (id: string) => {
    setForm(prev => ({
      ...prev,
      classroomIds: prev.classroomIds.includes(id) 
        ? prev.classroomIds.filter(x => x !== id) 
        : [...prev.classroomIds, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingId) {
      saveTeachers(teachers.map(t => t.id === editingId ? { ...t, ...form } : t));
    } else {
      saveTeachers([...teachers, { ...form, id: crypto.randomUUID() }]);
    }
    setForm({ name: '', phone: '', subjectIds: [], classroomIds: [] });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 border-r-4 border-indigo-600 pr-4 mb-6">إدارة الطاقم التعليمي</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 mr-2">اسم الأستاذ</label>
              <input 
                placeholder="اسم الأستاذ الكامل" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 mr-2">رقم الهاتف</label>
              <input 
                placeholder="رقم الهاتف للتواصل" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
                className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="font-bold text-indigo-600 text-sm">المواد المسندة:</p>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <button
                    key={s.id} 
                    type="button" 
                    onClick={() => handleToggleSubject(s.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      form.subjectIds.includes(s.id) ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {s.name} (معامل {s.coefficient})
                  </button>
                ))}
                {subjects.length === 0 && <p className="text-xs text-gray-400 italic">يرجى إضافة مواد أولاً</p>}
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-orange-600 text-sm">الأقسام المسندة:</p>
              <div className="flex flex-wrap gap-2">
                {classrooms.map(c => (
                  <button
                    key={c.id} 
                    type="button" 
                    onClick={() => handleToggleClassroom(c.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      form.classroomIds.includes(c.id) ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c.grade} - {c.name}
                  </button>
                ))}
                {classrooms.length === 0 && <p className="text-xs text-gray-400 italic">يرجى إضافة أقسام أولاً</p>}
              </div>
            </div>
          </div>

          <button className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 active:scale-[0.99] transition-all">
            {editingId ? 'تحديث بيانات الأستاذ' : 'حفظ بيانات الأستاذ'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-[2rem] border-2 border-transparent hover:border-indigo-100 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">👨‍🏫</div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { 
                    setEditingId(t.id); 
                    setForm({ 
                      name: t.name, 
                      phone: t.phone, 
                      subjectIds: t.subjectIds || [], 
                      classroomIds: t.classroomIds || [] 
                    }); 
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => {
                    if (confirm('هل أنت متأكد من حذف هذا الأستاذ؟')) {
                      saveTeachers(teachers.filter(x => x.id !== t.id));
                    }
                  }} 
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-gray-800 mb-1">{t.name}</h3>
            <p className="text-gray-400 text-xs mb-4 font-mono font-bold tracking-wider">{t.phone || 'بدون رقم هاتف'}</p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-400 uppercase">المواد</p>
                <div className="flex flex-wrap gap-1">
                  {t.subjectIds?.length > 0 ? t.subjectIds.map(sid => {
                    const s = subjects.find(x => x.id === sid);
                    return <span key={sid} className="px-2 py-1 bg-indigo-50 rounded-lg text-[9px] font-black text-indigo-600 border border-indigo-100">{s?.name || 'مادة محذوفة'}</span>;
                  }) : <span className="text-[9px] text-gray-300 italic">لا توجد مواد</span>}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-orange-400 uppercase">الأقسام</p>
                <div className="flex flex-wrap gap-1">
                  {t.classroomIds?.length > 0 ? t.classroomIds.map(cid => {
                    const c = classrooms.find(x => x.id === cid);
                    return <span key={cid} className="px-2 py-1 bg-orange-50 rounded-lg text-[9px] font-black text-orange-600 border border-orange-100">{c ? `${c.grade} - ${c.name}` : 'قسم محذوف'}</span>;
                  }) : <span className="text-[9px] text-gray-300 italic">لا توجد أقسام</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        {teachers.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-300 font-bold italic">لا يوجد أساتذة مسجلين حالياً</div>
        )}
      </div>
    </div>
  );
};

export default TeacherManagement;
