export const SiteIcon = ({ site }: { site: string }) => {
    switch (site) {
        case 'bulletin-news':
        default:
            return (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M22.384 24V0H15.8698V12.5625H15.6824L7.15305 0H1.62305L1.62305 16.2H8.1372V11.3906H8.2778L16.9477 24H22.384Z"
                        fill="currentColor"
                    />
                    <path
                        d="M4.85197 24C3.06707 24 1.62012 22.5527 1.62012 20.7675C1.62012 18.9822 3.06707 17.535 4.85197 17.535C6.63688 17.535 8.08383 18.9822 8.08383 20.7675C8.08383 22.5527 6.63688 24 4.85197 24Z"
                        fill="currentColor"
                    />
                </svg>
            )
    }
}
