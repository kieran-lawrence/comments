import './styles/commentCard.css'
import { Button } from './button'
import { FlagIcon } from './icons/flagIcon'
import { ReplyingToIcon } from './icons/replyingToIcon'
import { Schema_Comment, UpdateCommentStatusProps } from '@repo/shared-types'
import { formatDistance } from 'date-fns'
import { LinkIcon } from './icons/linkIcon'
import { ExternalLinkIcon } from './icons/externalLinkIcon'
import { Link } from '@tanstack/react-router'

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
                <Link
                    className="commentLink"
                    to={`/articles#articleCard-${article.articleId}`}
                >
                    View Conversation
                </Link>
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
        </article>
    )
}
