import { Router } from "express";
import { Table } from "../models/Table.ts";

export const tableRouter = Router();

tableRouter.get("/", async (_request, response) => {
  const tables = await Table.find();
  response.json(tables);
});
