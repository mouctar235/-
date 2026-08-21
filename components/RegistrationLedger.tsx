
import React, { useState, useEffect } from 'react';
import { Student, OrgSettings } from '../types';
import { db, DB_KEYS } from '../services/db';

const RegistrationLedger: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [selectedGrade, setSelectedGrade] = useState('');

  useEffect(() => {
    setStudents(db.get(DB_KEYS.STUDENTS, []));
    setOrg(db.get(DB_KEYS.ORG_SETTINGS, null));
  }, []);

  const grades = Array.from(new Set(students.map(s => s.grade))).filter(Boolean);
  const filteredStudents = students.filter(s => selectedGrade === '' || s.grade === selectedGrade);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="border-r-8 border-green-600 pr-4">
            <h2 className="text-3xl font-black text-gray-800">دفتر تسجيل التلاميذ</h2>
            <p className="text-gray-500 font-medium">سجل رسمي لكافة المتمدرسين حسب المستوى الدراسي</p>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedGrade} 
              onChange={e => setSelectedGrade(e.target.value)}
              className="p-3 rounded-2xl border bg-gray-50 font-black outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- اختر المستوى --</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <button 
              onClick={() => window.print()} 
              className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all active:scale-95"
            >
              طباعة السجل 🖨️
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[2rem] border-2 border-gray-100 shadow-xl print:shadow-none print:border-0 print:p-0">
        {/* Ledger Header (Print only) */}
        <div className="hidden print:block mb-10">
          <div className="flex justify-between items-start border-b-2 border-black pb-6">
             <div className="text-right font-black space-y-1">
               <p className="text-sm">جمهورية تشاد</p>
               <p className="text-sm">{org?.state || 'وزارة التربية والتعليم'}</p>
               <p className="text-xl text-green-800">{org?.schoolName || 'مجمع المعالي التعليمي'}</p>
             </div>
             <div className="text-center font-black">
                <h1 className="text-2xl border-2 border-black px-6 py-2">دفتر تسجيل التلاميذ الرسمي</h1>
                <p className="mt-2">السنة الدراسية: {org?.academicYear}</p>
             </div>
             <div className="text-left font-black text-xs">
                <p>تاريخ الاستخراج: {new Date().toLocaleDateString('ar-DZ')}</p>
                <p>المستوى: {selectedGrade || 'جميع المستويات'}</p>
             </div>
          </div>
        </div>

        <table className="w-full border-collapse border-2 border-gray-800 text-right">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-200">
              <th className="border border-gray-800 p-3 font-black text-sm w-16">الرقم</th>
              <th className="border border-gray-800 p-3 font-black text-sm w-28">رقم القيد</th>
              <th className="border border-gray-800 p-3 font-black text-sm">اللقب والاسم</th>
              <th className="border border-gray-800 p-3 font-black text-sm w-32">تاريخ الميلاد</th>
              <th className="border border-gray-800 p-3 font-black text-sm w-28">المستوى</th>
              <th className="border border-gray-800 p-3 font-black text-sm w-24">الحالة</th>
              <th className="border border-gray-800 p-3 font-black text-sm">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan={7} className="p-10 text-center text-gray-400 italic">يرجى اختيار المستوى لعرض السجل</td></tr>
            ) : (
              filteredStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-800 p-3 text-center font-bold text-xs">{idx + 1}</td>
                  <td className="border border-gray-800 p-3 text-center font-mono font-black text-xs">{s.id}</td>
                  <td className="border border-gray-800 p-3 font-black text-sm">{s.lastName} {s.firstName}</td>
                  <td className="border border-gray-800 p-3 text-center text-xs">{s.birthDate || '-'}</td>
                  <td className="border border-gray-800 p-3 text-center font-bold text-xs">{s.grade}</td>
                  <td className="border border-gray-800 p-3 text-center text-xs">{s.isRepeater ? 'معيد' : 'جديد'}</td>
                  <td className="border border-gray-800 p-3 text-xs italic">{s.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Ledger Footer (Print only) */}
        <div className="hidden print:flex justify-between mt-20 font-black text-sm">
           <div className="text-center w-64 border-t border-black pt-2">توقيع المستشار التربوي</div>
           <div className="text-center w-64 border-t border-black pt-2">
             توقيع ومدير المؤسسة<br/>
             <span className="text-xs font-medium italic">{org?.managerName}</span>
           </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; font-family: 'Sakkal Majalla', serif; }
          .container { width: 100% !important; max-width: none !important; padding: 0 !important; margin: 0 !important; }
          main { padding: 0 !important; }
          table { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default RegistrationLedger;
