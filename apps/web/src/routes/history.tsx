import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/history')({
    component: HistoryPage,
})

function HistoryPage() {
    return <div>Hello "/history"!</div>
}
