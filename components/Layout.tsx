
import React from 'react';
import { AppTab, UserRole } from '../types';
import { Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  userRole: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userRole }) => {
  const allNavItems = [
    { id: AppTab.HOME, label: 'الرئيسية', icon: Icons.Home, roles: ['admin', 'teacher'] },
    { id: AppTab.STUDENTS, label: 'التلاميذ', icon: Icons.Users, roles: ['admin', 'teacher'] },
    { id: AppTab.TEACHERS, label: 'الأساتذة', icon: Icons.Users, roles: ['admin'] },
    { id: AppTab.EXAMS, label: 'الاختبارات', icon: Icons.Clipboard, roles: ['admin', 'teacher'] },
    { id: AppTab.GRADEBOOK, label: 'النتائج', icon: Icons.Clipboard, roles: ['admin', 'teacher'] },
    { id: AppTab.ABSENCES, label: 'الغيابات', icon: Icons.Clipboard, roles: ['admin', 'teacher'] },
    { id: AppTab.CERTIFICATES, label: 'الشهادات', icon: Icons.Clipboard, roles: ['admin', 'teacher'] },
    { id: AppTab.ID_CARDS, label: 'البطاقات', icon: Icons.Clipboard, roles: ['admin', 'teacher'] },
    { id: AppTab.LEDGER, label: 'السجلات', icon: Icons.Clipboard, roles: ['admin', 'teacher'] },
    { id: AppTab.ORG_SETTINGS, label: 'المؤسسة', icon: Icons.Settings, roles: ['admin'] },
    { id: AppTab.SETTINGS, label: 'النظام', icon: Icons.Settings, roles: ['admin', 'teacher'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fa]">
      <header className="custom-dark-blue text-white shadow-2xl sticky top-0 z-50 no-print">
        <nav className="container mx-auto px-4 overflow-x-auto scrollbar-hide">
          <ul className="flex items-center min-w-max">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-6 py-5 transition-all duration-300 border-b-4 ${
                    activeTab === item.id 
                      ? 'bg-blue-600/40 border-blue-400 text-white' 
                      : 'border-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <item.icon />
                  <span className="text-sm font-black tracking-wide">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      <footer className="bg-white border-t p-6 mt-12 no-print">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <span>مجمع المعالي التعليمي &copy; 2025 • جميع الحقوق محفوظة</span>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span>النظام يعمل محلياً أوفلاين</span>
             </div>
             <span>إصدار V2.5.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
