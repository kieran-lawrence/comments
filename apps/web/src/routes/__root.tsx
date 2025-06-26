import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type React from 'react'
import { Auth0ContextInterface, User } from '@auth0/auth0-react'

export interface RouterContext {
    auth: Auth0ContextInterface<User>
}
export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => <Outlet />,
})
