import { CommentsDashboard, PageLayout } from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
    component: RouteComponent,
})

function RouteComponent() {
    return <PageLayout mainContent={<CommentsDashboard />} />
}
