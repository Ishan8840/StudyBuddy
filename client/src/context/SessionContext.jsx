import React, { createContext, useContext, useState } from 'react';
import { Clock, Zap, Hand, Eye, Coffee } from 'lucide-react';

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
	};

	const endSession = async () => {
		const now = new Date();
		const updatedSession = {
			...session,
			timeEnded: now.toISOString(),
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
				type: 'break',
				title: 'Resume Session',
				time: formatTime(now),
				icon: Coffee,
				color: 'green',
				xp: null,
			},
		]);
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
				isSessionActive,
				setIsSessionActive,
				isOnBreak,
				timelineEvents,
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
