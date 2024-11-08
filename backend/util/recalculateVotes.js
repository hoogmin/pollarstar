/**
 * Recalculate votes for each option in a poll.
 * @param {Object} poll - The poll document (instance of Poll model).
 */
export function recalculateVotes(poll) {
    poll.options.forEach(option => {
        option.votes = 0;
    });

    poll.voters.forEach(voter => {
        const option = poll.options.find(opt => opt._id.equals(voter.option));
        
        if (option) {
            option.votes += 1;
        }
    });

    poll.markModified("options");
}