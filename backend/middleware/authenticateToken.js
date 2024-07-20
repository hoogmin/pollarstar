import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

export const authenticateAccessToken = (req, res, next) => {
    // EXAMPLE: Authorization: Bearer <TOKEN>
    const authHeader = req.headers["Authorization"];
    const token = authHeader?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
}

export const authenticateRefreshToken = (req, res, next) => {
    const authHeader = req.headers["Authorization"];
    const token = authHeader?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        req.refreshToken = token;
        next();
    });
}