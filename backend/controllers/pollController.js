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

    if (!options) {
        return res.status(400).json({ message: "No poll options received." });
    }

    // TODO: Ensure options is not empty here.

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
                return res.sendStatus(500);
              });
}

// Update a poll, like its options, question, etc.
// Only if the given poll belongs to the current user.
export const updatePoll = async (req, res) => {

}

// Delete a poll from existence. Only if the given poll
// belongs to the current user.
export const deletePoll = async (req, res) => {

}