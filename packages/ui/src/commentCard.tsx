import './styles/commentCard.css'
import { Button } from './button'
import { FlagIcon } from './icons/flagIcon'
import { ReplyingToIcon } from './icons/replyingToIcon'
import { Schema_Comment, UpdateCommentStatusProps } from '@repo/shared-types'
import { formatDistance } from 'date-fns'
import { LinkIcon } from './icons/linkIcon'
import { ExternalLinkIcon } from './icons/externalLinkIcon'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Modal } from './modal'
import { CrossIcon } from './icons/crossIcon'
import { CommentCardSmall } from './commentCardSmall'

type CommentProps = {
    comment: Schema_Comment
    onCommentReview: (props: UpdateCommentStatusProps) => Promise<void>
    userId: string
}
export const Comment = ({ comment, onCommentReview, userId }: CommentProps) => {
    const {
        author,
        createdAt,
        parent,
        status,
        reviewedBy,
        flaggedBy,
        article,
        content,
    } = comment
    const [showModal, setShowModal] = useState(false)

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

    const handleToggleModal = () => {
        setShowModal((prev) => !prev)
        // Toggle the bodys overflow style to prevent scrolling when the modal is open
        document.body.style.overflow = showModal ? 'visible' : 'hidden'
    }

    return (
        <article id={`commentCard-${comment.id}`} className="commentContainer">
            <div className="commentTop">
                <div>
                    <span>{author.name}</span>
                    <span className="commentDate">
                        {formatDistance(new Date(createdAt), new Date(), {
                            addSuffix: true,
                        })}
                    </span>
                    {parent && (
                        <div className="commentReply">
                            <ReplyingToIcon />
                            <div className="commentReplyLabel">
                                <span>Replying to:</span>
                                <span className="commentReplyUser">
                                    {parent.author.name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className="rounded-sm border-1 border-border-primary"
                    onClick={handleLinkButtonClick}
                >
                    <LinkIcon />
                    <span id={`copyLinkText-${comment.id}`}>Copy Link</span>
                </button>
            </div>
            {status === 'FLAGGED' && (
                <div className="commentFlag">
                    <FlagIcon />
                    <div className="commentFlagLabel">
                        <span>Flagged by:</span>
                        <span className="commentFlagUser">
                            {flaggedBy?.name ?? 'Community Member'}
                        </span>
                    </div>
                </div>
            )}
            <h2 className="commentTitle">
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
            <p className="commentContent">{content}</p>
            <div className="commentActions">
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
                    <div className="commentReviewedBy">
                        <span>Reviewed by:</span>
                        <span className="commentReviewedByUser">
                            {reviewedBy.name}
                        </span>
                    </div>
                )}
            </div>
            <div className="linksContainer">
                <button className="commentLink" onClick={handleToggleModal}>
                    View Thread
                </button>
                <span className="commentLink">
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
            {showModal && (
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
                                {getCommentThread(comment).map((reply) => (
                                    <CommentCardSmall
                                        key={reply.id}
                                        comment={reply}
                                        onCommentReview={onCommentReview}
                                        userId={userId}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </article>
    )
}

/** Returns a thread of comments with the first comment at the beginning of the array */
const getCommentThread = (comment: Schema_Comment): Schema_Comment[] => {
    const thread: Schema_Comment[] = []

    // If the comment has a parent, we add it to the thread
    if (comment.parent) {
        thread.push(comment.parent)

        // If the parent has replies, we add them to the thread
        if (comment.parent.replies.length > 0) {
            comment.parent.replies.forEach((reply) => thread.push(reply))
        }
    } else {
        // If it's a top-level comment, we add it directly to the thread
        thread.push(comment)

        // If there are replies, we add them to the thread
        if (comment.replies.length > 0) {
            comment.replies.forEach((reply) => thread.push(reply))
        }
    }

    return thread
}
