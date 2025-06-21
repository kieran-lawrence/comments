import { Schema_User } from '@repo/shared-types'
import { formatDistance } from 'date-fns'

type AccountStatusProps = { users: Schema_User[] }

// TODO: Add email address into database schema
export const UserTable = ({ users }: AccountStatusProps) => {
    return (
        <table className="w-full text-left flex flex-col gap-2">
            <thead>
                <tr className="grid grid-cols-[25%_25%_1fr_1fr_1fr] w-full px-4">
                    <th className="textTitleItemMd text-text-primary">Name</th>
                    <th className="textTitleItemMd text-text-primary">
                        Email Address
                    </th>
                    <th className="textTitleItemMd text-text-primary">
                        Account Status
                    </th>
                    <th className="textTitleItemMd text-text-primary">Role</th>
                    <th className="textTitleItemMd text-text-primary">
                        Joined
                    </th>
                </tr>
            </thead>
            <tbody className="flex flex-col gap-2">
                {users.map((user) => (
                    <UserTableRow key={user.id} user={user} />
                ))}
            </tbody>
        </table>
    )
}

export const UserTableRow = ({ user }: { user: Schema_User }) => {
    const { textColor, status } = getAccountStatusConfig(user)
    return (
        <tr className="grid grid-cols-[25%_25%_1fr_1fr_1fr] w-full rounded-sm px-4 py-2 bg-bg-card">
            <td className="textTitleItemMd font-normal">{user.name}</td>
            {/* <td>{user.email}</td> */}
            <td className="textTitleItemMd font-normal">example@gmail.com</td>
            <td
                className="textTitleItemMd font-semibold"
                style={{ color: textColor }}
            >
                {status}
            </td>
            <td className="textTitleItemMd font-normal capitalize">
                {user.role.toLowerCase()}
            </td>
            <td className="textTitleItemMd font-normal text-border-primary">
                {formatDistance(new Date(user.createdAt), new Date(), {
                    addSuffix: true,
                })}
            </td>
        </tr>
    )
}

const getAccountStatusConfig = (user: Schema_User) => {
    if (user.active) {
        return {
            status: 'Active',
            textColor: '#034211',
        }
    } else if (user.suspended) {
        return {
            status: 'Suspended',
            textColor: '#EBB018',
        }
    }
    return {
        status: 'Banned',
        textColor: '#420000',
    }
}
