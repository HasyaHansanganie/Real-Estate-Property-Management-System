import { useState } from 'react';
import HomeHiveLogo from '../assests/HomeHiveLogo.png'
import AuthModal from '../components/AuthModal';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

function HomeNavBar() {

    // Check if user is logged in and authenticated using token stored in localStorage
    const [isUser, setIsUser] = useState(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
            return payload.role === 'user';
        } catch {
            return false;
        }
    });

    const [showDropdown, setShowDropdown] = useState(false); // State to toggle user dropdown menu
    const [showAuthModal, setShowAuthModal] = useState(false); // State to toggle login/signup modal

    // Handle logout logic: remove token and update UI state
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsUser(false);
        setShowDropdown(false);
    };

    return (
        <div className="mx-auto px-10 py-2 flex items-center justify-between">
            {/* Logo */}
            <img src={HomeHiveLogo} alt='Logo' className='w-[200px]' />

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
                <Link to="/" className='hover:text-blue-900 hover:font-bold'>Home</Link>

                {/* Buy page with default filters passed as state */}
                <Link
                    to={{ pathname: "/propertyList", }}
                    state={{
                        filters: {
                            listingType: "Buy", city: '', type: '', bedrooms: '', bathrooms: '', minPrice: '', maxPrice: ''
                        },
                        properties: []
                    }}
                    className='hover:text-blue-900 hover:font-bold'
                >
                    Buy
                </Link>

                {/* Rent page with default filters passed as state */}
                <Link
                    to={{ pathname: "/propertyList", }}
                    state={{
                        filters: {
                            listingType: "Rent", city: '', type: '', bedrooms: '', bathrooms: '', minPrice: '', maxPrice: ''
                        },
                        properties: []
                    }}
                    className='hover:text-blue-900 hover:font-bold'
                >
                    Rent
                </Link>

                <a href="#" className='hover:text-blue-900 hover:font-bold'>Contact Us</a>
            </div>

            {/* User dropdown or login/signup button */}
            <div className="relative">
                {isUser ? (
                    <>
                        {/* User Icon to toggle dropdown */}
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-10 h-10 rounded-full bg-[rgb(18,31,54)] flex items-center justify-center hover:bg-blue-900"
                        >
                            <span className="text-gray-600 font-bold"><User size={20} className='bg-[rgb(18,31,54)] text-white hover:bg-blue-900' /></span>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                                <Link to="#" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                                <Link to="#" className="block px-4 py-2 hover:bg-gray-100">Saved Properties</Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // Show Login/Signup button if user is not logged in
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-[rgb(18,31,54)] text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        Login / Signup
                    </button>
                )}
            </div>

            {/* Render the authentication modal when triggered */}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    setIsUser={setIsUser}
                />
            )}
        </div>
    );
}

export default HomeNavBar;