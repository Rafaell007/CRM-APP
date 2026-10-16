import { Schema, model } from "mongoose";

const tableSchema = new Schema({
  number: { type: String, required: true, unique: true },
  seats: { type: Number, required: true },
  status: {
    type: String,
    enum: ["free", "reserved", "occupied"],
    required: true,
  },
  reservationTime: { type: Date, default: null },
});

export const Table = model("Table", tableSchema);
