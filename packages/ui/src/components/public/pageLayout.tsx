type PageLayoutProps = {
    sidebar?: React.ReactNode
    mainContent: React.ReactNode
}

export const PageLayout = ({ sidebar, mainContent }: PageLayoutProps) => {
    return (
        <div className="flex justify-center w-full grow">
            {sidebar && (
                <aside className="w-sidebar border-r-[1px] border-black/20 p-4">
                    {sidebar}
                </aside>
            )}
            <main
                className={`${sidebar ? 'w-main-content' : 'w-main-content-only'} p-4 `}
            >
                {mainContent}
            </main>
        </div>
    )
}
