import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import CombinedTracker from './components/CombinedTracker.jsx';
import SessionBar from './components/TopBar.jsx';
import { SessionProvider } from './context/SessionContext.jsx';
import SessionTimeline from './components/Timeline.jsx';
import AIInsights from './components/Insights.jsx';
import Signup from './components/SignUp.jsx';
import Login from './components/Login.jsx';

function App() {
	return (
		<SessionProvider>
			<Routes>
				{/* Default dashboard (all 3 together) */}
				<Route
					path="/"
					element={
						<>
							<SessionBar />
							<div
								style={{
									display: 'flex',
									marginTop: '2rem',
									gap: '50px',
								}}
							>
								<CombinedTracker />
								<SessionTimeline />
								<AIInsights />
							</div>
						</>
					}
				/>

				{/* Individual pages */}
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</SessionProvider>
	);
}

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
