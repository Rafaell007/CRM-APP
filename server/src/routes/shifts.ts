import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { Shift } from "../models/Shift.ts";

export const shiftRouter = Router();

shiftRouter.get("/", async (_request, response) => {
  const shifts = await Shift.find();
  response.json(shifts);
});

shiftRouter.get("/:id", async (request, response) => {
  const { id } = request.params;
  const shift = isValidObjectId(id) ? await Shift.findById(id) : null;

  if (!shift) {
    response.status(404).json({ message: "Shift not found" });
    return;
  }

  response.json(shift);
});
