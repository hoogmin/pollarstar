import express from "express";
import * as pollController from "../controllers/pollController.js";
import { authenticateAccessToken } from "../middleware/authenticateToken.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/poll/:id", validateObjectId, pollController.getPoll);
router.post("/poll", authenticateAccessToken, pollController.createNewPoll);
router.put("/poll/:id", authenticateAccessToken, validateObjectId, pollController.updatePoll);
router.patch("/poll/:id/lock", authenticateAccessToken, validateObjectId, pollController.lockPoll);
router.patch("/poll/:id/unlock", authenticateAccessToken, validateObjectId, pollController.unlockPoll);
router.patch("/poll/:id/vote", authenticateAccessToken, validateObjectId, pollController.votePoll);
router.delete("/poll/:id", authenticateAccessToken, validateObjectId, pollController.deletePoll);

export default router;