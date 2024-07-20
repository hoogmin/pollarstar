import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";

configDotenv();

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
    res.send("PollarStar API Root.");
});

app.listen(port, () => {
    console.log(`[server]: running on port ${port}`);
});