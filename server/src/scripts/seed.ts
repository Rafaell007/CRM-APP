import { readFileSync } from "node:fs";
import mongoose, { type Types } from "mongoose";
import { connectDb } from "../config/db.ts";
import { Attendance } from "../models/Attendance.ts";
import { Dish } from "../models/Dish.ts";
import { Employee } from "../models/Employee.ts";
import { Shift } from "../models/Shift.ts";
import { Table } from "../models/Table.ts";
import { User } from "../models/User.ts";

// Every exported document keeps its old Firestore id
type Exported = { id: string } & Record<string, unknown>;

// The JSON is only trusted this far: the Mongoose schemas validate every field on save
const readData = (name: string): Exported[] =>
  JSON.parse(readFileSync(new URL(`./data/${name}.json`, import.meta.url), "utf8"));

const withoutId = ({ id: _oldId, ...data }: Exported) => data;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in server/.env");
}

await connectDb(MONGODB_URI);

await Promise.all([
  Shift.deleteMany({}),
  Employee.deleteMany({}),
  Attendance.deleteMany({}),
  Table.deleteMany({}),
  User.deleteMany({}),
  Dish.deleteMany({}),
]);

// Shifts first: MongoDB gives them new ids, so remember old id → new id
const newShiftIds = new Map<string, Types.ObjectId>();

for (const shift of readData("shifts")) {
  const created = await Shift.create(withoutId(shift));
  newShiftIds.set(shift.id, created._id);
}

const employees = readData("employees").map((employee) => ({
  ...withoutId(employee),
  shiftId: newShiftIds.get(String(employee.shiftId)),
}));

await Employee.insertMany(employees);
await Attendance.insertMany(readData("attendance").map(withoutId));
await Table.insertMany(readData("tables").map(withoutId));
await User.insertMany(readData("users").map(withoutId));
await Dish.insertMany(readData("dishes").map(withoutId));

console.log("Seeded:", {
  shifts: await Shift.countDocuments(),
  employees: await Employee.countDocuments(),
  attendance: await Attendance.countDocuments(),
  tables: await Table.countDocuments(),
  users: await User.countDocuments(),
  dishes: await Dish.countDocuments(),
});

await mongoose.disconnect();
