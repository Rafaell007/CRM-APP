import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "../app.ts";
import { connectDb } from "../config/db.ts";
import { Attendance } from "../models/Attendance.ts";
import { Employee } from "../models/Employee.ts";
import { Shift } from "../models/Shift.ts";
import { Table } from "../models/Table.ts";
import { User } from "../models/User.ts";

export const TEST_PASSWORD = "test-password";
export const ADMIN_EMAIL = "admin@test.com";
export const WAITER_EMAIL = "waiter@test.com";

let mongoServer: MongoMemoryServer;

export const startTestDb = async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDb(mongoServer.getUri());
};

export const stopTestDb = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const seedTestData = async () => {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 4);
  const shift = await Shift.create({ name: "A", startTime: "06:00", endTime: "14:00" });

  await Employee.create({
    name: "Zoe Reed",
    email: "zoe@test.com",
    avatar: "https://example.com/zoe.png",
    shiftId: shift._id,
    employmentDate: new Date("2021-03-25"),
    billingDate: new Date("2023-01-13"),
  });
  await Attendance.create({ month: "2026-01", year: 2026, monthIndex: 0, hours: 160, absences: 2 });
  await Table.create({ number: "1", seats: 4, status: "free" });
  await User.create([
    { email: ADMIN_EMAIL, displayName: "Admin User", role: "admin", passwordHash },
    { email: WAITER_EMAIL, displayName: "Waiter User", role: "waiter", passwordHash },
  ]);

  return { shiftId: shift.id };
};

export const loginAs = async (email: string) => {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password: TEST_PASSWORD }).expect(200);
  return agent;
};
