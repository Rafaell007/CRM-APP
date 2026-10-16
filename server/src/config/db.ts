import mongoose from "mongoose";

export const connectDb = async (uri: string) => {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};