import { FilterOption } from '@repo/shared-types'
import './styles/filter.css'
import { Dispatch, SetStateAction } from 'react'

type FilterProps<T extends string> = {
    filterTitle: string
    filterCount: Record<T, number | undefined>
    activeItem: T
    onClick: Dispatch<SetStateAction<T>>
}

export const Filter = <T extends FilterOption>({
    filterTitle,
    filterCount,
    activeItem,
    onClick,
}: FilterProps<T>) => {
    return (
        <div className="filterContainer">
            <h3 className="filterTitle">{filterTitle}</h3>
            <div className="filterOptions">
                {Object.entries(filterCount).map(([filter, count]) => (
                    <button
                        className={`cursor-pointer filterButton ${activeItem === filter ? 'active' : ''}`}
                        onClick={() => onClick(filter as T)}
                        key={filter}
                    >
                        {count
                            ? `${filter.toLowerCase()} (${count})`
                            : `${filter.toLowerCase()}`}
                    </button>
                ))}
            </div>
        </div>
    )
}
