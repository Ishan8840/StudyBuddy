import CombinedTracker from './components/CombinedTracker';
import AIInsights from './components/Insights';
import SessionHistory from './components/PastSessions';
import StatsDashboard from './components/Stats';
import SessionTimeline from './components/Timeline';
import Toggle from './components/Toggle';
import SessionBar from './components/TopBar';
import { useSession } from './context/SessionContext';

export const MainPage = () => {
	const { isCurrentSession } = useSession(); // I assume you meant isSessionActive

	if (!isCurrentSession)
		return (
			<>
				<SessionBar />
				<Toggle />
				<StatsDashboard />
				<SessionHistory />
			</>
		); // early return if no session

	return (
		<>
			<SessionBar />
			<Toggle />
			<div
				style={{
					display: 'flex',
					marginTop: '2rem',
					gap: '50px',
				}}
			>
				<SessionTimeline />
				<CombinedTracker />
				<AIInsights />
			</div>
		</>
	);
};
