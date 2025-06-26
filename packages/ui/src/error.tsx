import { ReactNode } from 'react'

type ErrorComponentProps = {
    message: string
    details?: string
}
export const ErrorComponent = ({ message, details }: ErrorComponentProps) => {
    return (
        <div className="flex flex-col justify-center items-center grow w-full gap-4 whitespace-pre-line">
            <h2 className="textTitleItemLg text-2xl">Something Went Wrong!</h2>
            <p className="textTitleItemSm text-center">{message}</p>
            {details && (
                <small className="textTitleItemXs text-text-secondary italic">
                    {details}
                </small>
            )}
        </div>
    )
}
