import { Router } from "express";
import { Employee } from "../models/Employee.ts";

export const employeeRouter = Router();

employeeRouter.get("/", async (_request, response) => {
  const employees = await Employee.find().populate("shift");
  response.json(employees);
});
