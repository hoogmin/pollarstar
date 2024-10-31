export interface IOptionData {
    _id: string,
    text: string,
    votes: number
}

export interface IVoterData {
    _id: string,
    userId: string,
    option: string
}

export interface IOwnerData {
    _id: string,
    username: string
}

export interface IPollData {
    _id: string,
    question: string,
    options: IOptionData[],
    owner: IOwnerData,
    isLocked: boolean,
    voters: IVoterData[],
    createdAt: Date,
    updatedAt: Date
}