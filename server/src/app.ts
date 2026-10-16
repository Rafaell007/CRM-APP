import express from "express";
import { shiftRouter } from "./routes/shifts.ts";
import { employeeRouter } from "./routes/employees.ts";
import { attendanceRouter } from "./routes/attendance.ts";
import { tableRouter } from "./routes/tables.ts";

export const app = express();

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/shifts", shiftRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/tables", tableRouter);
