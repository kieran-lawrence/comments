import { formatDistance } from 'date-fns'
import { Button } from './button'
import { CheckIcon } from '../icons/checkIcon'
import { CrossIcon } from '../icons/crossIcon'
import { ReplyingToIcon } from '../icons/replyingToIcon'
import { CommentProps } from './public/commentCard'
import { RichTextComment } from './richTextComment'

export const CommentCardSmall = ({
    comment,
    onCommentReview,
    userId,
}: Omit<CommentProps, 'apiKey' | 'apiUrl'>) => {
    return (
        <div className={`flex flex-col gap-2`}>
            <article className="px-3 py-2 bg-bg-card-alt rounded-md text-text-primary">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="textTitleItemSm font-semibold">
                            {comment.author.name}
                        </span>
                        <span className="textTitleItemXs text-text-secondary">
                            {formatDistance(
                                new Date(comment.createdAt),
                                new Date(),
                                {
                                    addSuffix: true,
                                },
                            )}
                        </span>
                        {comment.parent && (
                            <div className="flex items-center gap-1 textTitleItemXXs leading-none">
                                <ReplyingToIcon />
                                <div className="flex gap-0.5 items-center">
                                    <span>Replying to:</span>
                                    <span className="text-text-primary font-semibold">
                                        {comment.parent.author.name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
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
                            icon={<CheckIcon />}
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
                            icon={<CrossIcon />}
                        />
                    </div>
                </div>
                <div className="textTitleItemSm">
                    <RichTextComment value={JSON.parse(comment.content)} />
                </div>
            </article>
        </div>
    )
}
