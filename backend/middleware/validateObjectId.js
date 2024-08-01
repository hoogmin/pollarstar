import { isValidObjectId } from "mongoose";

export const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.sendStatus(400);
    }

    next();
}