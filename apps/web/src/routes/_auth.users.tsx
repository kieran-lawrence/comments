import { ErrorComponent, LoadingOverlay, PageLayout, UserTable } from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'
import { getUsers } from '../services/api'
import { useQuery } from '@tanstack/react-query'

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

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (isError || !users) {
        throw new Error(
            `Encountered an issue while fetching user data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getUsers on /users route',
            },
        )
    }

    return (
        <PageLayout
            sidebar={<>Sidebar</>}
            mainContent={<UserTable users={users} />}
        />
    )
}
