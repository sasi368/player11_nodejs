import { mongoose } from "../services/mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB, {});
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export { connectDB };
