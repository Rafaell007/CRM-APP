import { Schema, model } from "mongoose";

const shiftSchema = new Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

export const Shift = model("Shift", shiftSchema);
