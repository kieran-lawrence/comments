import { PageLayout, UserTable } from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users')({
    component: UsersPage,
})

function UsersPage() {
    return (
        <PageLayout
            sidebar={<>Sidebar</>}
            mainContent={
                <div style={{ width: '1100px', padding: '16px' }}>
                    <UserTable type="active" />
                    <UserTable type="suspended" />
                    <UserTable type="banned" />
                </div>
            }
        />
    )
}
