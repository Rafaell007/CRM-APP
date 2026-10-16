import {  Router } from "express";

export const shiftRouter = Router();

const shifts = [
  { id: "1", name: "A", startTime: "08:00", endTime: "16:00" },
  { id: "2", name: "B", startTime: "16:00", endTime: "00:00" },
];

shiftRouter.get("/", (_request, response)=>{
    response.json(shifts); 
});

shiftRouter.get("/:id", (request, response)=> {
    const shift = shifts.find((item)=> item.id === request.params.id);

    if(!shift){
        response.status(404).json({message: "Shift not found"});
        return;
    }

    response.json(shift);
});