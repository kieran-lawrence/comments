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
import {
    CommentFilterOptions,
    SortOptions,
    UpdateCommentStatusProps,
} from '@repo/shared-types'
import { useState, useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { searchComments, sortComments } from '../utils/helpers'

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
    const { user, isLoading: authLoading } = useAuth0()

    const [commentFilter, setCommentFilter] =
        useState<CommentFilterOptions>('PENDING REVIEW')
    const [sort, setSort] = useState<SortOptions>('Newest First')
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch comments with statuses as query params
    const {
        data: comments,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['getCommentsKey', commentFilter, sort],
        queryFn: () => getComments(commentFilter),
    })

    const searchFilteredComments = useMemo(() => {
        if (!comments) return null
        const sortedComments = sortComments(comments, sort)

        if (!searchTerm) return sortedComments
        return searchComments(sortedComments, searchTerm)
    }, [comments, searchTerm, sort])

    if (isLoading || authLoading) {
        return <LoadingOverlay />
    }
    if (isError || !searchFilteredComments) {
        throw new Error(
            `Encountered an issue while fetching comments data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getComments on /moderate route',
            },
        )
    }

    if (!user || !user.sub) {
        throw new Error(
            `Encountered an issue while fetching user information.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'No user returned from Auth0 on /moderate route',
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
                    <Search
                        placeholder="Search by article or user name"
                        onSearch={setSearchTerm}
                    />
                    <Filter<CommentFilterOptions>
                        filterTitle="Comment Status"
                        filterOptions={[
                            'ALL',
                            'PENDING REVIEW',
                            'APPROVED',
                            'REJECTED',
                        ]}
                        activeItem={commentFilter}
                        onClick={setCommentFilter}
                    />
                    <Filter<SortOptions>
                        filterTitle="Sort"
                        filterOptions={['Newest First', 'Oldest First']}
                        activeItem={sort}
                        onClick={setSort}
                    />
                </div>
            }
            mainContent={
                <div className="flex flex-col gap-4">
                    {searchFilteredComments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            onCommentReview={handleCommentReview}
                            userId={user.sub!}
                        />
                    ))}
                </div>
            }
        />
    )
}
