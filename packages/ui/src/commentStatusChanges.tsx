import { CommentStatus, Schema_CommentStatusChange } from '@repo/shared-types'
import { formatDistance } from 'date-fns'
import { QuestionIcon } from './icons/questionIcon'
import { RichTextComment } from './richTextComment'

export const CommentStatusChanges = ({
    statusChanges,
}: {
    statusChanges: Schema_CommentStatusChange[]
}) => {
    return (
        <div className="w-full flex flex-col gap-2">
            {statusChanges.map((statusChange) => (
                <StatusChangeCard
                    key={statusChange.id}
                    statusChange={statusChange}
                />
            ))}
        </div>
    )
}

const StatusChangeCard = ({
    statusChange,
}: {
    statusChange: Schema_CommentStatusChange
}) => {
    return (
        <div className="flex flex-col gap-2 w-full py-2 px-4 border border-bg-card-alt bg-bg-card text-text-primary rounded-md textTitleItemSm">
            <div className="flex gap-4 justify-between textTitleItemMd font-semibold items-start">
                <span className="flex flex-col gap-1">
                    <h2>{statusChange.comment.article.articleTitle}</h2>
                    <time
                        dateTime={statusChange.changedAt}
                        className="textTitleItemSm text-text-secondary"
                    >
                        {formatDistance(
                            new Date(statusChange.changedAt),
                            new Date(),
                            {
                                addSuffix: true,
                            },
                        )}
                    </time>
                </span>
                <span className="flex gap-4 items-center textTitleItemMd font-medium">
                    {statusChange.changedReason && (
                        <div className="flex gap-2 items-center textTitleItemSm font-medium uppercase border-2 border-text-warn bg-bg-warn w-fit px-3 py-1 rounded-full">
                            <QuestionIcon size={22} />
                            {statusChange.changedReason}
                        </div>
                    )}
                    {statusChange.changedByUser?.name || 'System'}
                </span>
            </div>
            <div>
                <span
                    className="textTitleItemMd font-medium"
                    style={{ color: getStatusColours(statusChange.oldStatus) }}
                >
                    {statusChange.oldStatus}
                </span>{' '}
                →{' '}
                <span
                    className="textTitleItemMd font-medium"
                    style={{ color: getStatusColours(statusChange.newStatus) }}
                >
                    {statusChange.newStatus}
                </span>
            </div>

            <div className="bg-bg-card-alt rounded-md p-2 textTitleItemSm">
                <div className="font-semibold text-text-secondary">
                    {statusChange.comment.author.name}
                </div>
                <div className="font-normal">
                    <RichTextComment
                        value={JSON.parse(statusChange.comment.content)}
                    />
                </div>
            </div>
        </div>
    )
}

const getStatusColours = (status: CommentStatus) => {
    switch (status) {
        case 'APPROVED':
            return 'var(--color-text-success-dark'
        case 'REJECTED':
            return 'var(--color-text-error)'
        case 'FLAGGED':
            return 'var(--color-text-warn)'
        default:
            return 'var(--color-text-primary)'
    }
}
