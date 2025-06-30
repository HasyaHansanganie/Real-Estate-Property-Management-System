import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, PlusSquare, MessageSquare } from 'lucide-react';

// Sidebar navigation items configuration
const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage List', path: '/admin/manageProperties', icon: List },
    { name: 'Add Property', path: '/admin/addProperty', icon: PlusSquare },
    { name: 'Messages', path: '#', icon: MessageSquare },
];

const AdminSidebar = () => {
    const location = useLocation(); // Get the current route path

    return (
        <aside
            className="
                fixed z-40 bg-[rgb(2,16,41)]                       
                w-full bottom-0 flex flex-row justify-around items-center pt-5 
                md:w-24 md:flex-col md:h-screen md:justify-start md:py-10 md:top-3 md:left-3 md:rounded-xl 
            "
        >
            {/* Render each nav item */}
            {navItems.map(({ name, path, icon: Icon }) => {
                const active = location.pathname === path; // Check if current route matches the nav item

                return (
                    <Link
                        to={path}
                        key={name}
                        className="flex flex-col items-center text-xs text-gray-300 hover:text-white mb-6 md:mb-10"
                    >
                        {/* Icon with dynamic active styling */}
                        <div className={`p-2 rounded-full ${active ? 'bg-white text-[rgb(2,16,41)]' : 'bg-gray-700'} transition`}>
                            <Icon size={24} />
                        </div>

                        {/* Label below the icon */}
                        <span className="text-[10px] md:text-[12px] mt-1">{name}</span>
                    </Link>
                );
            })}
        </aside>
    );
};

export default AdminSidebar;
