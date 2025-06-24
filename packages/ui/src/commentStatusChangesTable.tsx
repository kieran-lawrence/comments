import { CommentStatus, Schema_CommentStatusChange } from '@repo/shared-types'
import { formatDistance } from 'date-fns'

export const CommentStatusChangesTable = ({
    statusChanges,
}: {
    statusChanges: Schema_CommentStatusChange[]
}) => {
    return (
        <table className="w-full text-left flex flex-col gap-2">
            <thead>
                <tr className="grid grid-cols-[50%_1fr_1fr_1.5fr] w-full px-4">
                    <th className="textTitleItemMd text-text-primary">Text</th>
                    <th className="textTitleItemMd text-text-primary">
                        Status
                    </th>
                    <th className="textTitleItemMd text-text-primary">
                        Changed By
                    </th>
                    <th className="textTitleItemMd text-text-primary">
                        Changed At
                    </th>
                </tr>
            </thead>
            <tbody className="flex flex-col gap-2">
                {statusChanges.map((statusChange) => (
                    <CommentStatusChangesTableRow
                        key={statusChange.id}
                        statusChange={statusChange}
                    />
                ))}
            </tbody>
        </table>
    )
}

const CommentStatusChangesTableRow = ({
    statusChange,
}: {
    statusChange: Schema_CommentStatusChange
}) => {
    return (
        <tr className="grid grid-cols-[50%_1fr_1fr_1.5fr] w-full rounded-sm px-4 py-2 bg-bg-card">
            <td className="textTitleItemMd font-normal">
                {statusChange.comment.content}
            </td>
            <td
                className="textTitleItemMd font-semibold"
                style={{ color: getStatusColours(statusChange.newStatus) }}
            >
                {statusChange.newStatus}
            </td>
            <td className="textTitleItemMd font-normal">
                {statusChange.changedByUser?.name || 'Unknown'}
            </td>

            <td className="textTitleItemMd font-normal text-border-primary">
                {formatDistance(new Date(statusChange.changedAt), new Date(), {
                    addSuffix: true,
                })}
            </td>
        </tr>
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
