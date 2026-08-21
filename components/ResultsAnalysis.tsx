
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { db, DB_KEYS } from '../services/db';
import { Student, Mark } from '../types';

const ResultsAnalysis: React.FC = () => {
  const students = db.get<Student[]>(DB_KEYS.STUDENTS, []);
  const marks = db.get<Mark[]>(DB_KEYS.MARKS, []);

  const chartData = useMemo(() => {
    // Aggregating marks by student for a simple overview
    return students.map(s => {
      const studentMarks = marks.filter(m => m.studentId === s.id);
      const avg = studentMarks.length > 0 
        ? studentMarks.reduce((sum, m) => sum + m.value, 0) / studentMarks.length 
        : 0;
      return {
        // Fix: Student interface uses firstName and lastName instead of name
        name: `${s.firstName} ${s.lastName}`,
        average: Number(avg.toFixed(2))
      };
    }).sort((a, b) => b.average - a.average);
  }, [students, marks]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-r-4 border-green-500 pr-4">تحليل النتائج (المعدلات العامة)</h2>
        
        {chartData.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100} 
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 20]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="average" fill="#3482B9" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.average >= 10 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            لا توجد نتائج مسجلة لعرضها حالياً
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">أفضل التلاميذ أداءً</h3>
          <div className="space-y-3">
            {chartData.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-700">{item.name}</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-black">{item.average} / 20</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">إحصائيات النجاح</h3>
          <div className="flex flex-col justify-center h-full space-y-4">
             <div className="flex justify-between items-center">
               <span>نسبة النجاح (أكبر من 10)</span>
               <span className="font-bold text-blue-600">
                 {chartData.length > 0 ? ((chartData.filter(i => i.average >= 10).length / chartData.length) * 100).toFixed(0) : 0}%
               </span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-2.5">
               <div 
                 className="bg-blue-600 h-2.5 rounded-full" 
                 style={{ width: `${chartData.length > 0 ? (chartData.filter(i => i.average >= 10).length / chartData.length) * 100 : 0}%` }}
               ></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalysis;
