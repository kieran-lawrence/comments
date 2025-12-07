import {
    ArticleCommentingStatus,
    CommentStatus,
    Schema_Article,
    UpdateArticleStatusProps,
    UpdateCommentStatusProps,
} from '@repo/shared-types'
import { formatDistance } from 'date-fns'
import { ChevronDownIcon } from '../../icons/chevronDown'
import { useEffect, useState } from 'react'
import { Button } from '../button'
import { CheckIcon } from '../../icons/checkIcon'
import { CrossIcon } from '../../icons/crossIcon'
import { ExternalLinkIcon } from '../../icons/externalLinkIcon'
import { Link } from '@tanstack/react-router'
import { RichTextComment } from '../richTextComment'

type ArticlesTableProps = {
    articles: Schema_Article[]
    onCommentReview: (props: UpdateCommentStatusProps) => Promise<void>
    onStatusChange: (props: UpdateArticleStatusProps) => Promise<void>
    userId: string
}
export const ArticlesTable = ({
    articles,
    onCommentReview,
    onStatusChange,
    userId,
}: ArticlesTableProps) => {
    return (
        <table className="w-full text-left flex flex-col gap-2">
            <thead>
                <tr className="grid grid-cols-[55%_1fr_1fr_1fr_1fr] px-4">
                    <th className="textTitleItemMd text-text-primary">Title</th>
                    <th className="textTitleItemMd text-text-primary text-center">
                        Pending
                    </th>
                    <th className="textTitleItemMd text-text-primary text-center">
                        Approved
                    </th>
                    <th className="textTitleItemMd text-text-primary text-center">
                        Rejected
                    </th>
                    <th className="textTitleItemMd text-text-primary text-center">
                        Flagged
                    </th>
                </tr>
            </thead>
            <tbody className="flex flex-col gap-2">
                {articles.map((article) => (
                    <ArticleTableRow
                        key={article.id}
                        article={article}
                        onCommentReview={onCommentReview}
                        onStatusChange={onStatusChange}
                        userId={userId}
                    />
                ))}
            </tbody>
        </table>
    )
}

type ArticleRowProps = Omit<ArticlesTableProps, 'articles'> & {
    article: Schema_Article
    userId: string
}

const ArticleTableRow = ({
    article,
    onCommentReview,
    onStatusChange,
    userId,
}: ArticleRowProps) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const isExpanded =
            new URLSearchParams(window.location.search).get('expanded') ===
            'true'
        const focusArticleId = new URLSearchParams(window.location.search).get(
            'focusArticleId',
        )
        if (isExpanded && focusArticleId === article.articleId) {
            setIsOpen(true)
        }
    }, [])
    return (
        <tr
            id={`articleCard-${article.articleId}`}
            className="grid grid-cols-[55%_1fr_1fr_1fr_1fr] px-4 py-2 bg-bg-card rounded-sm"
        >
            <td>
                <div className="flex flex-col gap-2">
                    <p className="textTitleItemMd font-normal underline underline-offset-2">
                        {article.articleTitle}
                    </p>
                    <span>
                        <address className="textTitleItemSm not-italic font-semibold">
                            {article.author.name}
                        </address>
                        <time
                            dateTime={article.createdAt}
                            className="textTitleItemXs text-text-secondary"
                        >
                            {formatDistance(
                                new Date(article.createdAt),
                                new Date(),
                                { addSuffix: true },
                            )}
                        </time>
                    </span>
                </div>
            </td>
            <td className="textTitleItemMd font-normal text-center">
                {getArticleStatusCount(article, 'PENDING')}
            </td>
            <td className="textTitleItemMd font-normal text-center">
                {getArticleStatusCount(article, 'APPROVED')}
            </td>
            <td className="textTitleItemMd font-normal text-center">
                {getArticleStatusCount(article, 'REJECTED')}
            </td>
            <td className="textTitleItemMd font-normal text-center">
                {getArticleStatusCount(article, 'FLAGGED')}
            </td>
            <td
                className={`col-span-6 flex flex-col gap-1 ${isOpen ? 'max-h-72 opacity-100' : 'max-h-0 overflow-hidden opacity-0'} transition-all duration-500`}
            >
                <h3 className="textTitleItemSm font-semibold pt-4">
                    Recent comments
                </h3>
                {article.comments.length > 0 ? (
                    article.comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex items-center gap-2 bg-bg-card-alt rounded-sm py-2 px-1.5"
                        >
                            <span className="flex gap-1 items-center flex-shrink-0 whitespace-nowrap">
                                <address className="textTitleItemXs not-italic font-semibold text-text-primary">
                                    {comment.author.name}
                                </address>
                                <time
                                    dateTime={comment.createdAt}
                                    className="textTitleItemXXs text-text-secondary"
                                >
                                    {formatDistance(
                                        new Date(comment.createdAt),
                                        new Date(),
                                        { addSuffix: true },
                                    )}
                                </time>
                            </span>
                            <Link
                                to={`/moderate`}
                                className="textTitleItemSm grow line-clamp-1 overflow-ellipsis hover:underline"
                                hash={`commentCard-${comment.id}`}
                            >
                                <RichTextComment
                                    value={JSON.parse(comment.content)}
                                />
                            </Link>
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
                    ))
                ) : (
                    <p className="textTitleItemXs text-text-secondary italic">
                        There aren't any comments on this article just yet!
                    </p>
                )}
            </td>
            {/* This is the chevron used to expand the detailed article view */}
            <td
                className={`col-span-6 h-full w-full flex row-start-3 items-end justify-between`}
            >
                <span className="commentLink flex items-center gap-2 bg-bg-card">
                    <Link to={article.articleUrl} target="_blank">
                        View Article
                    </Link>
                    <ExternalLinkIcon size={18} />
                </span>
                <button
                    aria-label="View article details"
                    className={`tableButton w-10 h-10 hover:cursor-pointer hover:text-text-primary/50 transition-all duration-500 ${isOpen ? '-rotate-180' : 'rotate-0'}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronDownIcon />
                </button>
                <div className="flex items-center gap-2">
                    <label
                        className="textTitleItemSm font-semibold"
                        htmlFor="commentingStatus"
                    >
                        Commenting status:
                    </label>
                    <select
                        className="border-border-primary border-1 rounded-sm py-1"
                        name="commentingStatus"
                        id="commentingStatus"
                        value={article.status}
                        onChange={(e) =>
                            onStatusChange({
                                id: article.id,
                                articleId: article.articleId, // TODO: Update the API so this is not required
                                status: e.target
                                    .value as ArticleCommentingStatus,
                            } as UpdateArticleStatusProps)
                        }
                    >
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </td>
        </tr>
    )
}

const getArticleStatusCount = (
    article: Schema_Article,
    status: CommentStatus,
) => {
    return article.comments.filter((comment) => comment.status === status)
        .length
}
