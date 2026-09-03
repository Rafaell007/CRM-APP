import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const toPlain = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value instanceof Timestamp ? value.toDate().toISOString() : value,
    ]),
  );

export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Table", "Employees", "Shifts"],
  endpoints: (builder) => ({
    getTables: builder.query({
      async queryFn() {
        try {
          const snap = await getDocs(collection(db, "tables"));
          const tables = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          return { data: tables };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: ["Table"],
    }),
    getEmployees: builder.query({
      async queryFn() {
        try {
          const snap = await getDocs(collection(db, "employees"));
          const shiftsSnapshot = await getDocs(collection(db, "shifts"));
          const shifts = shiftsSnapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }));
          const shiftsById = new Map(shifts.map((shift) => [shift.id, shift]));
          const employees = snap.docs.map((d) => {
            const data = toPlain(d.data());
            return {
              ...data,
              id: d.id,
              shift: shiftsById.get(data.shiftId),
            };
          });
          return { data: employees };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: ["Employees"],
    }),
    getShifts: builder.query({
      async queryFn() {
        try {
          const snapshot = await getDocs(collection(db, "shifts"));
          const shifts = snapshot.docs.map((document) => ({
            ...document.data(),
            id: document.id,
          }));
          return { data: shifts };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: ["Shifts"],
    }),
  }),
});

export const { useGetTablesQuery, useGetEmployeesQuery, useGetShiftsQuery } =
  api;
