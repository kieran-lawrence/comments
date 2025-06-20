// Waiting for the data to be provided from the API before adding more properties.
// Account Status type implementation may need to be tweaked once the API is ready.

import './styles/userTable.css'

type AccountStatus = 'active' | 'suspended' | 'banned'
type AccountStatusProps = { type: AccountStatus }

export const UserTable = ({ type }: AccountStatusProps) => {
    return (
        <table>
            <thead>
                <tr>
                    <th className="test">Name</th>
                    <th>Email Address</th>
                    <th>Account Status</th>
                    <th>Role</th>
                    <th>Joined</th>
                </tr>
            </thead>
            <tbody>
                <UserTableRow type={type} />
                <UserTableRow type={type} />
            </tbody>
        </table>
    )
}

export const UserTableRow = ({ type }: AccountStatusProps) => {
    const { textColor } = getAccountStatusConfig(type)
    return (
        <tr>
            <td>John Smith</td>
            <td>john.smith7@yahoo.com.au</td>
            <td style={{ color: textColor }}>TextColorChange</td>
            <td>User</td>
            <td>just now</td>
        </tr>
    )
}

type AccountStatusConfig = {
    textColor: string
}

const getAccountStatusConfig = (type: AccountStatus) => {
    switch (type) {
        case 'active':
            return {
                textColor: '#034211',
            }
        case 'suspended':
            return {
                textColor: '#EBB018',
            }
        case 'banned':
            return {
                textColor: '#420000',
            }
    }
}
