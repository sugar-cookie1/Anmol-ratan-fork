import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    if (conn.connection.readyState === 1) {
      console.log("MongoDB connected:", conn.connection.host);
    } else {
      console.error("MongoDB connection state:", conn.connection.readyState);
      process.exit(1);
    }

  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
