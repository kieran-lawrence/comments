import {
    Comment,
    Filter,
    Search,
    LoadingOverlay,
    PageLayout,
    ErrorComponent,
} from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getComments, updateCommentStatus } from '../services/api'
import { UpdateCommentStatusProps } from '@repo/shared-types'

export const Route = createFileRoute('/_auth/moderate')({
    component: ModeratePage,
    errorComponent: ({ error }) => (
        <ErrorComponent
            message={error.message}
            details={error.cause as string}
        />
    ),
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

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (isError || !comments) {
        throw new Error(
            `Encountered an issue while fetching comments data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getComments on /moderate route',
            },
        )
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
            sidebar={
                <div className="flex flex-col items-left gap-6">
                    <Search placeholder="Search by article or user name" />
                    <Filter
                        filterTitle="Comment Status"
                        filterCount={{
                            All: 3,
                            'Pending Review': 3,
                            Approved: undefined,
                            Rejected: undefined,
                        }}
                        activeItem="Pending Review"
                    />
                    <Filter
                        filterTitle="Changed By"
                        filterCount={{
                            All: undefined,
                            System: undefined,
                            Staff: undefined,
                            Community: undefined,
                        }}
                        activeItem="All"
                    />
                    <Filter
                        filterTitle="Sort"
                        filterCount={{
                            'Newest First': undefined,
                            'Oldest First': undefined,
                        }}
                        activeItem="Newest First"
                    />
                </div>
            }
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
