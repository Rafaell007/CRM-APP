import { Schema, model } from "mongoose";

const attendanceSchema = new Schema({
  month: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  monthIndex: { type: Number, required: true, min: 0, max: 11 },
  hours: { type: Number, required: true },
  absences: { type: Number, required: true },
});

export const Attendance = model("Attendance", attendanceSchema, "attendance");
