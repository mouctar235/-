
import React, { useState, useEffect } from 'react';
import { AppTab, AuthUser, UserRole } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import AbsenceTracker from './components/AbsenceTracker';
import ResultsAnalysis from './components/ResultsAnalysis';
import TeacherManagement from './components/TeacherManagement';
import SubjectManagement from './components/SubjectManagement';
import ClassroomManagement from './components/ClassroomManagement';
import ExamManagement from './components/ExamManagement';
import OrgSettingsComponent from './components/OrgSettings';
import CertificateViewer from './components/CertificateViewer';
import GradeBook from './components/GradeBook';
import IDCardViewer from './components/IDCardViewer';
import RegistrationLedger from './components/RegistrationLedger';
import Login from './components/Login';
import { db, DB_KEYS } from './services/db';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [auth, setAuth] = useState<AuthUser>({ username: '', isLoggedIn: false, role: 'teacher' });

  useEffect(() => {
    const savedAuth = db.get<AuthUser | null>(DB_KEYS.AUTH, null);
    if (savedAuth && savedAuth.isLoggedIn) {
      setAuth(savedAuth);
    }
  }, []);

  const handleLogin = (username: string, role: UserRole) => {
    const newAuth: AuthUser = { username, isLoggedIn: true, role };
    setAuth(newAuth);
    db.set(DB_KEYS.AUTH, newAuth);
  };

  const handleLogout = () => {
    const newAuth: AuthUser = { username: '', isLoggedIn: false, role: 'teacher' };
    setAuth(newAuth);
    db.set(DB_KEYS.AUTH, newAuth);
    setActiveTab(AppTab.HOME);
  };

  const handleExportData = () => {
    if (auth.role !== 'admin') return;
    const allData: Record<string, any> = {};
    Object.values(DB_KEYS).forEach(key => {
      allData[key] = localStorage.getItem(key);
    });
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `school_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (auth.role !== 'admin') return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (confirm('سيتم استبدال كافة البيانات الحالية بالبيانات المستوردة. هل أنت متأكد؟')) {
          Object.entries(json).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value as string);
          });
          window.location.reload();
        }
      } catch (err) {
        alert('خطأ في قراءة ملف النسخة الاحتياطية');
      }
    };
    reader.readAsText(file);
  };

  if (!auth.isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return <Dashboard onNavigate={setActiveTab} userRole={auth.role} />;
      case AppTab.STUDENTS:
        return <StudentManagement />;
      case AppTab.ABSENCES:
        return <AbsenceTracker />;
      case AppTab.RESULTS:
        return <ResultsAnalysis />;
      case AppTab.TEACHERS:
        return <TeacherManagement />;
      case AppTab.SUBJECTS:
        return <SubjectManagement />;
      case AppTab.CLASSROOMS:
        return <ClassroomManagement />;
      case AppTab.EXAMS:
        return <ExamManagement />;
      case AppTab.GRADEBOOK:
        return <GradeBook />;
      case AppTab.ORG_SETTINGS:
        return <OrgSettingsComponent />;
      case AppTab.CERTIFICATES:
        return <CertificateViewer />;
      case AppTab.ID_CARDS:
        return <IDCardViewer />;
      case AppTab.LEDGER:
        return <RegistrationLedger />;
      case AppTab.SETTINGS:
        return (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-10 border border-gray-100">
             <div className="border-r-8 border-gray-400 pr-4">
               <h2 className="text-3xl font-black text-gray-800">إدارة النظام والبيانات</h2>
               <p className="text-gray-500 font-medium">الأدوات التقنية للتحكم في قاعدة البيانات والمستخدمين</p>
             </div>
             
             {auth.role === 'admin' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 border-2 border-dashed border-gray-200 rounded-[2rem] space-y-4">
                   <h3 className="text-xl font-black text-gray-700">النسخ الاحتياطي</h3>
                   <p className="text-sm text-gray-500">قم بتحميل نسخة كاملة من بيانات المدرسة للاحتفاظ بها في مكان آمن.</p>
                   <button onClick={handleExportData} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">تصدير قاعدة البيانات (JSON)</button>
                 </div>
                 
                 <div className="p-8 border-2 border-dashed border-gray-200 rounded-[2rem] space-y-4">
                   <h3 className="text-xl font-black text-gray-700">استرجاع البيانات</h3>
                   <p className="text-sm text-gray-500">اختر ملف النسخة الاحتياطية لاستعادة كافة البيانات المسجلة مسبقاً.</p>
                   <label className="block w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-center cursor-pointer hover:bg-gray-200 transition-all">
                     استيراد ملف النسخة الاحتياطية
                     <input type="file" className="hidden" accept=".json" onChange={handleImportData} />
                   </label>
                 </div>
               </div>
             )}

             <div className="space-y-4 pt-6">
               <div className="p-6 border rounded-2xl flex justify-between items-center bg-gray-50">
                 <span className="font-black text-gray-700">المستخدم الحالي</span>
                 <div className="flex gap-2 items-center">
                    <span className="text-xs bg-gray-200 px-3 py-1 rounded-full font-bold">{auth.role === 'admin' ? 'مدير' : 'أستاذ'}</span>
                    <span className="bg-blue-100 text-blue-700 px-6 py-2 rounded-full font-black uppercase">{auth.username}</span>
                 </div>
               </div>
               <div className="flex gap-4">
                 <button onClick={handleLogout} className="flex-1 py-4 bg-orange-100 text-orange-600 rounded-2xl font-black hover:bg-orange-200 transition-all">تسجيل الخروج</button>
                 {auth.role === 'admin' && (
                    <button 
                      onClick={() => {
                        if(confirm('سيتم حذف كافة التلاميذ والأساتذة والبيانات نهائياً. هل أنت متأكد؟')) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="flex-1 py-4 bg-red-100 text-red-600 rounded-2xl font-black hover:bg-red-200 transition-all"
                     >
                       تهيئة المصنع (حذف شامل)
                    </button>
                 )}
               </div>
             </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActiveTab} userRole={auth.role} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userRole={auth.role}>
      {renderContent()}
    </Layout>
  );
};

export default App;
