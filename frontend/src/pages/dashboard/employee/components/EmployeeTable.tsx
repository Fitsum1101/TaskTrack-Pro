import { Suspense } from 'react';

import { userColumns } from './EmployeeColumns';
import { demoEmployees } from '../constant/demo';

import { BasicDataGrid } from '@/components/custom/table/BasicDataGridTable';

const EmployeeTable = () => {
	return (
		<Suspense fallback={<div className="p-6">Loading employees...</div>}>
			<BasicDataGrid
				data={demoEmployees}
				columns={userColumns} // Changed from adminColumns to userColumns
				searchPlaceholder="Search employees by name, email, or phone..."
				showSearch
				showPagination
				showAddButton
				showActions
				buttonTitle="Add Employee"
			/>
		</Suspense>
	);
};

export default EmployeeTable;
