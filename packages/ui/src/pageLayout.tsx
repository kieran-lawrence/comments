type PageLayoutProps = {
    sidebar?: React.ReactNode
    mainContent: React.ReactNode
}

export const PageLayout = ({ sidebar, mainContent }: PageLayoutProps) => {
    return (
        <div className="pageLayout">
            {sidebar && <aside className="pageAside">{sidebar}</aside>}
            <main className="pageContent">{mainContent}</main>
        </div>
    )
}
