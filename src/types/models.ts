export interface Employee {
  id: string; // Firestore document ID (added in api.js)
  name: string;
  email: string;
  avatar: string;
  shift?: Shift;
  shiftId: string;
  employmentDate: string;
  billingDate: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export type TableStatus = "free" | "reserved" | "occupied";

export interface Table {
  id: string;
  number: string;
  seats: number;
  status: TableStatus;
  reservationTime: string | null;
}

export interface Attendance {
  id: string;
  absences: number;
  hours: number;
  month: string;
  monthIndex: number;
  year: number;
}

export type UserRole = "admin" | "waiter";

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}
