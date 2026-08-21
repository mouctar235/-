
export const db = {
  get: <T,>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  set: <T,>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const DB_KEYS = {
  STUDENTS: 'school_students',
  TEACHERS: 'school_teachers',
  ABSENCES: 'school_absences',
  EXAMS: 'school_exams',
  MARKS: 'school_marks',
  SUBJECTS: 'school_subjects',
  CLASSROOMS: 'school_classrooms',
  ORG_SETTINGS: 'school_org_settings',
  AUTH: 'school_auth_v1'
};
