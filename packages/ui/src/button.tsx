import './styles/button.css'

type ButtonProps = { onClick: () => void; type: ButtonType }

type ButtonType = 'approved' | 'rejected' | 'approve-neutral' | 'reject-neutral'

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

type ButtonReturnType = {
    text: string
    backgroundColor: string
    textColor: string
}
const getButtonConfig = (type: ButtonType): ButtonReturnType => {
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
                textColor: '#525252',
            }
        case 'reject-neutral':
            return {
                text: 'reject',
                backgroundColor: 'none',
                textColor: '#525252',
            }
    }
}
