import mongoose from "mongoose";

mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_document, { _id, ...json }) => json,
});

export const connectDb = async (uri: string) => {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};
