import { useRef } from 'react';
import {
    ChevronLeft, ChevronRight, Pencil, Trash2,
    BedSingle, Bath, Ruler, Home
} from 'lucide-react';
import EmptyPropertyImage from '../assests/EmptyPropertyImage.jpg';

const PropertyCard = ({ property, isUser, isAdmin, onEdit, onDelete, onClick }) => {
    const scrollRef = useRef(null);

    // Scroll image carousel left or right
    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = scrollRef.current.clientWidth;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    // Status color mapping for badges
    const statusColors = {
        Available: 'bg-green-100 text-green-600',
        Pending: 'bg-yellow-100 text-yellow-600',
        Sold: 'bg-red-100 text-red-600',
    };

    return (
        <div
            className="bg-white shadow-xl border rounded-xl overflow-hidden flex flex-col relative group cursor-pointer"
            onClick={() => onClick && onClick(property)}
        >
            {/* Image Carousel */}
            <div className="relative w-full overflow-hidden">
                <div ref={scrollRef} className="flex overflow-x-auto scroll-smooth no-scrollbar">
                    {property.images && property.images.length > 0 ? (
                        property.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Image ${index + 1}`}
                                className="h-48 w-full object-cover flex-shrink-0 min-w-full"
                            />
                        ))
                    ) : (
                        <img
                            src={EmptyPropertyImage}
                            alt="No Images"
                            className="h-48 w-full object-cover flex-shrink-0 min-w-full"
                        />
                    )}
                </div>

                {/* Carousel Arrows (shown on hover) */}
                {property.images && property.images.length > 1 && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1 rounded-full shadow hidden group-hover:block"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1 rounded-full shadow hidden group-hover:block"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    {/* Title & Location */}
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    <p className="text-sm text-gray-600">
                        {property.city}, {property.country}
                    </p>

                    {/* Price & Status Badge */}
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-blue-600 font-bold text-lg">
                            {property.price.toLocaleString()} AED
                        </p>
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${statusColors[property.status] || 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {property.status}
                        </span>
                    </div>

                    {/* Features Row */}
                    <div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-700">
                        <span className="flex items-center gap-1"><Home size={16} /> {property.type}</span>
                        <span className="flex items-center gap-1"><BedSingle size={16} /> {property.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath size={16} /> {property.bathrooms}</span>
                        <span className="flex items-center gap-1"><Ruler size={16} /> {property.size} sqft</span>
                    </div>
                </div>

                {/* Admin Buttons (Edit/Delete) */}
                {isAdmin && (
                    <div className="flex justify-start gap-4 mt-6">
                        <button
                            onClick={() => onEdit(property)}
                            className="flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 bg-gray-300 px-4 py-2 rounded w-1/2"
                            title="Edit"
                        >
                            <Pencil size={18} />
                            <span className="text-sm hidden md:inline">Edit</span>
                        </button>
                        <button
                            onClick={() => onDelete(property._id)}
                            className="flex items-center justify-center gap-1 text-red-600 hover:text-red-800 bg-red-200 px-4 py-2 rounded w-1/2"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                            <span className="text-sm hidden md:inline">Delete</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyCard;
