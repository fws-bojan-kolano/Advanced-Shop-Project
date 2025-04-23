import './filters.scss';
import { useEffect, useRef, useState } from "react";

export default function Filters({filters, setFilters, categories, creators}) {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        console.log("Filters updated:", filters);
    }, [filters]);

    const toggleCheckboxValue = (key, value) => {
        const updatedArray = filters[key].includes(value)
            ? filters[key].filter(item => item !== value)
            : [...filters[key], value];
    
        setFilters(prev => ({ ...prev, [key]: updatedArray }));
    };
    
    const handleCategoryChange = category => toggleCheckboxValue('categories', category);
    const handleCreatorChange = creator => toggleCheckboxValue('creators', creator);

    return (
        <div className="filters">
            <h2 className='filters__title'>Filters</h2>
            <div className="filters__content">
                <div className="filters__category">
                    Categories:<br/>
                    {categories.map(cat => (
                        <label key={cat}>
                            <input type="checkbox" value={cat} checked={filters.categories.includes(cat)} onChange={() => handleCategoryChange(cat)} />
                            {cat}
                        </label>
                    ))}
                </div>
                <div className="filters__price">
                    From price: <input type="number" name='priceMin' placeholder='Min' value={filters.priceMin} onChange={handleChange} />
                    To: <input type="number" name='priceMax' placeholder='Max' value={filters.priceMax} onChange={handleChange} />
                </div>
                <div className="filters__creator">
                    Creators:<br/>
                    {creators.map(cre => (
                        <label key={cre}>
                            <input
                                type="checkbox"
                                value={cre}
                                checked={filters.creators.includes(cre)}
                                onChange={() => handleCreatorChange(cre)}
                                />
                            {cre}
                        </label>
                    ))}
                </div>
                <div className="filters__recommended">
                    <label>
                        <input
                            type="radio"
                            name="recommended"
                            value="recommended"
                            checked={filters.recommended === "true"}
                            onChange={handleChange}
                        />
                        Recommended
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="recommended"
                            value="not_recommended"
                            checked={filters.recommended === "false"}
                            onChange={handleChange}
                        />
                        Not Recommended
                    </label>
                </div>
            </div>
        </div>
    )
}