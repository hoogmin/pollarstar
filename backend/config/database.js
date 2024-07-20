import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const dbURI = process.env.MONGO_URI;

const connectDB = async () => {
    mongoose.connect(dbURI)
    .then(() => console.log("Connected to MongoDB."))
    .catch((error) => console.error(`MongoDB connection error: ${error}`));
}

export {
    connectDB,
    mongoose
}