
import React, { useState, useEffect } from 'react';
import { Student, Classroom } from '../types';
import { db, DB_KEYS } from '../services/db';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassId, setFilterClassId] = useState('');
  
  const [form, setForm] = useState<Partial<Student>>({
    lastName: '', firstName: '', gender: 'ذكر', birthDate: '',
    isRepeater: false, classroomId: '', status: 'خارجي',
    parentPhone: '', notes: '', photo: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setStudents(db.get(DB_KEYS.STUDENTS, []));
    setClassrooms(db.get(DB_KEYS.CLASSROOMS, []));
  }, []);

  const saveStudents = (newList: Student[]) => {
    setStudents(newList);
    db.set(DB_KEYS.STUDENTS, newList);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 500 كيلوبايت");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lastName || !form.firstName || !form.classroomId) {
      alert("يرجى إدخال الاسم واللقب واختيار القسم");
      return;
    }

    const selectedClass = classrooms.find(c => c.id === form.classroomId);
    const finalData = {
      ...form,
      grade: selectedClass?.grade || '',
      group: selectedClass?.name || ''
    } as Student;

    if (editingId) {
      saveStudents(students.map(s => s.id === editingId ? { ...s, ...finalData } : s));
      setEditingId(null);
    } else {
      const newStudent: Student = {
        ...finalData,
        id: "ST" + Date.now().toString().slice(-6),
      };
      saveStudents([...students, newStudent]);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({ lastName: '', firstName: '', gender: 'ذكر', birthDate: '', isRepeater: false, classroomId: '', status: 'خارجي', parentPhone: '', notes: '', photo: '' });
    setEditingId(null);
  };

  const filteredStudents = students.filter(s => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClassId || s.classroomId === filterClassId;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-800 border-r-8 border-blue-600 pr-4 mb-8">
          {editingId ? 'تعديل بيانات تلميذ' : 'تسجيل متمدرس جديد'}
        </h2>
        
        <form onSubmit={handleAddOrUpdate} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-blue-50 transition-all group">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 shadow-inner mb-4">
              {form.photo ? (
                <img src={form.photo} className="w-full h-full object-cover" alt="S" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
              )}
            </div>
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-blue-700 transition-all">
              رفع الصورة الشخصية
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {form.photo && (
              <button type="button" onClick={() => setForm(p => ({...p, photo: ''}))} className="text-red-500 text-[10px] mt-2 font-bold underline">حذف الصورة</button>
            )}
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 mr-2">اللقب</label>
              <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold" placeholder="اللقب العائلي" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 mr-2">الاسم</label>
              <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold" placeholder="الاسم الشخصي" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 mr-2">القسم الدراسي</label>
              <select value={form.classroomId} onChange={e => setForm({...form, classroomId: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold">
                <option value="">-- اختر القسم --</option>
                {classrooms.map(c => <option key={c.id} value={c.id}>{c.grade} - {c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 mr-2">تاريخ الميلاد</label>
              <input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 outline-none font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 mr-2">الجنس</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value as any})} className="w-full p-3 rounded-xl border-2 border-gray-100 outline-none font-bold">
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 mr-2">هاتف الولي</label>
              <input value={form.parentPhone} onChange={e => setForm({...form, parentPhone: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 outline-none font-bold" placeholder="رقم للتواصل" />
            </div>
          </div>

          <div className="md:col-span-4 flex gap-4 pt-4 border-t">
            <button type="submit" className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
              {editingId ? 'تحديث بيانات التلميذ' : 'تأكيد التسجيل'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all">
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 w-full relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              placeholder="بحث بالاسم أو رقم القيد..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 outline-none font-bold shadow-sm" 
            />
          </div>
          <select 
            value={filterClassId} 
            onChange={e => setFilterClassId(e.target.value)} 
            className="w-full md:w-64 p-4 rounded-2xl border-2 border-gray-200 outline-none font-black text-blue-600 shadow-sm"
          >
            <option value="">جميع الأقسام</option>
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-5 font-black text-sm">التلميذ</th>
                <th className="p-5 font-black text-sm">رقم القيد</th>
                <th className="p-5 font-black text-sm">القسم</th>
                <th className="p-5 font-black text-sm">المستوى</th>
                <th className="p-5 font-black text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-gray-400 italic font-bold">لا يوجد تلاميذ مطابقين للبحث</td></tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border">
                        {s.photo ? (
                          <img src={s.photo} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-gray-800">{s.lastName} {s.firstName}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{s.gender} • {s.birthDate}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-black text-blue-600 text-sm">{s.id}</td>
                    <td className="p-4 font-bold text-gray-600">{s.group}</td>
                    <td className="p-4">
                       <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black">{s.grade}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingId(s.id); setForm(s); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">✏️</button>
                        <button onClick={() => { if(confirm('حذف هذا التلميذ نهائياً؟')) saveStudents(students.filter(x => x.id !== s.id)); }} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
