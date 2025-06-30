import { useState, useEffect } from 'react';
import { Search, Home, MapPin, ChevronDown, User, Ruler } from 'lucide-react';
import HomeBg from '../assests/HomePageBg.jpg';
import WhoWeAreImage from '../assests/whoweare.png';
import PropertyCard from '../components/PropertyCard';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    // Fetched property data
    const [properties, setProperties] = useState([]);

    // Filter options used in search
    const [filters, setFilters] = useState({
        listingType: 'Buy', city: '', type: '',
        bedrooms: '', bathrooms: '',
        minPrice: '', maxPrice: ''
    });

    // Fetch properties once component mounts
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await axios.get('/properties');
                setProperties(res.data);
            } catch (err) {
                console.error('Error fetching properties:', err);
            }
        };
        fetchProperties();
    }, []);

    // Update filters based on user input
    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    // Get top 3 most recent properties
    const recentProperties = properties.slice(0, 3);

    // Company stats display data
    const companyStats = [
        {
            icon: <Home className="w-6 h-6" />,
            bg: "bg-blue-100",
            textColor: "text-blue-600",
            value: "1200+",
            label: "Properties Sold"
        },
        {
            icon: <Ruler className="w-6 h-6" />,
            bg: "bg-green-100",
            textColor: "text-green-600",
            value: "10+ Years",
            label: "Experience"
        },
        {
            icon: <User className="w-6 h-6" />,
            bg: "bg-yellow-100",
            textColor: "text-yellow-600",
            value: "800+",
            label: "Happy Clients"
        }
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* ---------- Hero Section ---------- */}
            <div className="relative h-[450px] bg-cover bg-center" style={{ backgroundImage: `url(${HomeBg})` }}>
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center text-white text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-32">Find Your Dream Home Today</h1>
                    <p className="text-lg max-w-xl">
                        Discover the best properties for sale and rent in your city with HomeHive — your trusted real estate partner.
                    </p>
                </div>

                {/* ---------- Search Filters ---------- */}
                <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 w-[52%] bg-white rounded-2xl border shadow-xl p-6">

                    {/* Filter Row 1: Listing Type and Location */}
                    <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4 items-center">
                        {/* Buy/Rent toggle buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleFilterChange('listingType', 'Buy')}
                                className={`px-4 py-2 rounded-full border border-gray-400 ${filters.listingType === 'Buy' ? 'bg-[rgb(18,31,54)] text-white' : 'bg-white text-gray-600'}`}>
                                Buy
                            </button>
                            <button
                                onClick={() => handleFilterChange('listingType', 'Rent')}
                                className={`px-4 py-2 rounded-full border border-gray-400 ${filters.listingType === 'Rent' ? 'bg-[rgb(18,31,54)] text-white' : 'bg-white text-gray-600'}`}>
                                Rent
                            </button>
                        </div>

                        {/* Location input field with icon */}
                        <div className="relative w-[75%] border border-gray-400 rounded-md">
                            <input
                                type="text"
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                placeholder="Enter city or area"
                                className="flex-1 pl-10 pr-3 py-2 rounded-md w-full"
                            />
                            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Filter Row 2: Property details */}
                    <div className="flex gap-4">
                        {/* Property Type Selector */}
                        <div className="relative w-fit">
                            <select
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="appearance-none border border-gray-400 rounded-lg px-3 py-2 pr-12"
                            >
                                <option value="">Home Type</option>
                                <option>Apartment</option>
                                <option>Villa</option>
                                <option>House</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Bedroom Selector */}
                        <div className="relative w-fit">
                            <select className="appearance-none px-3 py-2 pr-12 border border-gray-400 rounded-md" onChange={(e) => handleFilterChange('bedrooms', e.target.value)}>
                                <option value="">Beds</option>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+ Beds</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Bathroom Selector */}
                        <div className="relative w-fit">
                            <select className="appearance-none px-3 py-2 pr-12 border border-gray-400 rounded-md" onChange={(e) => handleFilterChange('bathrooms', e.target.value)}>
                                <option value="">Baths</option>
                                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}+ Baths</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Max Price Selector */}
                        <div className="relative w-fit">
                            <select className="appearance-none px-3 py-2 pr-12 border border-gray-400 rounded-md" onChange={(e) => handleFilterChange('maxPrice', e.target.value)}>
                                <option value="">Max Price</option>
                                {[50000, 100000, 200000, 500000].map(p => <option key={p} value={p}>{p.toLocaleString()} AED</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Search Button */}
                        <button className="p-2 px-3 bg-[rgb(18,31,54)] text-white rounded-full"
                            onClick={() => navigate('/propertyList', {
                                state: {
                                    properties,
                                    filters
                                }
                            })}>
                            <Search size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------- Who We Are Section ---------- */}
            <div className="px-6 md:pl-32 md:pr-0 grid md:grid-cols-2 gap-20 items-center">
                {/* Description and stats */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Who We Are</h2>
                    <p className="text-gray-600 text-justify leading-relaxed">
                        At HomeHive, we are committed to making your property journey seamless and rewarding. Whether you're buying your first home, investing in real estate, or finding the perfect rental, our curated listings and expert support are here to guide you every step of the way.
                    </p>

                    {/* Company Stats */}
                    <div className="flex gap-10 mt-10">
                        {companyStats.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className={`${item.bg} ${item.textColor} p-3 rounded-full`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-800">{item.value}</p>
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image */}
                <img src={WhoWeAreImage} alt="Who We Are" className='w-[500px]' />
            </div>

            {/* ---------- Recent Properties Section ---------- */}
            <div className="px-6 md:px-32 pb-20">
                <h3 className="text-2xl font-semibold text-gray-800 mb-10">Recent Listings</h3>

                {/* Grid of recent PropertyCard components */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentProperties.map((p) => (
                        <PropertyCard key={p._id} property={p} />
                    ))}
                </div>
            </div>

            {/* Footer Spacer (placeholder) */}
            <div className='w-full h-10 bg-[rgb(1,12,31)]'></div>
        </div>
    );
}

export default HomePage;
