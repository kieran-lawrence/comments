import {
    ArticleIcon,
    DashboardIcon,
    HistoryIcon,
    ModerateIcon,
    SettingsIcon,
    SiteIcon,
    UserIcon,
} from '@repo/ui'
import {
    createRootRoute,
    Link,
    Outlet,
    useRouter,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type React from 'react'

export const Route = createRootRoute({
    component: Layout,
})

type NavigationLink = {
    to: string
    label: string
    icon: React.ReactElement
}

function Layout() {
    const router = useRouter()
    const [currentPath, setCurrentPath] = useState(
        router.state.location.pathname,
    )
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
        { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
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
                    to="/"
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
                <div className="flex items-center gap-2 text-2xl">
                    {/* TODO: This should be set by config or something similar when we set it up */}
                    <SiteIcon site="thenightly" />
                    The Nightly
                </div>
            </nav>
            <Outlet />
        </>
    )
}
