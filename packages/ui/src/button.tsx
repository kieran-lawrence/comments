import './styles/button.css'

type ButtonProps = {
    backgroundColor: string
    textColor: string
    text: string
    onClick: () => void
}

export const Button = ({
    backgroundColor,
    textColor,
    text,
    onClick,
}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                borderColor: textColor,
                background: backgroundColor,
                color: textColor,
            }}
        >
            {text}
        </button>
    )
}
