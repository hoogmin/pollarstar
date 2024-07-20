import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    }
});

const voterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    option: {
        type: String,
        required: true
    }
});

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [optionSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    voters: [voterSchema]
}, { timestamps: true });

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;