import { Schema, model } from "mongoose";

const employeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
  shiftId: { type: Schema.Types.ObjectId, ref: "Shift" },
  employmentDate: { type: Date, required: true },
  billingDate: { type: Date, required: true },
});

employeeSchema.virtual("shift", {
  ref: "Shift",
  localField: "shiftId",
  foreignField: "_id",
  justOne: true,
});

export const Employee = model("Employee", employeeSchema);
