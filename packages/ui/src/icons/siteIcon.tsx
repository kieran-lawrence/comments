export const SiteIcon = ({ site }: { site: string }) => {
    switch (site) {
        case 'bulletin-news':
        default:
            return (
                <svg
                    width="141"
                    height="149"
                    viewBox="0 0 141 149"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <mask id="path-1-inside-1_41_200" fill="white">
                        <path d="M0 0H41V149H0V0Z" />
                    </mask>
                    <path d="M0 0H41V149H0V0Z" fill="#ED2647" />
                    <path
                        d="M41 149V150H42V149H41ZM41 0H40V149H41H42V0H41ZM41 149V148H0V149V150H41V149Z"
                        fill="#F696A6"
                        mask="url(#path-1-inside-1_41_200)"
                    />
                    <mask id="path-3-inside-2_41_200" fill="white">
                        <path d="M49 0H90V149H49V0Z" />
                    </mask>
                    <path d="M49 0H90V149H49V0Z" fill="#F15C75" />
                    <path
                        d="M90 149V150H91V149H90ZM90 0H89V149H90H91V0H90ZM90 149V148H49V149V150H90V149Z"
                        fill="#FF99AA"
                        mask="url(#path-3-inside-2_41_200)"
                    />
                    <mask id="path-5-inside-3_41_200" fill="white">
                        <path d="M100 0H141V149H100V0Z" />
                    </mask>
                    <path d="M100 0H141V149H100V0Z" fill="#F692A2" />
                    <path
                        d="M141 149V150H142V149H141ZM141 0H140V149H141H142V0H141ZM141 149V148H100V149V150H141V149Z"
                        fill="#FEB6C2"
                        mask="url(#path-5-inside-3_41_200)"
                    />
                </svg>
            )
    }
}
