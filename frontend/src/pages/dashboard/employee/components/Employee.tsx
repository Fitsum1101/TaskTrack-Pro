import EmployeeTable from './EmployeeTable';

const Employee = () => {
	return (
		<div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-[1600px] mx-auto">
			{/* Header */}
			<div className="mb-8 lg:mb-10">
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
					<div className="space-y-3">
						<div className="relative">
							<h1
								className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
								style={{ color: '#E5D9C6' }}
							>
								Employees
							</h1>
							<div className="luxury-line w-24 mt-2" />
						</div>
						<p className="mt-4 text-sm text-[#A89A72] max-w-xl leading-relaxed">
							Manage your employees, their roles, and account settings
						</p>
					</div>

					{/* Optional: Add filter by role dropdown */}
					<div className="flex items-center gap-3">
						<select className="px-4 py-2 bg-[#1C1A16] border border-[#413E34] rounded-lg text-sm text-[#E5D9C6] focus:outline-none focus:ring-2 focus:ring-[#B59F6B]">
							<option value="">All Roles</option>
							<option value="ADMIN">Admin</option>
							<option value="MANAGER">Manager</option>
							<option value="EMPLOYEE">Employee</option>
						</select>
					</div>
				</div>
			</div>
			{/* Table */}
			<div className="mt-6 lg:mt-8 space-y-4">
				<EmployeeTable />
			</div>
		</div>
	);
};

export default Employee;
