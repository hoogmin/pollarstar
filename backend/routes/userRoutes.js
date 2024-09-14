import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateAccessToken, authenticateRefreshToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/user/login", userController.loginUser);
router.get("/user/me", authenticateAccessToken, userController.fetchUserInfo);
router.get("/user/refresh", authenticateRefreshToken, userController.refreshUserAccess);
router.post("/user", userController.createUser);
router.delete("/user", authenticateAccessToken, userController.deleteUser);
router.delete("/user/logout", authenticateAccessToken, userController.logoutUser);

export default router;