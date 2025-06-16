import { Button } from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: HomePage,
})

// The homepage in our app is technically the "Moderate" page
function HomePage() {
    return (
        <>
            <Button
                text="Approved"
                backgroundColor="#D0F9D9"
                textColor="#034211"
                onClick={() => {
                    alert('bleh')
                }}
            />
            <Button
                text="Rejected"
                backgroundColor="#FFC3C7"
                textColor="#420000"
                onClick={() => {
                    alert('Rejected')
                }}
            />
        </>
    )
}
