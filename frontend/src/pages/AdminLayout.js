import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();
    const isPropertyPage = location.pathname.includes('/admin/manageProperties');

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Fixed Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-4 pb-28 md:pb-0 md:ml-28 flex flex-col h-full">
                <AdminTopbar />
                <main className={`flex-1 mt-3 ${isPropertyPage ? 'overflow-hidden' : 'overflow-y-auto'} min-h-0`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
