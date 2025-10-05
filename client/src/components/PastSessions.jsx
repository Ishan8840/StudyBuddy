import {
	Calendar,
	Clock,
	Circle,
	Hand,
	Eye,
	Zap,
} from 'lucide-react';

export default function SessionHistory() {
	const sessions = [
		{
			date: 'Oct 2, 2025',
			duration: '2h 30m',
			focusScore: 92,
			pomodoros: 5,
			touches: 8,
			distractions: 5,
			xp: 250,
		},
		{
			date: 'Oct 1, 2025',
			duration: '1h 45m',
			focusScore: 85,
			pomodoros: 3,
			touches: 12,
			distractions: 8,
			xp: 180,
		},
		{
			date: 'Sep 30, 2025',
			duration: '3h 15m',
			focusScore: 95,
			pomodoros: 6,
			touches: 5,
			distractions: 3,
			xp: 320,
		},
	];

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<h1 style={styles.title}>Session History</h1>
				<span style={styles.sessionCount}>3 sessions</span>
			</div>

			<div style={styles.sessionList}>
				{sessions.map((session, index) => (
					<div key={index} style={styles.sessionCard}>
						<div style={styles.sessionHeader}>
							<div style={styles.sessionInfo}>
								<div style={styles.dateRow}>
									<Calendar
										size={18}
										color="#3b82f6"
									/>
									<span style={styles.date}>
										{session.date}
									</span>
								</div>
								<div style={styles.durationRow}>
									<Clock
										size={16}
										color="#6b7280"
									/>
									<span style={styles.duration}>
										{session.duration}
									</span>
								</div>
							</div>
							<div style={styles.focusScoreContainer}>
								<span style={styles.focusLabel}>
									Focus Score
								</span>
								<span style={styles.focusScore}>
									{session.focusScore}%
								</span>
							</div>
						</div>

						<div style={styles.statsGrid}>
							<div style={styles.statCard}>
								<Circle size={16} color="#a855f7" />
								<span style={styles.statLabel}>
									Pomodoros
								</span>
								<span
									style={{
										...styles.statValue,
										color: '#a855f7',
									}}
								>
									{session.pomodoros}
								</span>
							</div>

							<div style={styles.statCard}>
								<Hand size={16} color="#ec4899" />
								<span style={styles.statLabel}>
									Touches
								</span>
								<span
									style={{
										...styles.statValue,
										color: '#ec4899',
									}}
								>
									{session.touches}
								</span>
							</div>

							<div style={styles.statCard}>
								<Eye size={16} color="#06b6d4" />
								<span style={styles.statLabel}>
									Distractions
								</span>
								<span
									style={{
										...styles.statValue,
										color: '#06b6d4',
									}}
								>
									{session.distractions}
								</span>
							</div>

							<div style={styles.statCard}>
								<Zap size={16} color="#f59e0b" />
								<span style={styles.statLabel}>
									XP
								</span>
								<span
									style={{
										...styles.statValue,
										color: '#f59e0b',
									}}
								>
									+{session.xp}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

const styles = {
	container: {
		backgroundColor: '#0a0a0a',
		minHeight: '100vh',
		padding: '24px',
		color: 'white',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '24px',
	},
	title: {
		fontSize: '24px',
		fontWeight: '600',
		margin: 0,
		background: 'linear-gradient(to right, #06b6d4, #a855f7)',
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		backgroundClip: 'text',
	},
	sessionCount: {
		color: '#9ca3af',
		fontSize: '14px',
	},
	sessionList: {
		display: 'flex',
		flexDirection: 'column',
		gap: '16px',
	},
	sessionCard: {
		backgroundColor: '#1a1a1a',
		border: '1px solid #2a2a2a',
		borderRadius: '12px',
		padding: '20px',
		transition: 'transform 0.2s ease, box-shadow 0.2s ease',
	},
	sessionHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: '20px',
		paddingBottom: '16px',
		borderBottom: '1px solid #2a2a2a',
	},
	sessionInfo: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
	},
	dateRow: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
	},
	date: {
		fontSize: '16px',
		fontWeight: '600',
		color: '#ffffff',
	},
	durationRow: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
	},
	duration: {
		fontSize: '14px',
		color: '#9ca3af',
	},
	focusScoreContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		gap: '4px',
	},
	focusLabel: {
		fontSize: '12px',
		color: '#6b7280',
		fontWeight: '500',
	},
	focusScore: {
		fontSize: '28px',
		fontWeight: '700',
		background: 'linear-gradient(to right, #06b6d4, #10b981)',
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		backgroundClip: 'text',
	},
	statsGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		gap: '12px',
	},
	statCard: {
		backgroundColor: '#0f0f0f',
		border: '1px solid #2a2a2a',
		borderRadius: '8px',
		padding: '12px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '6px',
		textAlign: 'center',
	},
	statLabel: {
		fontSize: '11px',
		color: '#9ca3af',
		fontWeight: '500',
	},
	statValue: {
		fontSize: '18px',
		fontWeight: '700',
	},
};
