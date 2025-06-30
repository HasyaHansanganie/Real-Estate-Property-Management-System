import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import DashboardImage from '../assests/AdminDashboardBg.jpg';
import { Building2, Banknote, KeyRound } from 'lucide-react';

const AdminDashboard = () => {
    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();

    // Fetch all properties
    const fetchProperties = async () => {
        try {
            const res = await axios.get('/properties');
            setProperties(res.data);
        } catch (err) {
            console.error('Error fetching properties:', err);
        }
    };

    // Fetch properties on initial render
    useEffect(() => {
        fetchProperties();
    }, []);

    // Count total properties with listingType 'Buy'
    const totalBuy = properties.filter(p => p.listingType === 'Buy').length;

    // Count total properties with listingType 'Rent'
    const totalRent = properties.filter(p => p.listingType === 'Rent').length;

    // Count properties by a specific type (case-insensitive)
    const countByType = type =>
        properties.filter(p => p.type.toLowerCase() === type.toLowerCase()).length;

    // Navigate to edit page with selected property data
    const handleEdit = (property) => {
        navigate('/admin/addProperty', { state: { property } });
    };

    // Delete selected property after confirmation and refresh the list
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
        <div className="mx-auto p-6 space-y-10 bg-white rounded-xl shadow-lg border border-gray-200">
            {/* ================== Welcome & Stats Section ================== */}
            <div className="flex flex-col md:flex-row gap-6">

                {/* Welcome Card with Background Image */}
                <div
                    className="w-full md:w-1/3 bg-cover bg-center flex flex-col justify-center rounded-2xl text-white p-6 shadow-lg"
                    style={{
                        backgroundImage: `url(${DashboardImage})`,
                    }}
                >
                    <h2 className="text-3xl shadow-xl font-bold mb-2">Welcome Back,</h2>
                    <p className="text-md font-bold text-white/90">Here's what’s happening with your listings</p>
                </div>

                {/* Stats Cards: Total Properties, Buy, Rent */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total Properties Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-lg border border-blue-300">
                        <div className="flex flex-col items-start gap-4">
                            <p className="text-lg font-bold text-gray-500">Total Properties</p>
                            <div className='flex flex-row items-center gap-4'>
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <Building2 size={35} />
                                </div>
                                <p className="text-4xl font-bold text-gray-800">{properties.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Properties for Sale Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-lg border border-green-300">
                        <div className="flex flex-col items-start gap-4">
                            <p className="text-lg font-bold text-gray-500">Properties for Sale</p>
                            <div className='flex flex-row items-center gap-4'>
                                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                    <Banknote size={35} />
                                </div>
                                <p className="text-4xl font-bold text-gray-800">{totalBuy.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Properties for Rent Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-lg border border-violet-300 hover:shadow-md transition duration-300">
                        <div className="flex flex-col items-start gap-4">
                            <p className="text-lg font-bold text-gray-500">Properties for Rent</p>
                            <div className='flex flex-row items-center gap-4'>
                                <div className="bg-violet-100 text-violet-600 p-3 rounded-full">
                                    <KeyRound size={35} />
                                </div>
                                <p className="text-4xl font-bold text-gray-800">{totalRent.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================== Recent Listings & Type Breakdown ================== */}
            <div className="flex flex-col md:flex-row gap-10">

                {/* Recent Property Listings */}
                <div className="w-full md:w-2/3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Recent Properties</h3>
                        <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => navigate('/admin/manage')}
                        >
                            See All
                        </button>
                    </div>

                    {/* Show 2 most recent properties */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {properties.slice(-2).reverse().map(p => (
                            <PropertyCard
                                key={p._id}
                                property={p}
                                isAdmin={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>

                {/* Property Types Overview with Progress Bars */}
                <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-lg border">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Property Types</h3>

                    {/* Show stats for Apartments, Villas, Houses */}
                    {['Apartment', 'Villa', 'House'].map((type) => {
                        const count = countByType(type);
                        const percent = (count / properties.length) * 100 || 0;

                        return (
                            <div key={type} className="mb-4">
                                {/* Type name and count */}
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-600 font-medium">{type}s</span>
                                    <span className="text-sm text-gray-500">{count}</span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-in-out"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
