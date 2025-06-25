import './styles/search.css'
import { SearchIcon } from './icons/searchIcon'

type SearchProps = {
    placeholder: string
}

export const Search = ({ placeholder }: SearchProps) => {
    return (
        <form className="searchContainer">
            <div className="searchContent">
                <SearchIcon />
                <input
                    className="input"
                    type="text"
                    placeholder={placeholder}
                    name="searchField"
                />
            </div>
        </form>
    )
}
