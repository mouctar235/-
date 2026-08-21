
import React, { useState, useEffect } from 'react';
import { Student, Mark, Exam, Subject } from '../types';
import { db, DB_KEYS } from '../services/db';

const GradeBook: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    setStudents(db.get(DB_KEYS.STUDENTS, []));
    setMarks(db.get(DB_KEYS.MARKS, []));
    setExams(db.get(DB_KEYS.EXAMS, []));
    setSubjects(db.get(DB_KEYS.SUBJECTS, []));
  }, []);

  const grades = Array.from(new Set(students.map(s => s.grade))).filter(Boolean);
  const groups = Array.from(new Set(students.filter(s => s.grade === selectedGrade).map(s => s.group))).filter(Boolean);

  const filteredStudents = students.filter(s => 
    (selectedGrade === '' || s.grade === selectedGrade) &&
    (selectedGroup === '' || s.group === selectedGroup)
  );

  const getStudentMarkForSubject = (studentId: string, subjectId: string) => {
    // Finds the latest mark for this student in this subject
    const subjectExams = exams.filter(e => e.subjectId === subjectId);
    const examIds = subjectExams.map(e => e.id);
    const studentMarks = marks.filter(m => m.studentId === studentId && examIds.includes(m.examId));
    
    if (studentMarks.length === 0) return '-';
    // Average if multiple exams exist for the same subject? For now, just sum/avg or take last
    const sum = studentMarks.reduce((acc, curr) => acc + curr.value, 0);
    return (sum / studentMarks.length).toFixed(2);
  };

  const calculateOverallAverage = (studentId: string) => {
    const sMarks = marks.filter(m => m.studentId === studentId);
    if (sMarks.length === 0) return 0;
    const sum = sMarks.reduce((acc, m) => acc + m.value, 0);
    return (sum / sMarks.length).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-3xl font-black text-gray-800 border-r-8 border-indigo-600 pr-4">كشف النقاط الفصلي</h2>
          <div className="flex gap-4">
            <select 
              value={selectedGrade} 
              onChange={e => {setSelectedGrade(e.target.value); setSelectedGroup('');}}
              className="p-3 rounded-2xl border bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- اختر المستوى --</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select 
              value={selectedGroup} 
              onChange={e => setSelectedGroup(e.target.value)}
              className="p-3 rounded-2xl border bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- الفوج --</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg no-print hover:bg-indigo-700">طباعة الكشف</button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[1.5rem] border">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-4 border font-black whitespace-nowrap">الاسم واللقب</th>
                {subjects.map(s => (
                  <th key={s.id} className="p-4 border font-black text-xs vertical-text min-w-[60px]">{s.name}</th>
                ))}
                <th className="p-4 border font-black bg-indigo-800">المعدل</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={subjects.length + 2} className="p-10 text-gray-400">يرجى اختيار المستوى لعرض النتائج</td></tr>
              ) : (
                filteredStudents.map(student => {
                  const avg = calculateOverallAverage(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-indigo-50 transition-colors">
                      <td className="p-3 border font-bold text-right pr-6 whitespace-nowrap">{student.lastName} {student.firstName}</td>
                      {subjects.map(subject => (
                        <td key={subject.id} className="p-3 border font-mono text-sm">
                          {getStudentMarkForSubject(student.id, subject.id)}
                        </td>
                      ))}
                      <td className={`p-3 border font-black ${Number(avg) >= 10 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {avg}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container { max-width: 100% !important; margin: 0 !important; }
          table { font-size: 10pt; }
        }
      `}</style>
    </div>
  );
};

export default GradeBook;
