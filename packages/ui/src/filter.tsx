import './styles/filter.css'

type FilterProps = {
    filterTitle: string
    filterCount: Record<string, number | undefined>
    activeItem: string
}

export const Filter = ({
    filterTitle,
    filterCount,
    activeItem,
}: FilterProps) => {
    return (
        <div className="filterContainer">
            <h3 className="filterTitle">{filterTitle}</h3>
            <div className="filterOptions">
                {Object.entries(filterCount).map(([filter, count]) => (
                    <button
                        className={`filterButton ${activeItem === filter ? 'active' : ''}`}
                    >
                        {count === undefined
                            ? `${filter}`
                            : `${filter} (${count})`}
                    </button>
                ))}
            </div>
        </div>
    )
}
