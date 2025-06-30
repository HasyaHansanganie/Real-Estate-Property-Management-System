import React, { useState } from 'react';
import {
    ChevronLeft, Heart, BedSingle, Bath, Ruler, Home,
    ParkingCircle, Dumbbell, Waves, Mail, Phone, User
} from 'lucide-react';
import MapView from './MapView';
import HomeHiveLogo from '../assests/HomeHiveLogo.png';

const PropertyDetailModal = ({ property, onClose }) => {
    const [showFullImageView, setShowFullImageView] = useState(false);

    if (!property) return null;

    // Colors for status badge
    const statusColors = {
        Available: 'bg-green-100 text-green-600',
        Pending: 'bg-yellow-100 text-yellow-600',
        Sold: 'bg-red-100 text-red-600',
    };

    // Icons for extra amenities
    const extrasIcons = {
        parking: <ParkingCircle size={16} />,
        gym: <Dumbbell size={16} />,
        pool: <Waves size={16} />,
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
            <div className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col relative animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center border-b p-4">
                    <button onClick={onClose} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        <ChevronLeft className="h-4 w-4 text-gray-500" />
                        Back to search
                    </button>

                    <img src={HomeHiveLogo} alt="HomeHive" className="w-32" />
                    <button className="text-gray-600 hover:text-red-500 mr-4">
                        <Heart size={20} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6 ">

                    {/* Top Image Section */}
                    <div className="w-full px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px]">

                            {/* Main Image */}
                            <div>
                                <img
                                    src={property.images[0]}
                                    alt="Main"
                                    className="w-full h-[350px] object-cover rounded-xl cursor-pointer"
                                    onClick={() => setShowFullImageView(true)}
                                />
                            </div>

                            {/* 2 Sub Images */}
                            <div className="grid grid-rows-2 gap-4">
                                {property.images.slice(1, 3).map((img, i) => {
                                    const isLastVisible = i === 1 && property.images.length > 3;
                                    return (
                                        <div key={i} className="relative">
                                            <img
                                                src={img}
                                                alt={`Sub ${i}`}
                                                className="w-full h-[167px] object-cover rounded-xl cursor-pointer"
                                                onClick={() => setShowFullImageView(true)}
                                            />
                                            {/* Show "+ more" overlay if more images */}
                                            {isLastVisible && (
                                                <div
                                                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-lg font-semibold rounded-xl cursor-pointer"
                                                    onClick={() => setShowFullImageView(true)}
                                                >
                                                    +{property.images.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Full Image View Modal */}
                        {showFullImageView && (
                            <div className="fixed inset-0 bg-black/80 z-[9999] flex justify-center items-start pt-10 px-4 overflow-auto">
                                <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-xl">

                                    {/* Full Image Header */}
                                    <div className="flex justify-between items-center p-4 bg-white shadow">
                                        <button
                                            onClick={() => setShowFullImageView(false)}
                                            className="flex items-center text-blue-600 text-sm hover:underline"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Property Details
                                        </button>
                                        <img src={HomeHiveLogo} alt="Logo" className="h-8" />
                                        <div></div> {/* spacer */}
                                    </div>

                                    {/* Scrollable Images */}
                                    <div className="overflow-y-auto p-6 space-y-4">
                                        {property.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`Full ${i}`}
                                                className="w-full max-w-md mx-auto rounded-xl object-cover"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="w-full px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Left Column - Description & Info */}
                        <div className="md:col-span-2">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                            <p className="text-gray-600 mb-2">{property.city}, {property.country}</p>
                            <p className="text-blue-600 font-bold text-2xl mb-4">{property.price.toLocaleString()} AED</p>

                            {/* Tags Row */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
                                <span className="flex items-center gap-2"><Home size={18} /> {property.type}</span>
                                <span className="flex items-center gap-2"><BedSingle size={18} /> {property.bedrooms}</span>
                                <span className="flex items-center gap-2"><Bath size={18} /> {property.bathrooms}</span>
                                <span className="flex items-center gap-2"><Ruler size={18} /> {property.size} sqft</span>
                                <span className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full ${statusColors[property.status] || 'bg-gray-200 text-gray-600'}`}>
                                    {property.status}
                                </span>
                                {property.extras?.parking && <span className="px-2 py-1 bg-gray-100 rounded">Parking</span>}
                                {property.extras?.gym && <span className="px-2 py-1 bg-gray-100 rounded">Gym</span>}
                                {property.extras?.pool && <span className="px-2 py-1 bg-gray-100 rounded">Pool</span>}
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                            <p className="text-sm text-gray-400 mt-6">
                                Last updated: {new Date(property.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Right Column - Agent Contact Info */}
                        <div className="bg-gray-100 rounded-xl p-6 shadow border">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Agent</h3>

                            {/* Agent Avatar & Name */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gray-500 text-white flex items-center justify-center rounded-full">
                                    <User size={24} />
                                </div>
                                <div className="text-gray-800">
                                    <div className="font-medium text-lg">{property.contactName}</div>
                                    <div className="text-sm text-gray-500">Real Estate Agent</div>
                                </div>
                            </div>

                            {/* Email & Phone */}
                            <div className="space-y-4 text-md">
                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-blue-600" />
                                    <span>{property.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={20} className="text-blue-600" />
                                    <span>{property.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="w-full px-6 mt-10 pb-10">
                        <div className="w-full h-[400px] rounded-xl overflow-hidden">
                            <MapView properties={[property]} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailModal;
