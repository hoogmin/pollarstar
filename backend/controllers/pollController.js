import { isValidObjectId } from "mongoose";
import Poll from "../models/Poll.js";

// Get a given poll's information based on the id param
// and return it as JSON.
export const getPoll = async (req, res) => {
    const pollId = req.params.id;
    let foundPoll;

    try {
        foundPoll = await Poll.findOne({
            _id: pollId
        });
    } catch (error) {
        console.error(`Error fetching poll with id ${pollId}: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!foundPoll) {
        return res.status(404).json({ message: "Poll not found." });
    }

    return res.status(200).json(foundPoll);
}

// Create a new poll belonging to the current user using
// data from the body of the request.
export const createNewPoll = async (req, res) => {
    const {
        question,
        options
    } = req.body;

    if (!question) {
        return res.status(400).json({ message: "No poll question received." });
    }

    if (!options || !Array.isArray(options)) {
        return res.status(400).json({ message: "Invalid poll options format." });
    }

    if (options.length <= 0) {
        return res.status(400).json({ message: "No poll options received." });
    }

    const newPollData = {
        question,
        options,
        owner: req.user.id
    };

    await Poll.create(newPollData)
              .then((poll) => {
                console.log(`Poll ${poll._id} created successfully.`);
                return res.status(200).json(poll);
              })
              .catch((error) => {
                console.error(`Error creating new poll: ${error}`);
                return res.status(500).json({ message: "Poll creation error, remember that options must be formatted correctly." });
              });
}

// Update a poll, like its options, question, etc.
// Only if the given poll belongs to the current user.
export const updatePoll = async (req, res) => {
    const {
        question,
        options
    } = req.body;

    const pollId = req.params.id;
    const currentUser = req.user.id;
    let foundPoll;
    
    if (!question || !typeof question === "string") {
        return res.status(400).json({ message: "No poll question received." });
    }

    if (!options || !Array.isArray(options)) {
        return res.status(400).json({ message: "Invalid poll options format." });
    }

    if (options.length <= 0) {
        return res.status(400).json({ message: "No poll options received." });
    }

    try {
        foundPoll = await Poll.findById(pollId);
    } catch (error) {
        console.error(`Error fetching poll to lock: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!foundPoll) {
        return res.status(404).json({ message: `Poll ${pollId} not found.` });
    }

    if (foundPoll.owner.toString() !== currentUser) {
        return res.status(403).json({ message: "User does not own poll." });
    }

    if (foundPoll.isLocked) {
        return res.status(405).json({ message: "Poll is locked, thereby disallowing modifications. Unlock to allow this operation." });
    }

    // Validate question is non-empty and iterate options array
    // to validate it.

    const existingOptions = new Map(foundPoll.options.map(option => [option._id.toString(), option]));

    if (question.length <= 0) {
        return res.status(400).json({ message: "Question cannot be empty." });
    }

    const updatedOptions = options.map((newOption) => {
        if (newOption._id && existingOptions.has(newOption._id)) {
            // Update existing option
            const existingOption = existingOptions.get(newOption._id);
            existingOption.text = newOption.text || existingOption.text;

            return existingOption;
        }
        else {
            // Add new option (mongoose will generate _id if not provided)
            newOption.votes = 0;
            return newOption;
        }
    });

    foundPoll.question = question;
    foundPoll.options = updatedOptions;

    await foundPoll.save()
                .then((poll) => {
                    console.log(`Poll ${poll._id} updated.`);
                    return res.status(200).json(poll);
                })
                .catch((error) => {
                    console.log(`Error updating poll: ${error}`);
                    return res.status(500).json({ message: "Failed to update poll." });
                });
}

// Vote in a poll for a specific option in said poll.
export const votePoll = async (req, res) => {
    const optionId = req.body.optionId;
    const pollId = req.params.id;
    const currentUser = req.user.id;
    let foundPoll;

    if (!optionId || 
        typeof optionId !== "string" ||
        !isValidObjectId(optionId)) {
        return res.status(400).json({ message: "Invalid optionId." });
    }

    try {
        foundPoll = await Poll.findById(pollId);
    } catch (error) {
        console.error(`Error fetching poll to vote on: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!foundPoll) {
        return res.status(404).json({ message: `Poll ${pollId} not found.` });
    }

    // Check if the user is present in the voters array.
    // if so, set their vote to the option they want. This may
    // be different or the same if they already voted but what matters
    // is that they only appear in the array once. We also need to ensure
    // that the option they want to vote for exists.
    const hasOption = foundPoll.options.some(option => option._id.toString() === optionId);
    const hasVoter = foundPoll.voters.some(voter => voter.userId.toString() === currentUser);

    if (!hasOption) {
        return res.status(400).json({ message: `Poll has no option ${optionId}`});
    }

    if (hasVoter) {
        // If the voter is already in the array,
        // simply update their selected option to match the new one.
        foundPoll.voters.find(voter => voter.userId.toString() === currentUser).option = optionId;
    } else {
        const newVoter = {
            userId: currentUser,
            option: optionId
        }

        foundPoll.voters.push(newVoter);
    }

    await foundPoll.save()
                .then((poll) => {
                    console.log(`Poll ${poll._id} voted+saved.`);
                    return res.status(200).json({ message: "Poll voted+saved successfully." });
                })
                .catch((error) => {
                    console.error(`Error saving poll: ${error}`);
                    return res.status(500).json({ message: "Failed to save poll." });
                });
}

// Clear user vote from the current poll, making it such that
// they haven't voted yet.
export const voteClearPoll = async (req, res) => {
    const pollId = req.params.id;
    const currentUser = req.user.id;
    let updatedPoll;

    try {
        updatedPoll = await Poll.findByIdAndUpdate(
        pollId,
        {
            $pull: { voters: { userId: currentUser } }
        },
        { new: true }); // Return the updated document
    } catch (error) {
        console.error(`Error removing vote from poll: ${error}`);
        return res.status(500).json({ message: "Failed to clear vote on poll." });
    }

    if (!updatedPoll) {
        return res.status(404).json({ message: "Poll or voter not found." });
    }

    return res.sendStatus(200);
}

// Lock a poll to prevent changes to it. Only the owner can
// carry out this operation.
export const lockPoll = async (req, res) => {
    const pollId = req.params.id;
    const currentUser = req.user.id;
    let foundPoll;

    try {
        foundPoll = await Poll.findById(pollId);
    } catch (error) {
        console.error(`Error fetching poll to lock: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!foundPoll) {
        return res.status(404).json({ message: `Poll ${pollId} not found.` });
    }

    
    if (foundPoll.owner.toString() !== currentUser) {
        return res.status(403).json({ message: "User does not own poll." });
    }

    // Check if the poll is already locked, if so
    // there is no need to re-save.
    if (foundPoll.isLocked) {
        return res.status(200).json({ message: "Poll locked successfully" });
    }

    foundPoll.isLocked = true;
    await foundPoll.save()
                .then((poll) => {
                    console.log(`Poll ${poll._id} locked.`);
                    return res.status(200).json({ message: "Poll locked successfully." });
                })
                .catch((error) => {
                    console.error(`Error locking poll: ${error}`);
                    return res.status(500).json({ message: "Failed to lock poll." });
                });
}

// Unlock a poll to allow subsequent changes to it. Only the owner can
// carry out this operation.
export const unlockPoll = async (req, res) => {
    const pollId = req.params.id;
    const currentUser = req.user.id;
    let foundPoll;

    try {
        foundPoll = await Poll.findById(pollId);
    } catch (error) {
        console.error(`Error fetching poll to unlock: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!foundPoll) {
        return res.status(404).json({ message: `Poll ${pollId} not found.` });
    }

    
    if (foundPoll.owner.toString() !== currentUser) {
        return res.status(403).json({ message: "User does not own poll." });
    }

    // Check if the poll is already unlocked, if so
    // there is no need to re-save.
    if (!foundPoll.isLocked) {
        return res.status(200).json({ message: "Poll unlocked successfully" });
    }

    foundPoll.isLocked = false;
    await foundPoll.save()
                .then((poll) => {
                    console.log(`Poll ${poll._id} unlocked.`);
                    return res.status(200).json({ message: "Poll unlocked successfully." });
                })
                .catch((error) => {
                    console.error(`Error unlocking poll: ${error}`);
                    return res.status(500).json({ message: "Failed to unlock poll." });
                });
}

// Delete a poll from existence. Only if the given poll
// belongs to the current user.
export const deletePoll = async (req, res) => {
    const pollId = req.params.id;
    const currentUser = req.user.id;
    let foundPoll;

    try {
        foundPoll = await Poll.findById(pollId);
    } catch (error) {
        console.error(`Error fetching poll to delete: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!foundPoll) {
        return res.status(404).json({ message: `Poll ${pollId} not found.` });
    }

    
    if (foundPoll.owner.toString() !== currentUser) {
        return res.status(403).json({ message: "User does not own poll." });
    }

    // Check if the poll is already deleted, if so
    // there is no need to re-save.
    if (foundPoll.deleted) {
        return res.status(200).json({ message: "Poll deleted successfully" });
    }

    // We do a soft-delete, so just set the flag and re-save.
    foundPoll.deleted = true;
    await foundPoll.save()
                .then((poll) => {
                    console.log(`Poll ${poll._id} soft-deleted.`);
                    return res.status(200).json({ message: "Poll deleted successfully." });
                })
                .catch((error) => {
                    console.error(`Error deleting poll: ${error}`);
                    return res.status(500).json({ message: "Failed to delete poll" });
                });
}