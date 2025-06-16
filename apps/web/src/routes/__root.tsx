import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

// This is the root 'route' of our app.
export const Route = createRootRoute({
    // HTML inside the component 'function' will be rendered on every page.
    // This is a good place for our nav to be.
    component: () => (
        <>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/articles">Articles</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                        <li>
                            <Link to="/settings">Settings</Link>
                        </li>
                        <li>
                            <Link to="/history">History</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <hr />
            <Outlet />
        </>
    ),
})
