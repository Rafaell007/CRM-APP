import type { Attendance, Employee } from "../types/models";

// Build a full, valid object; each test only overrides the fields it cares about

export const makeEmployee = (overrides: Partial<Employee> = {}): Employee => ({
  id: "0",
  name: "Test Person",
  email: "test@restcrm.com",
  avatar: "",
  shiftId: "",
  employmentDate: "2024-09-07",
  billingDate: "2024-09-07",
  ...overrides,
});

export const makeAttendance = (overrides: Partial<Attendance> = {}): Attendance => ({
  id: "0",
  year: 2026,
  monthIndex: 0,
  month: "January",
  hours: 0,
  absences: 0,
  ...overrides,
});
