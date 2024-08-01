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
        return res.sendStatus(500);
    }

    if (!foundPoll) {
        return res.sendStatus(404);
    }

    return res.status(200).json(foundPoll);
}

// Create a new poll belonging to the current user.
export const createNewPoll = async (req, res) => {

}

// Update a poll, like its options, question, etc.
// Only if the given poll belongs to the current user.
export const updatePoll = async (req, res) => {

}

// Delete a poll from existence. Only if the given poll
// belongs to the current user.
export const deletePoll = async (req, res) => {

}