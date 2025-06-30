import { Bell, UserCircle, LogOut } from 'lucide-react';
import HomeHiveLogo from '../assests/HomeHiveLogo.png';
import { useNavigate } from 'react-router-dom';

const AdminTopbar = () => {
    const navigate = useNavigate();

    // Handle user logout: remove token and redirect to homepage
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    };

    return (
        <div className="flex items-center justify-between bg-white border border-gray-100 px-10 py-2 shadow-sm sticky top-3 z-30 rounded-xl">
            {/* Logo */}
            <img src={HomeHiveLogo} alt='Logo' className='w-[150px] h-auto' />

            {/* Icon section: Notifications, Profile, Logout */}
            <div className="flex items-center space-x-4 text-gray-600">
                <Bell className="hover:text-blue-600 cursor-pointer" />
                <UserCircle className="hover:text-blue-600 cursor-pointer" />
                <LogOut onClick={handleLogout} className="hover:text-red-600 cursor-pointer" />
            </div>
        </div>
    );
};

export default AdminTopbar;
