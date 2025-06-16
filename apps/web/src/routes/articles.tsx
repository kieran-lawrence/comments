import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articles')({
    component: ArticlesPage,
})

function ArticlesPage() {
    return <div>Hello "/articles"!</div>
}
