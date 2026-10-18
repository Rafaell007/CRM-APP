import { queryOptions } from "@tanstack/react-query";
import {
  fetchAttendance,
  fetchEmployees,
  fetchShifts,
  fetchTables,
} from "./http/fetchers";

export const shiftsQuery = queryOptions({
  queryKey: ["shifts"],
  queryFn: fetchShifts,
});

export const employeesQuery = queryOptions({
  queryKey: ["employees"],
  queryFn: fetchEmployees,
});

export const attendanceQuery = queryOptions({
  queryKey: ["attendance"],
  queryFn: fetchAttendance,
});

export const tablesQuery = queryOptions({
  queryKey: ["tables"],
  queryFn: fetchTables,
});
