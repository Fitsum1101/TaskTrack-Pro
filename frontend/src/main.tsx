import { createRoot } from 'react-dom/client';

import './index.css';
// import { Provider } from 'react-redux';
// import { BrowserRouter, Route, Routes } from 'react-router';
// import { Toaster } from 'sonner';

import App from './App.tsx';
// import EmployeePage from './pages/dashboard/employee/EmployeePage.tsx';
// import DashboardPage from './pages/dashboard/page.tsx';
// import { store } from './store/app.ts';

createRoot(document.getElementById('root')!).render(
	<>
		{/* <Provider store={store}>
			<Toaster />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />}>
						<Route path="/" element={<DashboardPage />}>
							<Route path="employees" element={<EmployeePage />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider> */}
		<App />
	</>
);
