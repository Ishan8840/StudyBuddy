import {
	Calendar,
	Clock,
	Circle,
	Hand,
	Eye,
	Zap,
	ChevronDown,
	ChevronUp,
	Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useSession } from '../context/SessionContext';

export default function SessionHistory() {
	const { pastSessions } = useSession();
	const [expandedIndex, setExpandedIndex] = useState(null);

	// 🧠 Convert backend sessions into the format your UI expects
	const sessions =
		pastSessions?.map((s) => ({
			date: new Date(s.timeStarted).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}),
			duration: getDuration(s.timeStarted, s.timeEnded),
			focusScore: s.score ?? 0,
			touches: s.touchedFace?.length ?? 0,
			distractions: s.distracted?.length ?? 0,
			xp: s.xp ?? 0,
			summary: s.summary ?? null,
		})) ?? [];

	const toggleSession = (index) => {
		setExpandedIndex(expandedIndex === index ? null : index);
	};

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<h1 style={styles.title}>Session History</h1>
				<span style={styles.sessionCount}>
					{sessions.length} session{sessions.length > 1 ? 's' : ''}
				</span>
			</div>

			<div style={styles.sessionList}>
				{sessions.map((session, index) => (
					<div key={index} style={styles.sessionCard}>
						<div 
							style={styles.sessionHeader}
							onClick={() => toggleSession(index)}
						>
							<div style={styles.sessionInfo}>
								<div style={styles.dateRow}>
									<Calendar size={18} color="#3b82f6" />
									<span style={styles.date}>{session.date}</span>
								</div>
								<div style={styles.durationRow}>
									<Clock size={16} color="#6b7280" />
									<span style={styles.duration}>{session.duration}</span>
								</div>
							</div>
							<div style={styles.headerRight}>
								<div style={styles.focusScoreContainer}>
									<span style={styles.focusLabel}>Focus Score</span>
									<span style={styles.focusScore}>{session.focusScore}%</span>
								</div>
								{expandedIndex === index ? (
									<ChevronUp size={20} color="#9ca3af" style={styles.chevron} />
								) : (
									<ChevronDown size={20} color="#9ca3af" style={styles.chevron} />
								)}
							</div>
						</div>

						<div style={styles.statsGrid}>
							<div style={styles.statCard}>
								<Hand size={16} color="#ec4899" />
								<span style={styles.statLabel}>Touches</span>
								<span style={{ ...styles.statValue, color: '#ec4899' }}>
									{session.touches}
								</span>
							</div>

							<div style={styles.statCard}>
								<Eye size={16} color="#06b6d4" />
								<span style={styles.statLabel}>Distractions</span>
								<span style={{ ...styles.statValue, color: '#06b6d4' }}>
									{session.distractions}
								</span>
							</div>

							<div style={styles.statCard}>
								<Zap size={16} color="#f59e0b" />
								<span style={styles.statLabel}>XP</span>
								<span style={{ ...styles.statValue, color: '#f59e0b' }}>
									+{session.xp}
								</span>
							</div>
						</div>

						{expandedIndex === index && session.summary && (
							<div style={styles.summaryContainer}>
								<div style={styles.summaryHeader}>
									<Sparkles size={16} color="#a855f7" />
									<span style={styles.summaryTitle}>AI Summary</span>
								</div>
								<p style={styles.summaryText}>{session.summary}</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

// 🧮 Helper to calculate readable duration
function getDuration(start, end) {
	if (!start || !end) return '—';
	const diff = Math.max(0, new Date(end) - new Date(start));
	const mins = Math.floor(diff / 60000);
	const hours = Math.floor(mins / 60);
	const rem = mins % 60;
	return `${hours ? `${hours}h ` : ''}${rem}m`;
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
		transition: 'border-color 0.2s ease',
	},
	sessionHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: '20px',
		paddingBottom: '16px',
		borderBottom: '1px solid #2a2a2a',
		userSelect: 'none',
		cursor: 'pointer',
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
	headerRight: {
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
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
		gridTemplateColumns: 'repeat(3, 1fr)',
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
	chevron: {
		transition: 'transform 0.2s ease',
	},
	summaryContainer: {
		backgroundColor: '#0f0f0f',
		border: '1px solid #2a2a2a',
		borderRadius: '8px',
		padding: '16px',
		marginTop: '16px',
		width: '97%',
	},
	summaryHeader: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		marginBottom: '12px',
	},
	summaryTitle: {
		fontSize: '14px',
		fontWeight: '600',
		color: '#a855f7',
	},
	summaryText: {
		fontSize: '14px',
		lineHeight: '1.6',
		color: '#d1d5db',
		margin: 0,
		whiteSpace: 'pre-wrap',
	},
};
