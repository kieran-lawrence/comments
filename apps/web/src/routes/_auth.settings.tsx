import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/settings')({
    component: SettingsPage,
})

function SettingsPage() {
    return <div>Hello "/settings"!</div>
}
