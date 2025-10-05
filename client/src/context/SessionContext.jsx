import {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
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
const base_url = import.meta.env.VITE_BACKEND;

const formatTime = (date = new Date()) =>
	new Date(date).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});

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
	const [insightsFromBackend, setInsightsFromBackend] = useState(
		[]
	);
	const [isLoading, setIsLoading] = useState(false);

	// --- Elapsed Time State ---
	const [elapsedTime, setElapsedTime] = useState(0);
	const intervalRef = useRef(null);

	useEffect(() => {
		if (!session.timeStarted) {
			setElapsedTime(0);
			return;
		}

		const startTime = new Date(session.timeStarted);

		if (intervalRef.current) clearInterval(intervalRef.current);

		if (isSessionActive && !isOnBreak) {
			intervalRef.current = setInterval(() => {
				const now = new Date();
				const totalBreakTime = session.breaks.reduce(
					(acc, b) => {
						if (!b[1]) return acc; // ongoing break not counted yet
						return (
							acc + (new Date(b[1]) - new Date(b[0]))
						);
					},
					0
				);

				const secondsElapsed = Math.floor(
					(now - startTime - totalBreakTime) / 1000
				);
				setElapsedTime(
					secondsElapsed >= 0 ? secondsElapsed : 0
				);
			}, 1000);
		}

		return () => clearInterval(intervalRef.current);
	}, [session, isSessionActive, isOnBreak]);

	const formatElapsedTime = () => {
		const hours = Math.floor(elapsedTime / 3600);
		const minutes = Math.floor((elapsedTime % 3600) / 60);
		const seconds = elapsedTime % 60;
		return [
			hours.toString().padStart(2, '0'),
			minutes.toString().padStart(2, '0'),
			seconds.toString().padStart(2, '0'),
		].join(':');
	};

	// --- Session Functions ---
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
		setElapsedTime(0);
		setInsightsFromBackend([]);
	};

	const endSession = async () => {
		const now = new Date();
		const updatedSession = {
			...session,
			timeEnded: now.toISOString(),
			summary: ['string'],
			score: focusPercentage,
		};
		setSession(updatedSession);

		try {
			setIsLoading(true);
			setIsSessionActive(false);
			const token = localStorage.getItem("access_token");

			const res = await fetch(`${base_url}/analyse`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedSession),
			});
			const data = await res.json();
			setInsightsFromBackend(data.summary);
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

		setIsLoading(false);
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
		const now = new Date().toISOString();
		setIsOnBreak(true);
		setSession((prev) => ({
			...prev,
			breaks: [...prev.breaks, [now]],
		}));
		setTimelineEvents((prev) => [
			...prev,
			{
				type: 'break-start',
				title: 'Break Started',
				time: formatTime(),
				icon: Coffee,
				color: 'green',
				xp: null,
			},
		]);
	};

	const breakEnd = () => {
		const now = new Date().toISOString();
		setIsOnBreak(false);
		setSession((prev) => {
			if (prev.breaks.length === 0) return prev;

			const updatedBreaks = [...prev.breaks];
			const lastBreak = updatedBreaks[updatedBreaks.length - 1];

			if (lastBreak.length === 1)
				updatedBreaks[updatedBreaks.length - 1] = [
					lastBreak[0],
					now,
				];

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

	const distractionStart = () => {
		const now = new Date().toISOString();
		setIsNotFocused(true);
		setSession((prev) => ({
			...prev,
			distracted: [...prev.distracted, [now]],
		}));
		setTimelineEvents((prev) => [
			...prev,
			{
				type: 'distraction-start',
				title: 'Distracted',
				time: formatTime(),
				icon: Eye,
				color: 'red',
				xp: -2,
			},
		]);
		setDistractedNum((prev) => prev + 1);
	};

	const distractionEnd = () => {
		const now = new Date().toISOString();
		setIsNotFocused(false);
		setSession((prev) => {
			if (prev.distracted.length === 0) return prev;
			const updatedDistractions = [...prev.distracted];
			const lastDistraction =
				updatedDistractions[updatedDistractions.length - 1];
			if (lastDistraction.length === 1)
				updatedDistractions[updatedDistractions.length - 1] =
					[lastDistraction[0], now];
			return { ...prev, distracted: updatedDistractions };
		});
	};

	const getTotalDistractionTime = (session) => {
		const now = new Date();
		return session.distracted.reduce((total, d) => {
			if (!d[0]) return total;
			const start = new Date(d[0]);
			const end = d[1] ? new Date(d[1]) : now;
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
		if (!session.timeStarted) return setFocusPercentage(100);
		const interval = setInterval(
			() => setFocusPercentage(getFocusPercentage(session)),
			1000
		);
		return () => clearInterval(interval);
	}, [session]);

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
				insightsFromBackend,
				isLoading,
				elapsedTime,
				formatElapsedTime,
				setIsLoading,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context)
		throw new Error(
			'useSession must be used within SessionProvider'
		);
	return context;
};
