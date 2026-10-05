import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { toAttendance, toEmployee, toShift, toTable } from "./firestoreMappers";
import { getErrorMessage } from "../utils/getErrorMessage";
import type { Attendance, Employee, Shift, Table } from "../types/models";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ["Table", "Employees", "Shifts", "Attendance"],
  endpoints: (builder) => ({
    
    getTables: builder.query<Table[], void>({
      async queryFn() {
        try {
          const snapshot = await getDocs(collection(db, "tables"));
          return { data: snapshot.docs.map(toTable) };
        } catch (error) {
          return { error: { message: getErrorMessage(error) } };
        }
      },
      providesTags: ["Table"],
    }),

    getEmployees: builder.query<Employee[], void>({
      async queryFn() {
        try {
          const [employeesSnapshot, shiftsSnapshot] = await Promise.all([
            getDocs(collection(db, "employees")),
            getDocs(collection(db, "shifts")),
          ]);
          const shifts = shiftsSnapshot.docs.map(toShift);
          const shiftsById = new Map(shifts.map((shift) => [shift.id, shift]));
          const employees = employeesSnapshot.docs.map((document) =>
            toEmployee(document, shiftsById),
          );
          return { data: employees };
        } catch (error) {
          return { error: { message: getErrorMessage(error) } };
        }
      },
      providesTags: ["Employees"],
    }),

    getShifts: builder.query<Shift[], void>({
      async queryFn() {
        try {
          const snapshot = await getDocs(collection(db, "shifts"));
          return { data: snapshot.docs.map(toShift) };
        } catch (error) {
          return { error: { message: getErrorMessage(error) } };
        }
      },
      providesTags: ["Shifts"],
    }),

    getAttendance: builder.query<Attendance[], void>({
      async queryFn() {
        try {
          const snapshot = await getDocs(collection(db, "attendance"));
          return { data: snapshot.docs.map(toAttendance) };
        } catch (error) {
          return { error: { message: getErrorMessage(error) } };
        }
      },
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetTablesQuery,
  useGetEmployeesQuery,
  useGetShiftsQuery,
  useGetAttendanceQuery,
} = api;
