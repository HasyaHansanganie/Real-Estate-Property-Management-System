import { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

// Bed and Bath filter options
const bedsOptions = ['Studio', '1', '2', '3', '4', '5', '6', '7', '8+'];
const bathsOptions = ['1', '2', '3', '4', '5', '6+'];

// Default filter
const defaultFilters = {
    listingType: 'Buy',
    city: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: ''
};

const PropertyFilters = ({ filters, onApply }) => {
    // Local filter state for this component
    const [local, setLocal] = useState(filters);

    // Toggles for dropdowns
    const [showBedBath, setShowBedBath] = useState(false);
    const [showPrice, setShowPrice] = useState(false);

    // Helper to update specific filter fields
    const update = (key, value) => setLocal(prev => ({ ...prev, [key]: value }));

    return (
        <div className="w-full flex flex-wrap gap-4 mb-6 items-center justify-start">
            {/* Listing Type Dropdown */}
            <div className="relative">
                <select
                    value={local.listingType}
                    onChange={(e) => update('listingType', e.target.value)}
                    className="appearance-none border border-gray-400 rounded-lg px-3 py-2 pr-10 text-sm bg-white"
                >
                    <option value="Buy">Buy</option>
                    <option value="Rent">Rent</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            {/* City/Area Text Input */}
            <div className="relative min-w-[500px]">
                <input
                    type="text"
                    value={local.city}
                    onChange={e => update('city', e.target.value)}
                    placeholder="Enter city or area"
                    className="border border-gray-400 rounded-lg pl-10 pr-3 py-2 w-full text-sm"
                />
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Property Type Dropdown */}
            <div className="relative w-fit">
                <select
                    value={local.type}
                    onChange={e => update('type', e.target.value)}
                    className="appearance-none border border-gray-400 rounded-lg px-3 py-2 pr-10 text-sm bg-white"
                >
                    <option value="">Home Type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>House</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Beds & Baths Dropdown Toggle */}
            <div className="relative">
                <button
                    onClick={() => setShowBedBath(!showBedBath)}
                    className="border border-gray-400 rounded-lg px-4 py-2 flex items-center gap-2 text-sm"
                >
                    Beds & Baths <ChevronDown className="h-4 w-4 text-gray-500 pointer-events-none" />
                </button>

                {/* Beds & Baths Popup Panel */}
                {showBedBath && (
                    <div className="absolute top-full left-0 z-50 bg-white shadow-lg rounded-xl mt-2 w-72 p-4">
                        {/* Bed Options */}
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold mb-2">Beds</h3>
                            <div className="flex flex-wrap gap-2">
                                {bedsOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => update('bedrooms', opt)}
                                        className={`px-3 py-1 rounded-full border text-sm ${local.bedrooms === opt ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bath Options */}
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold mb-2">Baths</h3>
                            <div className="flex flex-wrap gap-2">
                                {bathsOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => update('bathrooms', opt)}
                                        className={`px-3 py-1 rounded-full border text-sm ${local.bathrooms === opt ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowBedBath(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Price Dropdown Toggle */}
            <div className="relative ">
                <button
                    onClick={() => setShowPrice(!showPrice)}
                    className="border border-gray-400 rounded-lg px-4 py-2 flex items-center gap-2 text-sm"
                >
                    Price <ChevronDown className="h-4 w-4 text-gray-500 pointer-events-none" />
                </button>

                {/* Price Range Input Popup */}
                {showPrice && (
                    <div className="absolute top-full -left-10 z-50 bg-white shadow-lg rounded-xl mt-2 w-80 p-4">
                        <h3 className="text-sm font-semibold mb-2">Price Range</h3>
                        <div className="flex gap-4">
                            {/* Min Price Input */}
                            <div className="flex-1">
                                <label className="text-xs text-gray-600">Minimum</label>
                                <input
                                    list="minPriceOptions"
                                    className="border rounded-lg w-full px-3 py-2 mt-1 text-sm"
                                    value={local.minPrice}
                                    placeholder='0'
                                    onChange={e => update('minPrice', e.target.value)}
                                />
                            </div>

                            {/* Max Price Input */}
                            <div className="flex-1">
                                <label className="text-xs text-gray-600">Maximum</label>
                                <input
                                    list="maxPriceOptions"
                                    className="border rounded-lg w-full px-3 py-2 mt-1 text-sm"
                                    value={local.maxPrice}
                                    placeholder='Any'
                                    onChange={e => update('maxPrice', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowPrice(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Apply Filters Button */}
            <button
                onClick={() => onApply(local)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex-grow"
            >
                Apply
            </button>

            {/* Reset Filters Button */}
            <button
                onClick={() => {
                    setLocal(defaultFilters);
                    onApply(defaultFilters);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex-grow"
            >
                Reset
            </button>
        </div>
    );
};

export default PropertyFilters;
