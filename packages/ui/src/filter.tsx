import { FilterOption } from '@repo/shared-types'
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
        <div className="flex flex-col gap-2">
            <h3 className="textTitleItemLg text-text-primary">{filterTitle}</h3>
            <div className="flex flex-wrap gap-2">
                {Object.entries(filterCount).map(([filter, count]) => (
                    <button
                        className={`hover:opacity-50 focus:opacity-50 cursor-pointer textTitleItemSm filterButton ${activeItem === filter ? 'active' : ''}`}
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
