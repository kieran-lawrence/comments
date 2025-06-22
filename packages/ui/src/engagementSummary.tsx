export const EnagementSummary = () => {
    return (
        <div className="p-4 border border-black/25 rounded-xl flex flex-col shadow-sm">
            <h2 className="textTitleItemMd text-text-primary">
                Engagement Summary
            </h2>
            <div className="flex flex-wrap grow h-full">
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        83
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        New Comments
                    </span>
                </div>
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        22
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Comments Pending Review
                    </span>
                </div>

                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        21
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        New Users Joined
                    </span>
                </div>
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        567
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Active Users
                    </span>
                </div>
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        67%
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Approval Rate
                    </span>
                </div>
                <div className="commentsDashboardSummaryItem">
                    <span className="textTitleItemXlg text-text-primary">
                        3.8%
                    </span>
                    <span className="textTitleItemXs text-text-secondary">
                        Flagged Comment Rate
                    </span>
                </div>
            </div>
        </div>
    )
}
