import { Outlet, useLocation } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar'

const HomeLayout = () => {
    const location = useLocation();
    const isPropertyPage = location.pathname.includes('/propertyList');

    return (
        <div className="flex h-screen bg-white">

            {/* Home Nav Bar */}
            <nav className="w-full fixed top-0 z-30 shadow-md bg-white">
                <HomeNavBar />
            </nav>

            {/* Main Content Area */}
            <div className={`flex-1 mt-[73px] ${isPropertyPage ? 'overflow-hidden' : 'overflow-y-auto'} min-h-0`}>
                <Outlet />
            </div>
        </div>
    );
};

export default HomeLayout;
