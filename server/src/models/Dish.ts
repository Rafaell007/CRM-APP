import { Schema, model } from "mongoose";

const dishSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["appetizer", "main", "dessert", "drinks"],
    required: true,
  },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

export const Dish = model("Dish", dishSchema);
