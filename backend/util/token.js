import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import RefreshToken from "../models/RefreshToken.js";

configDotenv();

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET);
    const currentUTC = new Date();
    const monthFromNow = new Date(currentUTC);
    monthFromNow.setUTCDate(currentUTC.getUTCDate() + 30);

    // Store token in the database and return it.
    try {
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: monthFromNow
        });
    } catch (error) {
        throw error;
    }

    return refreshToken;
}