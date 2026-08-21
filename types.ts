
export enum AppTab {
  HOME = 'home',
  STUDENTS = 'students',
  ABSENCES = 'absences',
  TEACHERS = 'teachers',
  SUBJECTS = 'subjects',
  CLASSROOMS = 'classrooms',
  EXAMS = 'exams',
  RESULTS = 'results',
  GRADEBOOK = 'gradebook',
  CERTIFICATES = 'certificates',
  ID_CARDS = 'id_cards',
  LEDGER = 'ledger',
  ORG_SETTINGS = 'org_settings',
  SETTINGS = 'settings',
  ACCOUNT = 'account'
}

export interface OrgSettings {
  state: string; 
  municipality: string; 
  schoolName: string; 
  academicYear: string; 
  managerName: string; 
}

export type UserRole = 'admin' | 'teacher';

export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
  role: UserRole;
}

export interface Student {
  id: string; 
  lastName: string;
  firstName: string;
  gender: 'ذكر' | 'أنثى';
  birthDate: string;
  isRepeater: boolean;
  grade: string; 
  classroomId: string; // الرابط بالفصل
  group: string; // اسم الفصل للعرض السريع
  status: string;
  parentPhone: string;
  notes: string;
  photo?: string; // Base64
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number; // معامل المادة
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  subjectIds: string[];
  classroomIds: string[]; // الفصول التي يدرسها
}

export interface Classroom {
  id: string;
  name: string;
  grade: string;
}

export interface Absence {
  id: string;
  studentId: string;
  date: string;
  type: 'full' | 'morning' | 'afternoon';
}

export interface Exam {
  id: string;
  subjectId: string;
  date: string;
  grade: string; // Added to support grade-level exams
  classroomId?: string; // Optionalized to match component usage
  term?: '1' | '2' | '3'; // Optionalized to match component usage
}

export interface Mark {
  id: string;
  studentId: string;
  examId: string;
  value: number;
}
