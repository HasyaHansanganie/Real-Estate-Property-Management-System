import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import MapView from '../components/MapView';
import PropertyDetailModal from '../components/PropertyDetailModal';

const PropertyList = () => {

    // Role-based state
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Initial state from route (if passed)
    const initialProperties = location.state?.properties || [];
    const initialFilters = location.state?.filters || {
        listingType: 'Buy', city: '', type: '',
        bedrooms: '', bathrooms: '', minPrice: '', maxPrice: ''
    };

    // State for property data and filtering
    const [properties, setProperties] = useState(initialProperties);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filters, setFilters] = useState(initialFilters);

    // Function for fetch all properties
    const fetchProperties = async () => {
        try {
            const res = await axios.get('/properties');
            setProperties(res.data);
        } catch (err) {
            console.error('Error fetching properties:', err);
        }
    };

    // On mount: fetch properties if not passed in, decode user role from token
    useEffect(() => {
        if (initialProperties.length === 0) {
            fetchProperties();
        }
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(payload.role === 'admin');
                setIsUser(payload.role === 'user');
            } catch {
                setIsAdmin(false);
                setIsUser(false);
            }
        }
    }, []);

    // Apply filters from UI
    const handleApplyFilters = (newFilters) => setFilters(newFilters);

    // Function to filter properties based on criteria
    const applyFiltersToList = (props, filterValues) => {
        return props.filter((p) => {
            const {
                listingType, city, type,
                bedrooms, bathrooms,
                minPrice, maxPrice
            } = filterValues;

            return (
                (!listingType || p.listingType === listingType) &&
                (!city || p.city?.toLowerCase().includes(city.toLowerCase())) &&
                (!type || p.type === type) &&
                (!bedrooms || parseInt(p.bedrooms) === parseInt(bedrooms)) &&
                (!bathrooms || parseInt(p.bathrooms) === parseInt(bathrooms)) &&
                (!minPrice || p.price >= parseInt(minPrice)) &&
                (!maxPrice || p.price <= parseInt(maxPrice))
            );
        });
    };

    // Re-calculate filtered list whenever data or filters change
    useEffect(() => {
        setFilteredProperties(applyFiltersToList(properties, filters));
    }, [properties, filters]);

    // Property Details Modal state
    const [selectedProperty, setSelectedProperty] = useState(null);

    // Close modal handler
    const handleCloseModal = () => setSelectedProperty(null);

    // Navigate to edit property form
    const handleEdit = (property) => {
        navigate('/admin/addProperty', { state: { property } });
    };

    // Delete a property
    const handleDelete = async (id) => {
        if (window.confirm('Delete this property?')) {
            try {
                await axios.delete(`/properties/${id}`);
                fetchProperties();
            } catch (err) {
                console.error('Delete failed', err);
            }
        }
    };

    return (
        <div className="h-full flex flex-col p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Filter Controls */}
            <PropertyFilters filters={filters} onApply={handleApplyFilters} />

            <div className="flex flex-1 overflow-hidden mt-4 min-h-0">

                {/* Property Cards List */}
                <div className="w-full md:w-2/3 overflow-y-auto h-full pr-4">
                    <h1 className="text-2xl font-bold mb-6">Properties Listing</h1>
                    {filteredProperties.length === 0 ? (
                        <p className="text-center text-gray-500">No properties found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredProperties.map((p) => (
                                <PropertyCard
                                    key={p._id}
                                    property={p}
                                    isUser={isUser}
                                    isAdmin={isAdmin}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onClick={() => setSelectedProperty(p)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Show Property Detail Modal when required*/}
                {selectedProperty && (
                    <PropertyDetailModal
                        property={selectedProperty}
                        onClose={handleCloseModal}
                    />
                )}

                {/* Map Sidebar */}
                <div className="hidden md:block md:w-1/3 h-[600px]">
                    <MapView properties={filteredProperties} />
                </div>
            </div>
        </div>
    );
};

export default PropertyList;
