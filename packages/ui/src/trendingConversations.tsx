import { TopCommentResponse } from '@repo/shared-types'

export const TrendingConversations = ({
    topCommentsToday,
}: {
    topCommentsToday: TopCommentResponse[]
}) => {
    return (
        <section className="flex flex-col p-4 border border-black/25 rounded-xl gap-6 shadow-sm">
            <h2 className="textTitleItemMd text-text-primary">
                Trending Conversations Today
            </h2>
            <table className="w-full text-left flex flex-col gap-2">
                <thead>
                    <tr className="grid grid-cols-[90%_1fr] w-full px-2">
                        <th className="textTitleItemSm font-medium text-text-primary">
                            Article Title
                        </th>
                        <th className="textTitleItemSm font-medium text-text-primary">
                            Comment Count
                        </th>
                    </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                    {topCommentsToday.map(
                        ({ articleId, articleTitle, commentCount }) => (
                            <tr
                                className="grid grid-cols-[90%_1fr] w-full rounded-sm px-2 py-2 bg-bg-card"
                                key={articleId}
                            >
                                <td>
                                    <a
                                        className="commentLink"
                                        href={`/articles#${articleId}?expanded=true`}
                                    >
                                        {articleTitle}
                                    </a>
                                </td>
                                <td>{commentCount}</td>
                            </tr>
                        ),
                    )}
                </tbody>
            </table>
        </section>
    )
}
