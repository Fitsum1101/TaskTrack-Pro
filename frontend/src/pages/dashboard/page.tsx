import { useState } from 'react';
import { Outlet } from 'react-router';

import { sidebarItems } from './constant/sidbar';

import { Navbar } from '@/components/custom/navbar';
import Sidebar from '@/components/custom/sidbar/SideBar';

const DashboardPage = () => {
	const [openSidbar, setOpenSidbar] = useState(true);
	return (
		<div className="h-screen flex flex-col overflow-hidden">
			<Navbar onSidebarToggle={() => {}} />
			<div className="flex flex-1 overflow-hidden">
				<Sidebar
					isOpen={openSidbar}
					onToggle={() => setOpenSidbar(!openSidbar)}
					navigation={sidebarItems}
				/>
				<div className="flex-1 overflow-y-auto scrollbar-hide ">
					<main className="p-6">
						<div className="mx-auto max-w-7xl">
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
