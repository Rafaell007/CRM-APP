import {
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { Attendance, Employee, Shift, Table } from "../types/models";

// Firestore returns untyped data; these functions are the one place
// where it becomes our typed models

// Firestore Timestamps -> ISO strings, so the data is plain and serializable
const toPlain = (data: DocumentData) =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value instanceof Timestamp ? value.toDate().toISOString() : value,
    ]),
  );

export const toShift = (document: QueryDocumentSnapshot): Shift => {
  const data = document.data();
  return {
    id: document.id,
    name: data.name,
    startTime: data.startTime,
    endTime: data.endTime,
  };
};

export const toEmployee = (
  document: QueryDocumentSnapshot,
  shiftsById: Map<string, Shift>,
): Employee => {
  const data = toPlain(document.data());
  return {
    id: document.id,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    shiftId: data.shiftId,
    employmentDate: data.employmentDate,
    billingDate: data.billingDate,
    shift: shiftsById.get(data.shiftId),
  };
};

export const toAttendance = (document: QueryDocumentSnapshot): Attendance => {
  const data = document.data();
  return {
    id: document.id,
    absences: data.absences,
    hours: data.hours,
    month: data.month,
    monthIndex: data.monthIndex,
    year: data.year,
  };
};

export const toTable = (document: QueryDocumentSnapshot): Table => {
  const data = toPlain(document.data());
  return {
    id: document.id,
    number: data.number,
    seats: data.seats,
    status: data.status,
    reservationTime: data.reservationTime ?? null,
  };
};
