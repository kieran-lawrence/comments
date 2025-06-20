import { CommentStatus } from '@repo/shared-types'

type ButtonType = 'approve' | 'reject'
type ButtonProps = {
    onClick: () => void
    type: ButtonType
    icon?: React.ReactNode
    status: CommentStatus
}

export const Button = ({ onClick, type, icon, status }: ButtonProps) => {
    const { textColor, text, backgroundColor } = getButtonConfig(
        getButtonStateForStatus(type, status),
    )
    return (
        <button
            className="commentsButton"
            style={{
                borderColor: textColor,
                background: backgroundColor,
                color: textColor,
                padding: icon ? '6px 12px' : '12px 24px',
            }}
            onClick={onClick}
        >
            {icon ? icon : text}
        </button>
    )
}

type ButtonConfig = {
    text: string
    backgroundColor: string
    textColor: string
}
type ButtonStates =
    | 'approved'
    | 'rejected'
    | 'approve-neutral'
    | 'reject-neutral'
    | 'approve-pending'
    | 'reject-pending'

const getButtonConfig = (type: ButtonStates): ButtonConfig => {
    switch (type) {
        case 'approved':
            return {
                text: 'approved',
                backgroundColor: '#D0F9D9',
                textColor: '#034211',
            }
        case 'rejected':
            return {
                text: 'rejected',
                backgroundColor: '#FFC3C7',
                textColor: '#420000',
            }
        case 'approve-neutral':
            return {
                text: 'approve',
                backgroundColor: 'none',
                textColor: '#161616',
            }
        case 'reject-neutral':
            return {
                text: 'reject',
                backgroundColor: 'none',
                textColor: '#161616',
            }
        case 'approve-pending':
            return {
                text: 'approve',
                backgroundColor: '#D0F9D9',
                textColor: '#034211',
            }
        case 'reject-pending':
            return {
                text: 'reject',
                backgroundColor: '#FFC3C7',
                textColor: '#420000',
            }
    }
}

/** Returns the correct button state based on the current comment status and button type */
const getButtonStateForStatus = (
    buttonType: 'approve' | 'reject',
    status: CommentStatus,
) => {
    switch (status) {
        case 'APPROVED':
            return buttonType === 'approve' ? 'approved' : 'reject-neutral'
        case 'REJECTED':
            return buttonType === 'approve' ? 'approve-neutral' : 'rejected'
        case 'PENDING':
            return buttonType === 'approve'
                ? 'approve-pending'
                : 'reject-pending'
        case 'FLAGGED':
            return buttonType === 'approve' ? 'approved' : 'reject-neutral'
    }
}
