import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { toAttendance, toEmployee, toShift, toTable } from "./firestoreMappers";
import type { Attendance, Employee, Shift, Table } from "../types/models";

export const fetchShifts = async (): Promise<Shift[]> => {
  const snapshot = await getDocs(collection(db, "shifts"));
  return snapshot.docs.map(toShift);
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const [snapshot, shifts] = await Promise.all([
    getDocs(collection(db, "employees")),
    fetchShifts(),
  ]);
  const shiftsById = new Map(shifts.map((shift) => [shift.id, shift]));
  return snapshot.docs.map((document) => toEmployee(document, shiftsById));
};

export const fetchAttendance = async (): Promise<Attendance[]> => {
  const snapshot = await getDocs(collection(db, "attendance"));
  return snapshot.docs.map(toAttendance);
};

export const fetchTables = async (): Promise<Table[]> => {
  const snapshot = await getDocs(collection(db, "tables"));
  return snapshot.docs.map(toTable);
};
