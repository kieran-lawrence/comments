export const TrendingConversations = () => {
    return (
        <section className="flex flex-col p-4 border border-black/25 rounded-xl gap-3 shadow-sm">
            <h2 className="textTitleItemMd text-text-primary">
                Trending Conversations Today
            </h2>
            <table className="w-full text-left flex flex-col gap-2">
                <thead>
                    <tr className="grid grid-cols-[90%_1fr] w-full px-2">
                        <th className="textTitleItemSm font-medium text-text-primary">
                            Article Title
                        </th>
                        <th className="textTitleItemSm font-medium text-text-primary">
                            Comment Count
                        </th>
                    </tr>
                </thead>
                <tbody className="flex flex-col gap-2">
                    <tr className="grid grid-cols-[90%_1fr] w-full rounded-sm px-2 py-2 bg-bg-card">
                        <td>
                            Oscar Piastri and Lando Norris in dramatic crash
                            after ‘stupid’ late-race move
                        </td>
                        <td>19</td>
                    </tr>
                    <tr className="grid grid-cols-[90%_1fr] w-full rounded-sm px-2 py-2 bg-bg-card">
                        <td>
                            Oscar Piastri and Lando Norris in dramatic crash
                            after ‘stupid’ late-race move
                        </td>
                        <td>11</td>
                    </tr>
                    <tr className="grid grid-cols-[90%_1fr] w-full rounded-sm px-2 py-2 bg-bg-card">
                        <td>
                            Oscar Piastri and Lando Norris in dramatic crash
                            after ‘stupid’ late-race move
                        </td>
                        <td>5</td>
                    </tr>
                    <tr className="grid grid-cols-[90%_1fr] w-full rounded-sm px-2 py-2 bg-bg-card">
                        <td>
                            Oscar Piastri and Lando Norris in dramatic crash
                            after ‘stupid’ late-race move
                        </td>
                        <td>2</td>
                    </tr>
                </tbody>
            </table>
        </section>
    )
}
