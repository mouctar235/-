
import React, { useState, useEffect } from 'react';
import { Student, Absence } from '../types';
import { db, DB_KEYS } from '../services/db';

const AbsenceTracker: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setStudents(db.get(DB_KEYS.STUDENTS, []));
    setAbsences(db.get(DB_KEYS.ABSENCES, []));
  }, []);

  const toggleAbsence = (studentId: string) => {
    const existing = absences.find(a => a.studentId === studentId && a.date === selectedDate);
    let newAbsences: Absence[];
    if (existing) {
      newAbsences = absences.filter(a => !(a.studentId === studentId && a.date === selectedDate));
    } else {
      newAbsences = [...absences, {
        id: crypto.randomUUID(),
        studentId,
        date: selectedDate,
        type: 'full'
      }];
    }
    setAbsences(newAbsences);
    db.set(DB_KEYS.ABSENCES, newAbsences);
  };

  const isAbsent = (studentId: string) => absences.some(a => a.studentId === studentId && a.date === selectedDate);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-red-500 pr-4">متابعة الغيابات اليومية</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold">التاريخ:</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(student => {
          const absent = isAbsent(student.id);
          return (
            <div 
              key={student.id}
              onClick={() => toggleAbsence(student.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                absent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}
            >
              <div>
                {/* Fix: Student interface uses firstName and lastName instead of name */}
                <p className="font-bold text-gray-800">{student.firstName} {student.lastName}</p>
                <p className="text-sm text-gray-500">{student.grade}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-black ${
                absent ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {absent ? 'غائب' : 'حاضر'}
              </div>
            </div>
          );
        })}
        {students.length === 0 && (
          <p className="col-span-full text-center p-10 text-gray-400">يرجى إضافة تلاميذ أولاً لتسجيل الغيابات</p>
        )}
      </div>
    </div>
  );
};

export default AbsenceTracker;
