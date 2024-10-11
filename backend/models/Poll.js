import mongoose from "mongoose";

// TODO: Reconsider whether votes need to be tracked here.
const optionSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
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
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [optionSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    voters: [voterSchema]
}, { timestamps: true });

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;