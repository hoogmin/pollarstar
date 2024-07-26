import express from "express";
import * as pollController from "../controllers/pollController.js";
import { authenticateAccessToken } from "../middleware/authenticateToken";

const router = express.Router();

// TODO: CRUD for polls here...

export default router;