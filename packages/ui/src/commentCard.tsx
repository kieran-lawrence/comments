import { Button } from './button'
import { FlagIcon } from './icons/flagIcon'
import { ReplyingToIcon } from './icons/replyingToIcon'
import {
    CommentStatus,
    Schema_Comment,
    UpdateCommentStatusProps,
} from '@repo/shared-types'
import { formatDistance } from 'date-fns'
import { LinkIcon } from './icons/linkIcon'
import { ExternalLinkIcon } from './icons/externalLinkIcon'
import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Modal } from './modal'
import { CrossIcon } from './icons/crossIcon'
import { CommentCardSmall } from './commentCardSmall'
import { useQuery } from '@tanstack/react-query'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './dropdownMenu'
import { RichTextComment } from './richTextComment'

export type CommentProps = {
    comment: Schema_Comment
    onCommentReview: (props: UpdateCommentStatusProps) => void
    userId: string
    apiUrl: string
    apiKey: string
}
export const Comment = ({
    comment,
    onCommentReview,
    userId,
    apiKey,
    apiUrl,
}: CommentProps) => {
    const {
        author,
        createdAt,
        parent,
        status,
        reviewedBy,
        flags,
        article,
        content,
    } = comment
    const [showModal, setShowModal] = useState(false)

    const {
        data: thread,
        isLoading,
        refetch: getCommentsInThread,
    } = useQuery({
        queryKey: ['getThreadKey', comment.id],
        queryFn: async (): Promise<Schema_Comment> => {
            const url = `${apiUrl}/comments/${comment.id}/thread`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'x-api-key': apiKey,
                },
            })

            if (!response.ok) {
                throw new Error('Unable to retrieve Comments')
            }

            const res: Schema_Comment = await response.json()
            return res
        },
        enabled: false, // Disable automatic fetching, so we only fetch when the modal is opened
    })

    // Memoize the comment thread to avoid unnecessary recalculations
    const commentThread = useMemo(() => {
        if (!thread || isLoading) return null
        return getCommentThread(thread)
    }, [thread, isLoading])

    // Get the base URL of the current page (i.e. `http://localhost:5173`)
    const BASE_URL = new URL(window.location.href).origin

    // This function handles the click event for the link button
    const handleLinkButtonClick = () => {
        // Get the text element that will change when the link is copied
        const linkText = document.getElementById(`copyLinkText-${comment.id}`)

        // Copy the comment link to the clipboard
        navigator.clipboard.writeText(`${BASE_URL}#commentCard-${comment.id}`)
        if (linkText) {
            // Change the text to 'COPIED'
            linkText.textContent = 'COPIED'

            // Wait 1.5 seconds and change it back to 'COPY LINK'
            setTimeout(() => {
                linkText.textContent = 'COPY LINK'
            }, 1500)
        }
    }

    const handleCommentReview = (props: UpdateCommentStatusProps) => {
        onCommentReview(props)
        // Refetch the thread to ensure we have the latest data after a review action
        getCommentsInThread()
        setShowModal(true) // Keep the modal open after review action
    }

    const handleToggleModal = () => {
        if (!showModal) getCommentsInThread() // Refetch the thread when opening the modal to ensure we have the latest data
        setShowModal((prev) => !prev)
        // Toggle the bodys overflow style to prevent scrolling when the modal is open
        document.body.style.overflow = showModal ? 'visible' : 'hidden'
    }

    const handleUpdateCommentFlag = (
        newStatus: Extract<CommentStatus, 'APPROVED' | 'REJECTED'>,
    ) => {
        const updateProps: UpdateCommentStatusProps = {
            commentId: comment.id,
            status: newStatus,
            userId,
            changedBy: 'STAFF',
        }
        onCommentReview(updateProps)
    }

    return (
        <article
            id={`commentCard-${comment.id}`}
            className="flex flex-col gap-2 w-full py-2 px-4 border border-bg-card-alt bg-bg-card text-text-primary rounded-md textTitleItemSm"
        >
            <div className="flex justify-between commentTop">
                <div className="flex items-center gap-2">
                    <span>{author.name}</span>
                    <span className="text-text-secondary textTitleItemXs lowercase">
                        {formatDistance(new Date(createdAt), new Date(), {
                            addSuffix: true,
                        })}
                    </span>
                    {parent && (
                        <div className="flex items-center gap-1 text-text-secondary textTitleItemXs ml-4">
                            <ReplyingToIcon />
                            <div className="flex gap-0.5">
                                <span>Replying to:</span>
                                <span className="text-text-primary font-bold">
                                    {parent.author.name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className="flex justify-center items-center gap-2 py-1 px-2 cursor-pointer rounded-sm border-1 border-border-primary uppercase transition-colors duration-200 hover:bg-bg-card-alt font-medium"
                    onClick={handleLinkButtonClick}
                >
                    <LinkIcon size={18} />
                    <span id={`copyLinkText-${comment.id}`}>Copy Link</span>
                </button>
            </div>
            {status === 'FLAGGED' && (
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-bg-card-alt transition-colors duration-200 p-1 rounded-md w-fit">
                        <FlagIcon />
                        <div className="flex items-center gap-0.5 px-1 textTitleItemXs cursor-pointer">
                            <span className="font-medium">Flagged by:</span>
                            <span className="text-text-secondary">
                                {comment.flaggedCount > 1 ? (
                                    <b className="font-semibold">
                                        {comment.flaggedCount} users
                                    </b>
                                ) : (
                                    (flags?.[0]?.user?.name ?? 'System')
                                )}
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-bg-card text-text-primary">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border-primary/30" />
                        <DropdownMenuItem
                            className="cursor-pointer hover:bg-bg-card-alt transition-colors duration-200"
                            onClick={() => handleUpdateCommentFlag('APPROVED')}
                        >
                            Remove flag and approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer hover:bg-bg-card-alt transition-colors duration-200"
                            onClick={() => handleUpdateCommentFlag('REJECTED')}
                        >
                            Remove flag and reject
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            <h2 className="text-text-primary textTitleItemSm hover:text-text-primary/50 transition-colors duration-200 underline capitalize font-semibold">
                <Link
                    to={`/articles`}
                    hash={`articleCard-${article.articleId}`}
                    search={{
                        expanded: true,
                        focusArticleId: article.articleId,
                    }}
                >
                    {article.articleTitle}
                </Link>
            </h2>
            <RichTextComment value={JSON.parse(content)} />
            <div className="flex gap-3">
                <Button
                    onClick={() =>
                        onCommentReview({
                            commentId: comment.id,
                            status: 'APPROVED',
                            userId,
                            changedBy: 'STAFF',
                        })
                    }
                    status={comment.status}
                    type="approve"
                />
                <Button
                    onClick={() =>
                        onCommentReview({
                            commentId: comment.id,
                            status: 'REJECTED',
                            userId,
                            changedBy: 'STAFF',
                        })
                    }
                    status={comment.status}
                    type="reject"
                />
                {reviewedBy && (
                    <div className="flex flex-col justify-center gap-1 textTitleItemSm leading-5">
                        <span>Reviewed by:</span>
                        <span className="text-text-secondary font-normal">
                            {reviewedBy.name}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex gap-4">
                <button className="commentLink" onClick={handleToggleModal}>
                    View Thread
                </button>
                <span className="flex items-center gap-1 commentLink">
                    {/* TODO: This anchor won't work until we integrate it onto the frontend site where comments are displayed */}
                    <a
                        href={`${comment.article.articleUrl}/comments?focusCommentId=${comment.id}`}
                        target="_blank"
                    >
                        View In Article
                    </a>
                    <ExternalLinkIcon size={18} />
                </span>
            </div>
            {showModal && commentThread && (
                <Modal onClose={handleToggleModal}>
                    <div className="max-w-1/2 h-auto bg-bg-card rounded-md text-text-primary px-4 py-3 drop-shadow-lg">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="textTitleItemLg font-semibold">
                                {article.articleTitle}
                            </h2>
                            <button
                                className="flex items-center justify-center aspect-square p-1 h-6 cursor-pointer hover:text-text-primary/50 transition-colors duration-200"
                                onClick={handleToggleModal}
                            >
                                <CrossIcon />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                            <h3 className="textTitleItemMd text-text-secondary font-medium">
                                Comment Thread
                            </h3>
                            <div className="flex flex-col gap-2 border-l-2 border-border-secondary pl-2">
                                {/* Render the first comment from the array, this will always be the topmost parent comment */}
                                {commentThread[0] && (
                                    <CommentCardSmall
                                        key={commentThread[0].id}
                                        comment={commentThread[0]}
                                        onCommentReview={onCommentReview}
                                        userId={userId}
                                    />
                                )}
                                {/* Render the rest of the comments, these will always be replies */}
                                {commentThread.length > 1 && (
                                    <div className="flex flex-col gap-2 border-l-2 border-border-secondary pl-2">
                                        {commentThread.slice(1).map((reply) => (
                                            <CommentCardSmall
                                                key={reply.id}
                                                comment={reply}
                                                onCommentReview={
                                                    handleCommentReview
                                                }
                                                userId={userId}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </article>
    )
}

/**
 * Returns a flat array of all comments in the thread,
 * Starting from the root comment and including all replies at any depth. (The API has a hard limit in place so it's safe to not include a max depth)
 */
const getCommentThread = (rootComment: Schema_Comment): Schema_Comment[] => {
    // Stores all comments in the thread, including replies and their replies
    const allComments: Schema_Comment[] = []
    // Recursively collect all comments in the tree (all replies, and replies to replies, etc.)
    const collectAll = (comment: Schema_Comment) => {
        allComments.push(comment)
        if (comment.replies.length > 0) {
            comment.replies.forEach(collectAll)
        }
    }
    collectAll(rootComment)

    return allComments
}
