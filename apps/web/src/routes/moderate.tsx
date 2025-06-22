import { Comment, PageLayout } from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getComments, updateCommentStatus } from '../services/api'
import { UpdateCommentStatusProps } from '@repo/shared-types'

export const Route = createFileRoute('/moderate')({
    component: ModeratePage,
})

function ModeratePage() {
    const {
        data: comments,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['getCommentsKey'],
        queryFn: getComments,
    })

    // TODO: Add loading and error states
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !comments) {
        return <div>Error loading comments</div>
    }
    /** Function to handle comment review actions
     * @param props - The properties for updating the comment status
     * @returns {Promise<Schema_Comment>} - A promise that resolves when the comment status is updated
     */
    const handleCommentReview = async (props: UpdateCommentStatusProps) => {
        await updateCommentStatus(props)
        // Refetch comments to update the UI after a status change
        refetch()
    }
    return (
        <PageLayout
            sidebar={<>Sidebar</>}
            mainContent={
                <div className="flex flex-col gap-4">
                    {comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            onCommentReview={handleCommentReview}
                        />
                    ))}
                </div>
            }
        />
    )
}
