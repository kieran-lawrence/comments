import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { PageLayout } from '@repo/ui'

export const Route = createFileRoute('/login')({
    component: LoginPage,
})

function LoginPage() {
    const { loginWithRedirect } = useAuth0()
    return (
        <PageLayout
            mainContent={
                <div className="grid place-items-center h-full">
                    <button
                        className="commentsButton px-4 py-2"
                        onClick={() => loginWithRedirect()}
                    >
                        Log In
                    </button>
                </div>
            }
        />
    )
}
