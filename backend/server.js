import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";

configDotenv();

const corsOptions = {
    origin: "http://localhost:8080", // Frontend origin
    credentials: true, // Allow credentials (cookies)
};

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", userRoutes, pollRoutes);

app.get("/", (req, res) => {
    res.send("PollarStar API Root.");
});

app.listen(port, () => {
    console.log(`[server]: running on port ${port}`);
});