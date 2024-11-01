import React, { useState } from "react"
import searchIcon from "../../img/search-icon.svg"
import "./SearchBar.css"

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Buscar...", onSearch }) => {
  const [query, setQuery] = useState<string>("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
      />
      <button type="submit" className="search-button">
        <img src={searchIcon} alt="Buscar" className="search-icon"/>
      </button>
    </form>
  )
}

export default SearchBar
