import { FilterPrimary, FilterType } from '@/app/lib/types/types';
import React from 'react'

interface FilterProps {
  filter: FilterPrimary
  setFilter: (filter: FilterType) => void
}
function FiltersGroup({ filter, setFilter }: FilterProps) {
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter([e.target.value as FilterPrimary, 'rating']);
  };

  const isThisFilter = (text: FilterPrimary) => {
    return filter === text
  }

  return (
    <div className="flex items-center justify-center border-b border-white/40 w-full">
      <div className="flex">
        <label
          className={`p-2 cursor-pointer ${
            isThisFilter('title') ? "bg-storm-100/30" : "hover:bg-storm-100/20"
          }`}
        >
          <input
            type="radio"
            name="options"
            value="title"
            className="hidden"
            checked={isThisFilter('title')}
            onChange={handleOptionChange}
          />
          <span>Componente</span>
        </label>
        <label
          className={`p-2 cursor-pointer ${
            isThisFilter('technology') ? "bg-storm-100/30" : "hover:bg-storm-100/20"
          }`}
        >
          <input
            type="radio"
            name="options"
            value="technology"
            className="hidden"
            checked={isThisFilter('technology')}
            onChange={handleOptionChange}
          />
          <span>Tecnologia</span>
        </label>
        <label
          className={`p-2 cursor-pointer ${
            isThisFilter('user') ? "bg-storm-100/30" : "hover:bg-storm-100/20"
          }`}
        >
          <input
            type="radio"
            name="options"
            value="user"
            className="hidden"
            checked={isThisFilter('user')}
            onChange={handleOptionChange}
          />
          <span>Usuario</span>
        </label>
      </div>
    </div>
  );
}

export default FiltersGroup