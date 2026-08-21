
import React, { useState, useEffect } from 'react';
import { SCHOOL_NAME, Icons } from '../constants';
import { AppTab, OrgSettings, Student, Teacher, Absence, UserRole } from '../types';
import { db, DB_KEYS } from '../services/db';

interface DashboardProps {
  onNavigate: (tab: AppTab) => void;
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userRole }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const org = db.get<OrgSettings | null>(DB_KEYS.ORG_SETTINGS, null);
  const students = db.get<Student[]>(DB_KEYS.STUDENTS, []);
  const teachers = db.get<Teacher[]>(DB_KEYS.TEACHERS, []);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const stats = [
    { label: 'إجمالي التلاميذ', value: students.length, color: 'bg-blue-500', icon: '👥' },
    { label: 'هيئة التدريس', value: teachers.length, color: 'bg-indigo-500', icon: '👨‍🏫' },
    { label: 'الأقسام المفتوحة', value: db.get(DB_KEYS.CLASSROOMS, []).length, color: 'bg-orange-500', icon: '🏢' },
    { label: 'المواد الدراسية', value: db.get(DB_KEYS.SUBJECTS, []).length, color: 'bg-emerald-500', icon: '📚' },
  ];

  const allCards = [
    { id: AppTab.STUDENTS, label: 'إدارة التلاميذ', icon: Icons.StudentIcon, desc: 'الملفات الشخصية، الصور، والبحث', roles: ['admin', 'teacher'] },
    { id: AppTab.CLASSROOMS, label: 'الأقسام والفصول', icon: Icons.Home, desc: 'تنظيم الهيكل التربوي للمؤسسة', roles: ['admin'] },
    { id: AppTab.SUBJECTS, label: 'المواد الدراسية', icon: Icons.Clipboard, desc: 'إدارة المناهج والمواد', roles: ['admin'] },
    { id: AppTab.TEACHERS, label: 'هيئة التدريس', icon: Icons.Teacher, desc: 'توزيع الأساتذة والمواد', roles: ['admin'] },
    { id: AppTab.EXAMS, label: 'الامتحانات والنقاط', icon: Icons.AbsenceIcon, desc: 'إدخال النتائج الدورية', roles: ['admin', 'teacher'] },
    { id: AppTab.GRADEBOOK, label: 'كشوف النقاط', icon: Icons.ResultsIcon, desc: 'استخراج نتائج التلاميذ', roles: ['admin', 'teacher'] },
    { id: AppTab.ID_CARDS, label: 'البطاقات المدرسية', icon: Icons.Clipboard, desc: 'توليد بطاقات التعريف بالصور', roles: ['admin', 'teacher'] },
    { id: AppTab.CERTIFICATES, label: 'شهادات التقدير', icon: Icons.Clipboard, desc: 'تكريم التلاميذ المتفوقين', roles: ['admin', 'teacher'] },
    { id: AppTab.LEDGER, label: 'سجلات التسجيل', icon: Icons.Clipboard, desc: 'الدفاتر الرسمية للمؤسسة', roles: ['admin'] },
    { id: AppTab.ORG_SETTINGS, label: 'بيانات المؤسسة', icon: Icons.Settings, desc: 'المعلومات الرسمية والختم', roles: ['admin'] },
  ];

  const cards = allCards.filter(card => card.roles.includes(userRole));

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-md">
              {org?.schoolName || SCHOOL_NAME}
            </h1>
            {deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-white transition-all animate-pulse"
              >
                تثبيت على الكمبيوتر 💻
              </button>
            )}
          </div>
          <p className="text-xl opacity-90 font-bold mb-8">{org ? `${org.state} • ${org.municipality}` : 'نظام الإدارة المدرسية المتطور'}</p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-2xl font-bold border border-white/10">📅 السنة الدراسية: {org?.academicYear || '2025/2026'}</span>
            <span className="bg-emerald-500/80 px-6 py-2 rounded-2xl font-bold">🟢 متصل محلياً (نسخة مكتبية)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-xl transition-all">
            <div className={`text-4xl p-5 rounded-2xl ${stat.color} bg-opacity-10 text-opacity-100`}>{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-xs font-black uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="bg-white rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-blue-100 hover:-translate-y-3"
          >
            <div className="p-6 rounded-[2rem] bg-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
              <card.icon />
            </div>
            <div>
              <span className="text-xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">{card.label}</span>
              <p className="text-xs text-gray-400 mt-2 font-bold leading-relaxed">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
