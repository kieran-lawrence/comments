import { Button } from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getArticles } from '../services/api'

export const Route = createFileRoute('/')({
    component: HomePage,
})

// The homepage in our app is technically the "Moderate" page
function HomePage() {
    const query = useQuery({
        queryKey: ['getArticlesKey'],
        queryFn: getArticles,
    })

    return (
        <>
            <Button
                onClick={() => {
                    alert('I am approved, my human told me so 💖')
                }}
                type="approved"
            />
            <Button
                onClick={() => {
                    alert('I am not yet approved 😭')
                }}
                type="approve-neutral"
            />
            <Button
                onClick={() => {
                    alert('I am rejected, nobody loves me')
                }}
                type="rejected"
            />
            <Button
                onClick={() => {
                    alert('I am not yet rejected 😍')
                }}
                type="reject-neutral"
            />
        </>
    )
}
