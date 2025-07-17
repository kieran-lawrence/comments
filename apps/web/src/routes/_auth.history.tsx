import {
    CommentStatusChanges,
    ErrorComponent,
    Filter,
    LoadingOverlay,
    PageLayout,
    Search,
} from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getStatusChanges } from '../services/api'
import { useMemo, useState } from 'react'
import {
    CommentStatusChangeByOptions,
    CommentStatusOptions,
    SortOptions,
} from '@repo/shared-types'
import {
    filterCommentStatusChangesByChangedBy,
    filterCommentStatusChangesByStatus,
    searchCommentStatusChanges,
    sortCommentStatusChanges,
} from '../utils/helpers'

export const Route = createFileRoute('/_auth/history')({
    component: HistoryPage,
    errorComponent: ({ error }) => (
        <ErrorComponent
            message={error.message}
            details={error.cause as string}
        />
    ),
})

function HistoryPage() {
    const {
        data: commentStatusChanges,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['getCommentStatusChangesKey'],
        queryFn: getStatusChanges,
    })
    const [statusFilter, setStatusFilter] =
        useState<CommentStatusOptions>('ALL')
    const [changedByFilter, setChangedByFilter] =
        useState<CommentStatusChangeByOptions>('ALL')
    const [sort, setSort] = useState<SortOptions>('Newest First')
    const [searchTerm, setSearchTerm] = useState('')

    const searchFilteredComments = useMemo(() => {
        if (!commentStatusChanges) return null
        const filteredByStatus = filterCommentStatusChangesByStatus(
            sortCommentStatusChanges(commentStatusChanges, sort),
            statusFilter,
        )
        const filteredByChangedBy = filterCommentStatusChangesByChangedBy(
            filteredByStatus,
            changedByFilter,
        )
        if (!searchTerm) return filteredByChangedBy
        return searchCommentStatusChanges(filteredByChangedBy, searchTerm)
    }, [commentStatusChanges, changedByFilter, searchTerm, statusFilter, sort])

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (isError || !searchFilteredComments) {
        throw new Error(
            `Encountered an issue while fetching comment history data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getStatusChanges on /history route',
            },
        )
    }

    return (
        <PageLayout
            sidebar={
                <div className="flex flex-col items-left gap-6">
                    <Search
                        placeholder="Search by article or user name"
                        onSearch={setSearchTerm}
                    />
                    <Filter<CommentStatusOptions>
                        filterTitle="Comment Status"
                        filterOptions={[
                            'ALL',
                            'APPROVED',
                            'REJECTED',
                            'PENDING',
                            'FLAGGED',
                        ]}
                        activeItem={statusFilter}
                        onClick={setStatusFilter}
                    />
                    <Filter<CommentStatusChangeByOptions>
                        filterTitle="Changed By"
                        filterOptions={['ALL', 'SYSTEM', 'STAFF', 'COMMUNITY']}
                        activeItem={changedByFilter}
                        onClick={setChangedByFilter}
                    />
                    <Filter<SortOptions>
                        filterTitle="Sort"
                        filterOptions={['Newest First', 'Oldest First']}
                        activeItem={sort}
                        onClick={setSort}
                    />
                </div>
            }
            mainContent={
                <CommentStatusChanges statusChanges={searchFilteredComments} />
            }
        />
    )
}
