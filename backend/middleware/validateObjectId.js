import { isValidObjectId } from "mongoose";

export const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID." });
    }

    next();
}