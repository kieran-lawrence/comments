import { PropsWithChildren, useEffect, useRef } from 'react'

export const Modal = ({
    children,
    onClose,
}: PropsWithChildren<{ onClose: () => void }>) => {
    const modalRef = useRef<HTMLDivElement>(null)

    /** Close the modal if we click on it */
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current === e.target) {
            onClose()
        }
    }

    // Add an event listener for the Escape key to close the modal
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) =>
            e.key === 'Escape' && onClose()
        document.addEventListener('keydown', handleKeydown)
        return () => document.removeEventListener('keydown', handleKeydown)
    }, [onClose])

    return (
        <div
            ref={modalRef}
            onClick={handleOverlayClick}
            className="fixed top-0 left-0 w-full h-full z-50 bg-black/50 grid place-items-center"
        >
            {children}
        </div>
    )
}
