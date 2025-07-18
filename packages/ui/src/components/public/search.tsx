import { SearchIcon } from '../../icons/searchIcon'

type SearchProps = {
    placeholder: string
    onSearch: (searchTerm: string) => void
}

export const Search = ({ placeholder, onSearch }: SearchProps) => {
    const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const searchField = form.elements.namedItem(
            'searchField',
        ) as HTMLInputElement
        onSearch(searchField.value.trim())
    }
    return (
        <form
            onChange={handleChange}
            onSubmit={(e) => e.preventDefault()}
            className="textTitleItemSm flex flex-col px-4 w-full justify-center bg-bg-card border border-bg-card-alt rounded-md"
        >
            <div className="flex items-center gap-2">
                <SearchIcon />
                <input
                    className="flex py-3 grow items-center placeholder:color-border-primary bg-bg-card outline-0"
                    type="text"
                    placeholder={placeholder}
                    name="searchField"
                />
            </div>
        </form>
    )
}
