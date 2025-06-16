// Once we have the API data setup we may need to tweak these to suit the shape of the data.
import './styles/commentCard.css'
import { Button } from './button'
import { ShareIcon } from './icons/shareIcon'
import { FlagIcon } from './icons/flagIcon'
import { ReplyingToIcon } from './icons/replyingToIcon'

type CommentType = 'pending' | 'approved' | 'rejected' | 'flagged'

type CommentConfig = {
    site: string
    user: string
    datePublished: string
    articleTitle: string
    articleContent: string
    articleUrl: string
    isFlagged?: boolean
    isReply?: boolean
    reviewedBy?: string
}

export const Comment = ({
    site,
    user,
    datePublished,
    articleTitle,
    articleContent,
    articleUrl,
    isFlagged,
    isReply,
    reviewedBy,
}: CommentConfig) => {
    return (
        <article className="commentContainer">
            <div className="commentTop">
                <div>
                    <span>{user}</span>
                    <span className="commentDate">{datePublished}</span>
                    {isReply && (
                        <div className="commentReply">
                            <ReplyingToIcon />
                            <div className="commentReplyLabel">
                                <span>Replying to:</span>
                                <span className="commentReplyUser">{user}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <span className="commentSite">{site}</span>
                    <ShareIcon iconColor={'#161616'} />
                </div>
            </div>
            {isFlagged && (
                <div className="commentFlag">
                    <FlagIcon />
                    <div className="commentFlagLabel">
                        <span>Flagged by:</span>
                        <span className="commentFlagUser">{user}</span>
                    </div>
                </div>
            )}
            <h2 className="commentTitle">{articleTitle}</h2>
            <p className="commentContent">{articleContent}</p>
            <div className="commentActions">
                <Button onClick={() => {}} type="approve-pending" />
                <Button onClick={() => {}} type="reject-pending" />
                {reviewedBy && (
                    <div className="commentReviwedBy">
                        <span>Reviewed by:</span>
                        <span className="commentReviewedByUser">{user}</span>
                    </div>
                )}
            </div>

            <a className="commentLink" href={articleUrl}>
                View Conversation
            </a>
        </article>
    )
}
