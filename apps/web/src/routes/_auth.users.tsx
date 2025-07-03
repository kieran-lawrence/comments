import {
    ErrorComponent,
    Filter,
    LoadingOverlay,
    PageLayout,
    Search,
    UserTable,
} from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'
import { getUsers } from '../services/api'
import { useQuery } from '@tanstack/react-query'
import {
    SortOptions,
    RoleFilterOptions,
    AccountStatusOptions,
} from '@repo/shared-types'
import { useMemo, useState } from 'react'
import {
    filterUsersByRole,
    filterUsersByStatus,
    searchUsers,
    sortUsers,
} from '../utils/helpers'

export const Route = createFileRoute('/_auth/users')({
    component: UsersPage,
    errorComponent: ({ error }) => (
        <ErrorComponent
            message={error.message}
            details={error.cause as string}
        />
    ),
})

function UsersPage() {
    const {
        data: users,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['getUsersKey'],
        queryFn: getUsers,
    })
    const [roleFilter, setRoleFilter] = useState<RoleFilterOptions>('ALL')
    const [statusFilter, setStatusFilter] =
        useState<AccountStatusOptions>('Active')
    const [sort, setSort] = useState<SortOptions>('Newest First')
    const [searchTerm, setSearchTerm] = useState('')

    const searchFilteredUsers = useMemo(() => {
        if (!users) return null
        const filteredByAccountStatus = filterUsersByStatus(
            sortUsers(users, sort),
            statusFilter,
        )
        const filteredByRole = filterUsersByRole(
            filteredByAccountStatus,
            roleFilter,
        )
        if (!searchTerm) return filteredByRole
        return searchUsers(filteredByRole, searchTerm)
    }, [users, searchTerm, statusFilter, sort, roleFilter])

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (isError || !searchFilteredUsers) {
        throw new Error(
            `Encountered an issue while fetching user data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getUsers on /users route',
            },
        )
    }

    return (
        <PageLayout
            sidebar={
                <div className="flex flex-col items-left gap-6">
                    <Search
                        placeholder="Search by user name or email"
                        onSearch={setSearchTerm}
                    />
                    <Filter<RoleFilterOptions>
                        filterTitle="Role"
                        filterCount={{
                            ALL: undefined,
                            USER: undefined,
                            MODERATOR: undefined,
                            ADMIN: undefined,
                        }}
                        activeItem={roleFilter}
                        onClick={setRoleFilter}
                    />
                    <Filter<AccountStatusOptions>
                        filterTitle="Account Status"
                        filterCount={{
                            Active: undefined,
                            Suspended: undefined,
                            Banned: undefined,
                            Deleted: undefined,
                        }}
                        activeItem={statusFilter}
                        onClick={setStatusFilter}
                    />
                    <Filter<SortOptions>
                        filterTitle="Sort"
                        filterCount={{
                            'Newest First': undefined,
                            'Oldest First': undefined,
                        }}
                        activeItem={sort}
                        onClick={setSort}
                    />
                </div>
            }
            mainContent={<UserTable users={searchFilteredUsers} />}
        />
    )
}
