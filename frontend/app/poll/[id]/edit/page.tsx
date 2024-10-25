"use client"

const EditPollPage = ({ params }: { params: { id: string } }) => {
    const { id } = params

    return (
        <div>Edit Poll: {id}</div>
    )
}

export default EditPollPage