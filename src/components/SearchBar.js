"use client"
import React, { useState } from "react";

const SearchBar = () => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle the search logic here (e.g., updating state, fetching results, etc.)
      console.log("Search query:", query);
    };
  
    return (
      <form onSubmit={handleSubmit} className="flex bg-slate-200 rounded-md overflow-hidden">
        <input
          type="text"
          placeholder="Search for a location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 w-64 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
        >
          Search
        </button>
      </form>
    );
}
export default SearchBar;