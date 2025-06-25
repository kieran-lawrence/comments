import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'

// Create a client for react query
const queryClient = new QueryClient()
// Create a new router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
        auth: undefined!,
    },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN ?? ''
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''

function App() {
    const auth = useAuth0()
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} context={{ auth }} />
        </QueryClientProvider>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
        >
            <App />
        </Auth0Provider>
    </StrictMode>,
)
