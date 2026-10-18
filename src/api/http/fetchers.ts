import { apiFetch } from "./client";
import type { Attendance, Employee, Shift, Table } from "../../types/models";

export const fetchShifts = () => apiFetch<Shift[]>("/shifts");

export const fetchEmployees = () => apiFetch<Employee[]>("/employees");

export const fetchAttendance = () => apiFetch<Attendance[]>("/attendance");

export const fetchTables = () => apiFetch<Table[]>("/tables");
