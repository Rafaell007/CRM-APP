import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.ts";
import { shiftRouter } from "./routes/shifts.ts";
import { employeeRouter } from "./routes/employees.ts";
import { attendanceRouter } from "./routes/attendance.ts";
import { tableRouter } from "./routes/tables.ts";
import { notFound } from "./middleware/notFound.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/shifts", shiftRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/tables", tableRouter);
app.use("/api/auth", authRouter);

app.use("/api", notFound);
app.use(errorHandler);
