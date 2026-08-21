
import React, { useState, useEffect } from 'react';
import { OrgSettings } from '../types';
import { db, DB_KEYS } from '../services/db';

const OrgSettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<OrgSettings>({
    state: 'تشاد',
    municipality: '',
    schoolName: '',
    academicYear: '2025/2026',
    managerName: ''
  });

  useEffect(() => {
    const saved = db.get<OrgSettings | null>(DB_KEYS.ORG_SETTINGS, null);
    if (saved) setSettings(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    db.set(DB_KEYS.ORG_SETTINGS, settings);
    alert('تم حفظ إعدادات المؤسسة بنجاح');
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
      <div className="border-r-4 border-blue-600 pr-4">
        <h2 className="text-2xl font-black text-gray-800">إعدادات المؤسسة</h2>
        <p className="text-gray-500">هذه المعلومات ستظهر في الشهادات والتقارير الرسمية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">الدولة / الولاية</label>
          <input
            name="state"
            value={settings.state}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">البلدية</label>
          <input
            name="municipality"
            value={settings.municipality}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">اسم المؤسسة التعليمية</label>
          <input
            name="schoolName"
            value={settings.schoolName}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">السنة الدراسية</label>
          <input
            name="academicYear"
            value={settings.academicYear}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-700">اسم المدير</label>
          <input
            name="managerName"
            value={settings.managerName}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
      >
        حفظ البيانات الأساسية
      </button>
    </div>
  );
};

export default OrgSettingsComponent;
