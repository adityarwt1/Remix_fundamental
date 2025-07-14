import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "RemixFundamental",
    });
  } catch (error) {
    console.log((error as Error).message);
  }
};
