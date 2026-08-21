
import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { db, DB_KEYS } from '../services/db';

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState({ name: '', coefficient: 1 });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setSubjects(db.get(DB_KEYS.SUBJECTS, []));
  }, []);

  const saveSubjects = (newList: Subject[]) => {
    setSubjects(newList);
    db.set(DB_KEYS.SUBJECTS, newList);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingId) {
      saveSubjects(subjects.map(s => s.id === editingId ? { ...s, ...form } : s));
      setEditingId(null);
    } else {
      saveSubjects([...subjects, { id: crypto.randomUUID(), ...form }]);
    }
    setForm({ name: '', coefficient: 1 });
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
      <div className="border-r-8 border-indigo-600 pr-4">
        <h2 className="text-3xl font-black text-gray-800">إدارة المواد الدراسية</h2>
        <p className="text-gray-500 font-bold">تحديد قائمة المواد والمعاملات المعتمدة</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-indigo-50/50 p-6 rounded-3xl">
        <div className="space-y-1">
          <label className="text-xs font-black text-indigo-600 mr-2">اسم المادة</label>
          <input 
            placeholder="مثال: الرياضيات" 
            value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="w-full p-4 rounded-2xl border-2 border-white focus:border-indigo-500 outline-none font-black shadow-sm" required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-indigo-600 mr-2">المعامل</label>
          <input 
            type="number" min="1" max="10"
            value={form.coefficient} onChange={e => setForm({...form, coefficient: parseInt(e.target.value) || 1})}
            className="w-full p-4 rounded-2xl border-2 border-white focus:border-indigo-500 outline-none font-black shadow-sm" required
          />
        </div>
        <button className="bg-indigo-600 text-white p-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95 h-[60px]">
          {editingId ? 'تحديث المادة' : 'إضافة مادة جديدة +'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map(s => (
          <div key={s.id} className="p-6 bg-white border-2 border-gray-50 rounded-[2rem] shadow-sm flex flex-col justify-between items-center group hover:border-indigo-200 transition-all hover:shadow-lg">
            <div className="text-center mb-4">
               <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-3 mx-auto">📚</div>
               <span className="block font-black text-gray-800 text-lg">{s.name}</span>
               <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">المعامل: {s.coefficient}</span>
            </div>
            <div className="flex gap-2 w-full pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({name: s.name, coefficient: s.coefficient}); setEditingId(s.id); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all">تعديل</button>
              <button onClick={() => { if(confirm('حذف المادة؟')) saveSubjects(subjects.filter(item => item.id !== s.id)); }} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all">حذف</button>
            </div>
          </div>
        ))}
        {subjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-300 font-bold italic">لا توجد مواد مسجلة حالياً</div>
        )}
      </div>
    </div>
  );
};

export default SubjectManagement;
