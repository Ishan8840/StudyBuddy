import { useState } from 'react';
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
		isOnBreak,
		session,
		elapsedTime,
		formatElapsedTime,
	} = useSession();

	const [confirmAction, setConfirmAction] = useState(null);

	const handleConfirm = () => {
		if (confirmAction === 'start') startSession();
		if (confirmAction === 'end') endSession();
		setConfirmAction(null);
	};

	const renderTime = (time) =>
		time
			? new Date(time).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
			  })
			: '--:--';

	return (
		<>
			<div className="session-bar">
				<div style={{ display: 'flex', gap: '10px' }}>
					{/* Session Start */}
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
								{renderTime(session.timeStarted)}
							</div>
						</div>
					</div>

					<hr />

					{/* Elapsed Time */}
					<div className="time-block">
						<Zap className="icon elapsed-icon" />
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<div className="label">Elapsed</div>
							<div className="elapsed">
								{formatElapsedTime()}
							</div>
						</div>
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						gap: '10px',
						marginTop: '10px',
					}}
				>
					{/* Break / Resume Buttons */}
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

						{/* Start / End Session Buttons */}
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

					{/* Session End */}
					<div className="time-block">
						<Clock className="icon end" />
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<div className="label">Session End</div>
							<div className="end-time">
								{renderTime(session.timeEnded)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Confirm Modal */}
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
