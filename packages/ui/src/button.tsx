import './styles/button.css'

type ButtonProps = { onClick: () => void; type: ButtonType }

type ButtonType =
    | 'approved'
    | 'rejected'
    | 'approve-neutral'
    | 'reject-neutral'
    | 'approve-pending'
    | 'reject-pending'

export const Button = ({ onClick, type }: ButtonProps) => {
    const { textColor, text, backgroundColor } = getButtonConfig(type)
    return (
        <button
            style={{
                borderColor: textColor,
                background: backgroundColor,
                color: textColor,
            }}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

type ButtonConfig = {
    text: string
    backgroundColor: string
    textColor: string
}
const getButtonConfig = (type: ButtonType): ButtonConfig => {
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
