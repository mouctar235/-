
import React, { useState, useEffect } from 'react';
import { Classroom } from '../types';
import { db, DB_KEYS } from '../services/db';

const ClassroomManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [form, setForm] = useState({ name: '', grade: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setClassrooms(db.get(DB_KEYS.CLASSROOMS, []));
  }, []);

  const save = (list: Classroom[]) => {
    setClassrooms(list);
    db.set(DB_KEYS.CLASSROOMS, list);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.grade) return;

    if (editingId) {
      save(classrooms.map(c => c.id === editingId ? { ...c, ...form } : c));
      setEditingId(null);
    } else {
      save([...classrooms, { ...form, id: crypto.randomUUID() }]);
    }
    setForm({ name: '', grade: '' });
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
      <div className="border-r-8 border-orange-500 pr-4">
        <h2 className="text-3xl font-black text-gray-800">الهيكل التربوي (الفصول)</h2>
        <p className="text-gray-500 font-bold">تنظيم الأقسام والمستويات الدراسية للمؤسسة</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-orange-50/50 p-6 rounded-3xl">
        <div className="space-y-1">
          <label className="text-xs font-black text-orange-600 mr-2">المستوى الدراسي</label>
          <input 
            placeholder="مثال: أولى متوسط" 
            value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} 
            className="w-full p-4 rounded-2xl border-2 border-white focus:border-orange-500 outline-none font-black shadow-sm" required 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-orange-600 mr-2">اسم القسم</label>
          <input 
            placeholder="مثال: فوج 1" 
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
            className="w-full p-4 rounded-2xl border-2 border-white focus:border-orange-500 outline-none font-black shadow-sm" required 
          />
        </div>
        <button className="bg-orange-600 text-white p-4 rounded-2xl font-black shadow-xl hover:bg-orange-700 transition-all active:scale-95 h-[60px]">
          {editingId ? 'تحديث القسم' : 'إضافة قسم جديد +'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map(c => (
          <div key={c.id} className="p-6 bg-white border-2 border-gray-50 rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🏢</div>
              <div>
                <p className="font-black text-gray-800 text-lg">{c.name}</p>
                <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">{c.grade}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({name: c.name, grade: c.grade}); setEditingId(c.id); }} className="text-blue-500 p-2 hover:bg-blue-50 rounded-xl">✏️</button>
              <button onClick={() => { if(confirm('حذف هذا القسم؟')) save(classrooms.filter(x => x.id !== c.id)); }} className="text-red-500 p-2 hover:bg-red-50 rounded-xl">🗑️</button>
            </div>
          </div>
        ))}
        {classrooms.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-300 font-bold italic">لا توجد فصول مسجلة حالياً</div>
        )}
      </div>
    </div>
  );
};

export default ClassroomManagement;
