import { useEffect, useState } from 'react';
import './TopBar.css';
import { Clock, Pause, Play, StopCircle, Zap } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { ConfirmModal } from './Modal';

export default function SessionBar() {
	const {
		startSession,
		endSession,
		breakStart,
		breakEnd,
		isSessionActive,
		session,
		isOnBreak,
	} = useSession();

	const [confirmAction, setConfirmAction] = useState(null);
	const [elapsedTime, setElapsedTime] = useState('--:--:--');

	const handleConfirm = () => {
		if (confirmAction === 'start') startSession();
		if (confirmAction === 'end') endSession();
		setConfirmAction(null);
	};
	useEffect(() => {
		if (!isSessionActive || !session.timeStarted) {
			setElapsedTime('--:--:--');
			return;
		}

		const interval = setInterval(() => {
			const start = new Date(session.timeStarted).getTime();
			const now = Date.now();
			const diff = now - start;

			const hours = Math.floor(diff / 3600000);
			const minutes = Math.floor((diff % 3600000) / 60000);
			const seconds = Math.floor((diff % 60000) / 1000);

			setElapsedTime(
				`${hours.toString().padStart(2, '0')}:${minutes
					.toString()
					.padStart(2, '0')}:${seconds
					.toString()
					.padStart(2, '0')}`
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [isSessionActive, session.timeStarted]);

	return (
		<>
			<div className="session-bar">
				<div style={{ display: 'flex', gap: '10px' }}>
					<div className="time-block">
						<Clock className="icon start" />
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<div className="label">Session Start</div>
							<div className="time">
								{session.timeStarted
									? new Date(
											session.timeStarted
									  ).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
									  })
									: '--:--'}
							</div>
						</div>
					</div>
					<hr />
					<div className="time-block">
						<Zap className="icon elapsed-icon" />
						<div>
							<div className="label">Elapsed</div>
							<div className="elapsed">
								{elapsedTime}
							</div>
						</div>
					</div>
				</div>

				<div style={{ display: 'flex', gap: '10px' }}>
					<div className="button-group">
						{isSessionActive &&
							(!isOnBreak ? (
								<button
									className="break-btn"
									onClick={breakStart}
								>
									<Pause size={15} /> Take a Break
								</button>
							) : (
								<button
									className="break-btn"
									onClick={breakEnd}
								>
									<Play size={15} /> Resume
								</button>
							))}
						{isSessionActive ? (
							<button
								className="end-btn"
								onClick={() =>
									setConfirmAction('end')
								}
							>
								<StopCircle size={15} /> End Session
							</button>
						) : (
							<button
								className="start-btn"
								onClick={() =>
									setConfirmAction('start')
								}
							>
								<Play size={15} /> Start Session
							</button>
						)}
					</div>
					<hr />
					<div className="time-block">
						<Clock className="icon end" />
						<div>
							<div className="label">Session End</div>
							<div className="end-time">
								{session.timeEnded
									? new Date(
											session.timeEnded
									  ).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
									  })
									: '--:--'}
							</div>
						</div>
					</div>
				</div>
			</div>

			{confirmAction && (
				<ConfirmModal
					message={
						confirmAction === 'start'
							? 'Are you sure you want to start a new session?'
							: "Are you sure you want to end this session? Your progress will be saved and you'll see a summary of your focus metrics."
					}
					onConfirm={handleConfirm}
					onCancel={() => setConfirmAction(null)}
				/>
			)}
		</>
	);
}
