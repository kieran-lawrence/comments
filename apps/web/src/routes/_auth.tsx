import {
    createFileRoute,
    Link,
    Outlet,
    useRouter,
} from '@tanstack/react-router'
import * as React from 'react'
import { redirect } from '@tanstack/react-router'
import {
    ArticleIcon,
    DashboardIcon,
    HistoryIcon,
    LoadingOverlay,
    ModerateIcon,
    SettingsIcon,
    SiteIcon,
    UserIcon,
} from '@repo/ui'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_auth')({
    beforeLoad: ({ context }) => {
        if (context.auth.isLoading) return <LoadingOverlay />
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: '/login',
            })
        }
    },
    component: RootLayout,
})

type NavigationLink = {
    to: string
    label: string
    icon: React.ReactElement
}

function RootLayout() {
    const { isAuthenticated, logout } = useAuth0()
    const router = useRouter()
    const [currentPath, setCurrentPath] = useState(
        router.state.location.pathname,
    )
    const siteName = import.meta.env.VITE_SITE_NAME
    useEffect(() => {
        // Subscribe to the router's onLoad event to update the current path
        // Returns an unsubscribe function to clean up the subscription later
        const unsubscribe = router.subscribe('onLoad', () => {
            setCurrentPath(router.state.location.pathname)
        })
        // Unsubscribe from the router when the component unmounts
        return () => {
            unsubscribe()
        }
    }, [router])

    // Define the navigation links
    const navLinks: NavigationLink[] = [
        { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { to: '/moderate', label: 'Moderate', icon: <ModerateIcon /> },
        { to: '/articles', label: 'Articles', icon: <ArticleIcon /> },
        { to: '/users', label: 'Users', icon: <UserIcon /> },
        { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
        { to: '/history', label: 'History', icon: <HistoryIcon /> },
    ]

    return (
        <>
            <nav
                aria-label="Main Navigation"
                className="flex justify-between items-center bg-bg-menu text-primary px-5"
            >
                <Link
                    to="/dashboard"
                    className="text-2xl font-medium transition-all duration-250 hover:text-text-menu-hover"
                >
                    Comments
                </Link>
                <ul className="flex items-center gap-5 text-xl">
                    {/* Loop over the nav links and create a nav item for each in the array */}
                    {navLinks.map((link) => (
                        <li
                            key={link.to}
                            // If the current path matches the link's path, add the 'active' class
                            className={`menuItem ${currentPath === link.to ? 'active' : ''}`}
                        >
                            <Link
                                className="flex gap-1 items-center py-3"
                                to={link.to}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-4">
                    {isAuthenticated && (
                        <button
                            className="transition-colors duration-300 hover:text-text-menu-hover cursor-pointer"
                            onClick={() =>
                                logout({
                                    logoutParams: {
                                        returnTo: window.location.origin,
                                    },
                                })
                            }
                        >
                            Log Out
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <SiteIcon site={siteName} />
                        <h2 className="capitalize text-2xl">
                            {siteName.replace('-', ' ')}
                        </h2>
                    </div>
                </div>
            </nav>
            {ScrollToHashOnRouteChange()}
            <Outlet />
        </>
    )
}

// This component scrolls to the element with the ID matching the current URL hash
function ScrollToHashOnRouteChange() {
    const router = useRouter()

    React.useEffect(() => {
        const unsub = router.subscribe('onLoad', () => {
            // Wait for DOM updates
            setTimeout(() => {
                if (window.location.hash) {
                    const el = document.getElementById(
                        window.location.hash.slice(1),
                    )
                    if (el) {
                        el.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        })
                    }
                }
            }, 0)
        })
        return unsub
    }, [router])

    return null
}
