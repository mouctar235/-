
import React, { useState, useEffect } from 'react';
import { Exam, Subject, Student, Mark } from '../types';
import { db, DB_KEYS } from '../services/db';
import { Icons } from '../constants';

const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  
  const [examForm, setExamForm] = useState<Partial<Exam>>({
    subjectId: '',
    date: new Date().toISOString().split('T')[0],
    grade: ''
  });
  
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [marksEntry, setMarksEntry] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setExams(db.get(DB_KEYS.EXAMS, []));
    setSubjects(db.get(DB_KEYS.SUBJECTS, []));
    setStudents(db.get(DB_KEYS.STUDENTS, []));
    setMarks(db.get(DB_KEYS.MARKS, []));
  }, []);

  const saveExams = (newList: Exam[]) => {
    setExams(newList);
    db.set(DB_KEYS.EXAMS, newList);
  };

  const validateExam = () => {
    const newErrors: Record<string, string> = {};
    if (!examForm.subjectId) newErrors.subject = 'يرجى اختيار المادة';
    if (!examForm.grade?.trim()) newErrors.grade = 'المستوى مطلوب';
    if (!examForm.date) newErrors.date = 'التاريخ مطلوب';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateExam()) return;

    const newExam: Exam = {
      id: crypto.randomUUID(),
      subjectId: examForm.subjectId!,
      date: examForm.date!,
      grade: examForm.grade!
    };
    saveExams([...exams, newExam]);
    setExamForm({ subjectId: '', date: new Date().toISOString().split('T')[0], grade: '' });
    setErrors({});
  };

  const deleteExam = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟ سيتم حذف جميع النقاط المرتبطة به.')) {
      const filteredExams = exams.filter(e => e.id !== id);
      const filteredMarks = marks.filter(m => m.examId !== id);
      saveExams(filteredExams);
      setMarks(filteredMarks);
      db.set(DB_KEYS.MARKS, filteredMarks);
      if (activeExamId === id) setActiveExamId(null);
    }
  };

  const startMarksEntry = (exam: Exam) => {
    setActiveExamId(exam.id);
    const examMarks = marks.filter(m => m.examId === exam.id);
    const entryObj: Record<string, number> = {};
    examMarks.forEach(m => {
      entryObj[m.studentId] = m.value;
    });
    setMarksEntry(entryObj);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleMarkChange = (studentId: string, value: string) => {
    const val = parseFloat(value);
    setMarksEntry(prev => ({ ...prev, [studentId]: isNaN(val) ? 0 : val }));
  };

  const saveMarks = () => {
    if (!activeExamId) return;
    
    // Remove old marks for this exam
    let updatedMarks = marks.filter(m => m.examId !== activeExamId);
    
    // Add new marks
    const newMarksBatch: Mark[] = Object.entries(marksEntry).map(([studentId, value]) => ({
      id: crypto.randomUUID(),
      studentId,
      examId: activeExamId,
      value
    }));
    
    updatedMarks = [...updatedMarks, ...newMarksBatch];
    setMarks(updatedMarks);
    db.set(DB_KEYS.MARKS, updatedMarks);
    setActiveExamId(null);
    alert('تم حفظ النقاط بنجاح');
  };

  const filteredStudents = students.filter(s => {
    const exam = exams.find(e => e.id === activeExamId);
    return exam ? s.grade.includes(exam.grade) : false;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-indigo-600 pr-4 mb-6">برمجة اختبار جديد</h2>
        <form onSubmit={handleAddExam} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">المادة</label>
            <select 
              value={examForm.subjectId} 
              onChange={e => setExamForm({...examForm, subjectId: e.target.value})}
              className={`w-full border p-2 rounded-lg ${errors.subject ? 'border-red-500 bg-red-50' : ''}`}
            >
              <option value="">-- اختر مادة --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">المستوى</label>
            <input 
              placeholder="مثال: أولى ثانوي" 
              value={examForm.grade} 
              onChange={e => setExamForm({...examForm, grade: e.target.value})}
              className={`w-full border p-2 rounded-lg ${errors.grade ? 'border-red-500 bg-red-50' : ''}`}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">التاريخ</label>
            <input 
              type="date" 
              value={examForm.date} 
              onChange={e => setExamForm({...examForm, date: e.target.value})}
              className={`w-full border p-2 rounded-lg ${errors.date ? 'border-red-500 bg-red-50' : ''}`}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow active:scale-95">
            إضافة الاختبار
          </button>
        </form>
        {(errors.subject || errors.grade || errors.date) && (
          <p className="text-red-500 text-xs mt-2 italic">* يرجى ملء كافة الحقول الإلزامية</p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">قائمة الاختبارات المبرمجة</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 border-b">المادة</th>
                <th className="p-4 border-b">المستوى</th>
                <th className="p-4 border-b">التاريخ</th>
                <th className="p-4 border-b">عدد النقاط المسجلة</th>
                <th className="p-4 border-b">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(e => {
                const subj = subjects.find(s => s.id === e.subjectId);
                const marksCount = marks.filter(m => m.examId === e.id).length;
                return (
                  <tr key={e.id} className={`hover:bg-gray-50 transition-colors ${activeExamId === e.id ? 'bg-indigo-50 border-r-4 border-indigo-500' : 'border-b last:border-0'}`}>
                    <td className="p-4 font-bold text-indigo-700">{subj?.name || 'مادة محذوفة'}</td>
                    <td className="p-4">{e.grade}</td>
                    <td className="p-4 font-mono text-sm">{e.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${marksCount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {marksCount} نقاط
                      </span>
                    </td>
                    <td className="p-4 space-x-2 rtl:space-x-reverse">
                      <button onClick={() => startMarksEntry(e)} className="text-blue-600 font-bold hover:underline">إدخال النقاط</button>
                      <button onClick={() => deleteExam(e.id)} className="text-red-600 font-bold hover:underline">حذف</button>
                    </td>
                  </tr>
                );
              })}
              {exams.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">لا توجد اختبارات مبرمجة حالياً</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeExamId && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-indigo-200 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-indigo-800">
              إدخال نقاط: {subjects.find(s => s.id === exams.find(ex => ex.id === activeExamId)?.subjectId)?.name} 
              ({exams.find(ex => ex.id === activeExamId)?.grade})
            </h3>
            <button onClick={() => setActiveExamId(null)} className="text-gray-400 hover:text-gray-600">✕ إغلاق</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <div key={student.id} className="p-4 border rounded-xl flex items-center justify-between gap-4 bg-gray-50 hover:bg-white transition-all shadow-sm">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{student.firstName} {student.lastName}</p>
                    <p className="text-[10px] text-gray-500">{student.group}</p>
                  </div>
                  <input 
                    type="number" step="0.25" min="0" max="20"
                    placeholder="20/.."
                    value={marksEntry[student.id] ?? ''}
                    onChange={e => handleMarkChange(student.id, e.target.value)}
                    className="w-20 border-2 border-indigo-100 p-2 rounded-lg text-center font-bold focus:border-indigo-500 outline-none"
                  />
                </div>
              ))
            ) : (
              <p className="col-span-full p-6 text-center text-gray-400 italic">لا يوجد تلاميذ في هذا المستوى ({exams.find(ex => ex.id === activeExamId)?.grade})</p>
            )}
          </div>
          
          <div className="flex gap-4">
            <button onClick={saveMarks} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition-all active:scale-95">
              حفظ كافة النقاط
            </button>
            <button onClick={() => setActiveExamId(null)} className="px-8 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300">
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;
