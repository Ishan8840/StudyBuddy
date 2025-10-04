import React, {
	createContext,
	useContext,
	useState,
	useEffect,
} from 'react';
import {
	Clock,
	Zap,
	Hand,
	Eye,
	Coffee,
	AlertCircle,
} from 'lucide-react';

const SessionContext = createContext();

const formatTime = (date = new Date()) => {
	return new Date(date).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const SessionProvider = ({ children }) => {
	const [session, setSession] = useState({
		timeStarted: null,
		timeEnded: null,
		touchedFace: [],
		distracted: [],
		breaks: [],
	});
	const [isSessionActive, setIsSessionActive] = useState(false);
	const [isOnBreak, setIsOnBreak] = useState(false);
	const [timelineEvents, setTimelineEvents] = useState([]);
	const [isNotFocused, setIsNotFocused] = useState(false);
	const [faceTouches, setFaceTouches] = useState(0);
	const [distractedNum, setDistractedNum] = useState(0);
	const [focusPercentage, setFocusPercentage] = useState(100);

	const startSession = () => {
		const now = new Date();
		setSession({
			timeStarted: now.toISOString(),
			timeEnded: null,
			touchedFace: [],
			distracted: [],
			breaks: [],
		});
		setIsSessionActive(true);
		setTimelineEvents([
			{
				type: 'start',
				title: 'Session Start',
				time: formatTime(now),
				icon: Clock,
				color: 'cyan',
				xp: 5,
			},
		]);
		setFaceTouches(0);
		setDistractedNum(0);
	};

	const endSession = async () => {
		const now = new Date();
		const updatedSession = {
			...session,
			timeEnded: now.toISOString(),
			score: focusPercentage,
		};
		setSession(updatedSession);

		try {
			const res = await fetch(
				'http://localhost:5000/session/start',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updatedSession),
				}
			);
			const data = await res.json();
			console.log('✅ Session sent to backend:', data);
		} catch (err) {
			console.error('❌ Failed to end session:', err);
		}

		setTimelineEvents((prev) => [
			...prev,
			{
				type: 'session end',
				title: 'Session End',
				time: formatTime(now),
				icon: Clock,
				color: 'cyan',
				xp: null,
			},
		]);

		setIsSessionActive(false);
	};

	const touchedFace = () => {
		const now = new Date();
		setSession((prev) => ({
			...prev,
			touchedFace: [...prev.touchedFace, now.toISOString()],
		}));
		setTimelineEvents((prev) => [
			...prev,
			{
				type: 'touch',
				title: 'Face Touch',
				time: formatTime(now),
				icon: Hand,
				color: 'orange',
				xp: -5,
			},
		]);
		setFaceTouches((prev) => prev + 1);
	};

	const breakStart = () => {
		const now = new Date();
		setIsOnBreak(true);
		setSession((prev) => ({
			...prev,
			breaks: [...prev.breaks, [now.toISOString()]],
		}));
		setTimelineEvents((prev) => [
			...prev,
			{
				type: 'break-start',
				title: 'Break Started',
				time: formatTime(now),
				icon: Coffee,
				color: 'green',
				xp: null,
			},
		]);
	};

	const breakEnd = () => {
		const now = new Date();
		setIsOnBreak(false);
		setSession((prev) => {
			if (prev.breaks.length === 0) return prev;

			const updatedBreaks = [...prev.breaks];
			const lastBreak = updatedBreaks[updatedBreaks.length - 1];

			updatedBreaks[updatedBreaks.length - 1] = {
				...lastBreak,
				end: now.toISOString(),
			};

			return { ...prev, breaks: updatedBreaks };
		});
		setTimelineEvents((prev) => [
			...prev,
			{
				type: 'break-end',
				title: 'Break Ended',
				time: formatTime(now),
				icon: Coffee,
				color: 'purple',
				xp: null,
			},
		]);
	};

	// ✅ fix: use correct keys timeStarted/timeEnded
	const getTotalDistractionTime = (session) => {
		const now = new Date();
		return session.distracted.reduce((total, d) => {
			if (!d.start) return total;
			const start = new Date(d.start);
			const end = d.end ? new Date(d.end) : now;
			return total + (end - start);
		}, 0);
	};

	const getFocusPercentage = (session) => {
		if (!session.timeStarted) return 100;

		const now = session.timeEnded
			? new Date(session.timeEnded)
			: new Date();
		const totalSessionTime = now - new Date(session.timeStarted);
		if (totalSessionTime <= 0) return 100;

		const distractedTime = getTotalDistractionTime(session);
		const focusTime = totalSessionTime - distractedTime;

		return Math.max(
			0,
			Math.round((focusTime / totalSessionTime) * 100)
		);
	};

	useEffect(() => {
		if (!session.timeStarted) {
			setFocusPercentage(100);
			return;
		}
		const interval = setInterval(() => {
			setFocusPercentage(getFocusPercentage(session));
		}, 1000);

		return () => clearInterval(interval);
	}, [session]);

	const distractionStart = () => {
		if (!isOnBreak) {
			const now = new Date();
			setIsNotFocused(true);
			setSession((prev) => ({
				...prev,
				distracted: [
					...prev.distracted,
					{ start: now.toISOString() },
				],
			}));
			setTimelineEvents((prev) => [
				...prev,
				{
					type: 'distracted',
					title: 'Distracted',
					time: formatTime(now),
					icon: AlertCircle,
					color: 'red',
					xp: -10,
				},
			]);
			setDistractedNum((prev) => prev + 1);
		}
	};

	const distractionEnd = () => {
		const now = new Date();
		setIsNotFocused(false);
		setSession((prev) => {
			if (prev.distracted.length === 0) return prev;

			const updatedDistractions = [...prev.distracted];
			const lastDistraction =
				updatedDistractions[updatedDistractions.length - 1];

			updatedDistractions[updatedDistractions.length - 1] = {
				...lastDistraction,
				end: now.toISOString(),
			};

			return { ...prev, distracted: updatedDistractions };
		});
	};

	return (
		<SessionContext.Provider
			value={{
				session,
				startSession,
				endSession,
				touchedFace,
				breakStart,
				breakEnd,
				distractionStart,
				distractionEnd,
				isSessionActive,
				setIsSessionActive,
				isOnBreak,
				isNotFocused,
				timelineEvents,
				faceTouches,
				setFaceTouches,
				distractedNum,
				setDistractedNum,
				focusPercentage,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error(
			'useSession must be used within SessionProvider'
		);
	}
	return context;
};
