import mongoose from "mongoose";

export async function connectMongo() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL;
  await mongoose.connect(uri as string);
  console.log("MongoDB connected");
}
