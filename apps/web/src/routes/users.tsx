import { PageLayout, UserTable } from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'
import { getUsers } from '../services/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/users')({
    component: UsersPage,
})

function UsersPage() {
    const {
        data: users,
        isLoading,
        isError,
        // refetch,
    } = useQuery({
        queryKey: ['getUsersKey'],
        queryFn: getUsers,
    })

    // TODO: Add loading and error states
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !users) {
        return <div>Error loading users</div>
    }

    return (
        <PageLayout
            sidebar={<>Sidebar</>}
            mainContent={<UserTable users={users} />}
        />
    )
}
