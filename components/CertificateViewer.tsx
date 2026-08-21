
import React, { useState, useEffect } from 'react';
import { Student, Mark, Exam, OrgSettings } from '../types';
import { db, DB_KEYS } from '../services/db';

const CertificateViewer: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    setStudents(db.get(DB_KEYS.STUDENTS, []));
    setMarks(db.get(DB_KEYS.MARKS, []));
    setOrg(db.get(DB_KEYS.ORG_SETTINGS, null));
  }, []);

  const calculateAverage = (studentId: string) => {
    const sMarks = marks.filter(m => m.studentId === studentId);
    if (sMarks.length === 0) return 0;
    const sum = sMarks.reduce((acc, m) => acc + m.value, 0);
    return (sum / sMarks.length).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  if (selectedStudent && org) {
    const avg = calculateAverage(selectedStudent.id);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center no-print">
          <button onClick={() => setSelectedStudent(null)} className="bg-gray-200 px-6 py-2 rounded-xl font-bold">رجوع للقائمة</button>
          <button onClick={handlePrint} className="bg-green-600 text-white px-8 py-2 rounded-xl font-black shadow-lg">طباعة الشهادة 🖨️</button>
        </div>

        {/* Decorative Certificate */}
        <div id="certificate" className="certificate-container bg-white border-[16px] border-double border-yellow-600 p-12 relative mx-auto max-w-4xl min-h-[600px] shadow-2xl print:shadow-none print:border-[12px]">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 right-4 text-4xl opacity-20">⚜️</div>
          <div className="absolute top-4 left-4 text-4xl opacity-20">⚜️</div>
          <div className="absolute bottom-4 right-4 text-4xl opacity-20">⚜️</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-20">⚜️</div>

          {/* Header */}
          <div className="flex justify-between items-start mb-8 text-sm font-bold text-gray-700">
             <div className="text-right space-y-1">
               <p>{org.state}</p>
               <p>{org.municipality}</p>
               <p className="font-black text-lg text-blue-800">{org.schoolName}</p>
             </div>
             <div className="text-center">
               <div className="text-4xl mb-2">🏅</div>
               <p>السنة الدراسية: {org.academicYear}</p>
             </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-4 my-12">
            <h1 className="text-5xl font-black text-yellow-700 tracking-widest" style={{ fontFamily: 'Cairo' }}>شهادة تقدير</h1>
            <p className="text-xl text-gray-600 italic">يُشهد مجمع المعالي التعليمي بأن التلميذ(ة):</p>
          </div>

          {/* Student Info */}
          <div className="text-center space-y-6">
            <p className="text-4xl font-black text-gray-800 underline decoration-yellow-500 underline-offset-8">
              {selectedStudent.lastName} {selectedStudent.firstName}
            </p>
            <div className="flex justify-center gap-12 text-lg text-gray-700">
               <p>المستوى: <span className="font-bold">{selectedStudent.grade}</span></p>
               <p>رقم التعريف: <span className="font-mono font-bold">{selectedStudent.id}</span></p>
            </div>
            
            <div className="bg-yellow-50 border-2 border-yellow-200 py-6 px-12 inline-block rounded-3xl mt-8">
               <p className="text-gray-600 mb-1">قد حصل على معدل فصلي قدره:</p>
               <p className="text-5xl font-black text-yellow-700">{avg} / 20</p>
            </div>
            
            <p className="text-xl text-gray-600 mt-8">
              وذلك لتميزه(ها) واجتهاده(ها) طوال الفصل الدراسي، متمنين له(ها) دوام التوفيق والنجاح.
            </p>
          </div>

          {/* Footer Signatures */}
          <div className="flex justify-between mt-20 text-lg">
             <div className="text-center w-48 border-t border-gray-300 pt-2">
                <p className="font-bold">ختم المؤسسة</p>
             </div>
             <div className="text-center w-48 border-t border-gray-300 pt-2">
                <p className="font-bold">توقيع المدير</p>
                <p className="text-sm italic">{org.managerName}</p>
             </div>
          </div>
        </div>

        <style>{`
          @media print {
            body * { visibility: hidden; }
            #certificate, #certificate * { visibility: visible; }
            #certificate { position: absolute; left: 0; top: 0; width: 100%; margin: 0; border-[10pt] double #b8860b !important; }
            .no-print { display: none !important; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
      <div className="border-r-4 border-yellow-500 pr-4">
        <h2 className="text-2xl font-black text-gray-800">إصدار الشهادات المزخرفة</h2>
        <p className="text-gray-500 italic">اختر تلميذاً لعرض وطباعة شهادته التقديرية</p>
      </div>

      {!org && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-bold">
          ⚠️ يرجى تعبئة بيانات المؤسسة أولاً في قسم "إعدادات المؤسسة" لتظهر في الشهادات.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedStudent(s)}
            disabled={!org}
            className="p-6 border-2 border-gray-100 rounded-2xl flex items-center justify-between hover:border-yellow-400 hover:bg-yellow-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-right">
              <p className="font-black text-gray-800 group-hover:text-yellow-700">{s.lastName} {s.firstName}</p>
              <p className="text-xs text-gray-500">{s.grade}</p>
            </div>
            <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">📜</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CertificateViewer;
