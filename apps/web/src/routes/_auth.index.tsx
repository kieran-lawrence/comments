import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex flex-col justify-center items-center grow w-full gap-4">
            <h2 className="textTitleItemLg">
                Welcome to the Comments Dashboard
            </h2>
            <p>
                Please{' '}
                <Link className="commentLink" to="/login">
                    Login
                </Link>{' '}
                to continue
            </p>
        </div>
    )
}
