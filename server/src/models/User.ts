import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  role: { type: String, enum: ["admin", "waiter"], required: true },
  passwordHash: { type: String, required: true, select: false },
});

export const User = model("User", userSchema);
