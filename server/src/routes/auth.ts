import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.ts";

export const authRouter = Router();

authRouter.post("/login", async (request, response) => {
  const { email, password } = request.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    response.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await User.findOne({ email }).select("+passwordHash");
  const isPasswordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !isPasswordCorrect) {
    response.status(401).json({ message: "Wrong email or password" });
    return;
  }

  response.json({ id: user.id, email: user.email, displayName: user.displayName, role: user.role });
});