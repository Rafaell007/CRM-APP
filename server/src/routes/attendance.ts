import {  Router } from "express";
import { Attendance } from "../models/Attendance.ts";


export const attendanceRouter = Router();

attendanceRouter.get("/", async (_request, response)=>{
   const attendance = await Attendance.find();
   response.json(attendance)
})