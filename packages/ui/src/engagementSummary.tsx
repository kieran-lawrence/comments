import { EngagementSummaryResponse } from '@repo/shared-types'

export const EnagementSummary = ({
    newCommentsToday,
    pendingComments,
    totalComments,
    activeUsers,
}: EngagementSummaryResponse) => {
    const totalCommentsCount = totalComments.length
    const approvalRate = Math.round(
        (totalComments.filter((c) => c.status === 'APPROVED').length /
            totalCommentsCount) *
            100,
    )
    const flaggedRate = Math.round(
        (totalComments.filter((c) => c.status === 'FLAGGED').length /
            totalCommentsCount) *
            100,
    )
    return (
        <div className="p-4 border border-black/25 rounded-xl flex flex-col shadow-sm">
            <h2 className="textTitleItemMd text-text-primary">
                Engagement Summary
            </h2>
            <div className="grid grid-cols-2 grid-rows-[1fr_1px_1fr_1fr] h-full">
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        {newCommentsToday}
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        New Comments Today
                    </span>
                </div>
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        {pendingComments}
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Comments Pending Review
                    </span>
                </div>
                <hr className="text-black/25 w-full col-span-2" />
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        {totalCommentsCount}
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Total Comments
                    </span>
                </div>
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        {activeUsers}
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Active Users
                    </span>
                </div>
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-success">
                        {approvalRate}%
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Approval Rate
                    </span>
                </div>
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-warn">
                        {flaggedRate}%
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Flagged Comment Rate
                    </span>
                </div>
            </div>
        </div>
    )
}
