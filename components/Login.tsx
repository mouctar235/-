
import React, { useState, useEffect } from 'react';
import { SCHOOL_NAME } from '../constants';
import { UserRole } from '../types';
import { db, DB_KEYS } from '../services/db';

interface LoginProps {
  onLogin: (username: string, role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const existingUsers = localStorage.getItem(DB_KEYS.AUTH);
    if (!existingUsers) {
      setIsFirstTime(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default Admin credentials (Fallback)
    if (username === 'admin' && password === 'admin') {
      onLogin(username, 'admin');
    } 
    // Teacher credentials
    else if (username === 'teacher' && password === 'teacher') {
      onLogin(username, 'teacher');
    }
    else if (username === '' || password === '') {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4 font-['Tajawal']">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 space-y-8 border-t-[12px] border-blue-600">
        <div className="text-center space-y-3">
          <div className="text-6xl mb-4 filter drop-shadow-lg">🏫</div>
          <h1 className="text-3xl font-black text-gray-800 leading-tight">{SCHOOL_NAME}</h1>
          <p className="text-gray-400 font-bold text-sm">نظام إدارة متكامل • العمل بدون إنترنت</p>
        </div>

        {isFirstTime && (
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-blue-700 text-xs font-black text-center">
              مرحباً بك! هذه هي المرة الأولى لتشغيل النظام.<br/>
              بيانات الدخول الافتراضية للمدير هي: admin / admin
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 block mr-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-right font-bold"
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 block mr-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-right font-bold"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs text-center font-black animate-bounce">{error}</div>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-5 rounded-2xl shadow-xl transform active:scale-[0.97] transition-all text-lg"
          >
            تسجيل الدخول للنظام
          </button>
        </form>

        <div className="text-center pt-6 border-t border-gray-50 flex flex-col gap-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">تجربة النظام (اختياري)</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => {setUsername('admin'); setPassword('admin');}} className="text-[10px] font-black text-blue-500 hover:underline">بيانات المدير</button>
            <button onClick={() => {setUsername('teacher'); setPassword('teacher');}} className="text-[10px] font-black text-indigo-500 hover:underline">بيانات الأستاذ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
