
import React, { useState, useEffect } from 'react';
import { Student, OrgSettings, Classroom } from '../types';
import { db, DB_KEYS } from '../services/db';

const IDCardViewer: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');

  useEffect(() => {
    setStudents(db.get(DB_KEYS.STUDENTS, []));
    setOrg(db.get(DB_KEYS.ORG_SETTINGS, null));
    setClassrooms(db.get(DB_KEYS.CLASSROOMS, []));
  }, []);

  const filteredStudents = students.filter(s => !selectedClassId || s.classroomId === selectedClassId);

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="border-r-8 border-blue-600 pr-4">
            <h2 className="text-3xl font-black text-gray-800">البطاقات المدرسية</h2>
            <p className="text-gray-500 font-bold">توليد بطاقات التعريف بالصور لكل التلاميذ</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={selectedClassId} 
              onChange={e => setSelectedClassId(e.target.value)}
              className="flex-1 md:w-64 p-4 rounded-2xl border-2 border-gray-100 font-black outline-none focus:border-blue-500"
            >
              <option value="">جميع الأقسام</option>
              {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button 
              onClick={() => window.print()} 
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 active:scale-95 transition-all"
            >
              طباعة البطاقات 🖨️
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 print:grid-cols-2 print:gap-4 print:p-0">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400 font-bold italic no-print">لا توجد بيانات لعرضها</div>
        ) : (
          filteredStudents.map(student => (
            <div key={student.id} className="id-card-print relative w-full max-w-[400px] mx-auto bg-white border-2 border-blue-600 rounded-[2rem] overflow-hidden shadow-2xl print:shadow-none print:border-blue-800 print:mb-4">
              {/* Header Background */}
              <div className="h-24 bg-gradient-to-r from-blue-700 to-indigo-800 p-4 text-white flex justify-between items-start">
                 <div className="text-right">
                    <h3 className="text-sm font-black leading-tight uppercase tracking-tighter">{org?.schoolName || 'نظام إدارة المدارس'}</h3>
                    <p className="text-[10px] opacity-80 font-bold">{org?.academicYear || '2025/2026'}</p>
                 </div>
                 <div className="text-2xl">🏫</div>
              </div>

              {/* Card Body */}
              <div className="p-6 pt-0 -mt-10 flex flex-col items-center">
                 <div className="w-32 h-32 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden mb-4 relative z-10">
                    {student.photo ? (
                      <img src={student.photo} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">👤</div>
                    )}
                 </div>

                 <div className="text-center space-y-2 w-full mb-6">
                    <h4 className="text-2xl font-black text-gray-800 tracking-tight">{student.lastName} {student.firstName}</h4>
                    <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase">متمدرس</div>
                 </div>

                 <div className="w-full grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <div className="text-right">
                       <p className="text-[10px] text-gray-400 font-black mb-0.5">القسم الدراسي</p>
                       <p className="text-sm font-black text-gray-700">{student.group}</p>
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] text-gray-400 font-black mb-0.5">رقم التعريف</p>
                       <p className="text-sm font-black text-blue-600 font-mono">{student.id}</p>
                    </div>
                 </div>
              </div>

              {/* Bottom Strip */}
              <div className="bg-gray-100 p-3 flex justify-between items-center text-[9px] font-black text-gray-400">
                 <span>{org?.state} - {org?.municipality}</span>
                 <span className="text-blue-500">البطاقة صالحة لمدة سنة</span>
              </div>
              
              {/* Vertical Side Bar */}
              <div className="absolute left-0 top-0 w-3 h-full bg-blue-600"></div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .id-card-print { break-inside: avoid; scale: 0.9; transform-origin: top; }
          main { padding: 0 !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default IDCardViewer;
