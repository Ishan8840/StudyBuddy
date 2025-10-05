import React, { useMemo, useState } from 'react';
import { Calendar, Clock, Target, Zap } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function StatsDashboard() {
	const { pastSessions } = useSession();
	const [hoveredIndex, setHoveredIndex] = useState(null);

	// 🧮 Compute derived stats from pastSessions
	const stats = useMemo(() => {
		if (!pastSessions || pastSessions.length === 0) {
			return [
				{
					icon: Calendar,
					label: 'Total Sessions',
					value: '0',
					color: '#3b82f6',
				},
				{
					icon: Clock,
					label: 'Total Time',
					value: '0h 0m',
					color: '#a855f7',
				},
				{
					icon: Target,
					label: 'Avg. Focus',
					value: '0%',
					color: '#10b981',
				},
				{
					icon: Zap,
					label: 'Total XP',
					value: '0',
					color: '#f59e0b',
				},
			];
		}

		const totalSessions = pastSessions.length;

		// total time in ms
		const totalTimeMs = pastSessions.reduce((acc, s) => {
			const start = new Date(s.timeStarted);
			const end = new Date(s.timeEnded);
			return acc + (end - start);
		}, 0);

		const totalMins = Math.floor(totalTimeMs / 60000);
		const hours = Math.floor(totalMins / 60);
		const mins = totalMins % 60;
		const totalTime = `${hours}h ${mins}m`;

		// average focus score
		const avgFocus =
			Math.round(
				pastSessions.reduce(
					(acc, s) => acc + (s.score || 0),
					0
				) / totalSessions
			) || 0;

		// total XP
		const totalXP = pastSessions.reduce(
			(acc, s) => acc + (s.xp || 0),
			0
		);

		return [
			{
				icon: Calendar,
				label: 'Total Sessions',
				value: totalSessions,
				color: '#3b82f6',
			},
			{
				icon: Clock,
				label: 'Total Time',
				value: totalTime,
				color: '#a855f7',
			},
			{
				icon: Target,
				label: 'Avg. Focus',
				value: `${avgFocus}%`,
				color: '#10b981',
			},
			{
				icon: Zap,
				label: 'Total XP',
				value: totalXP,
				color: '#f59e0b',
			},
		];
	}, [pastSessions]);

	return (
		<div style={styles.container}>
			{stats.map((stat, index) => (
				<div
					key={index}
					style={{
						...styles.card,
						transform:
							hoveredIndex === index
								? 'translateY(-2px)'
								: 'translateY(0)',
						boxShadow:
							hoveredIndex === index
								? `0 4px 12px ${stat.color}20`
								: '0 2px 8px rgba(0, 0, 0, 0.3)',
					}}
					onMouseEnter={() => setHoveredIndex(index)}
					onMouseLeave={() => setHoveredIndex(null)}
				>
					<div
						style={{
							...styles.iconContainer,
							backgroundColor: stat.color + '20',
						}}
					>
						<stat.icon
							size={22}
							color={stat.color}
							strokeWidth={2}
						/>
					</div>
					<div style={styles.content}>
						<div style={styles.label}>{stat.label}</div>
						<div
							style={{
								...styles.value,
								color: stat.color,
							}}
						>
							{stat.value}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

const styles = {
	container: {
		display: 'flex',
		gap: '14px',
		padding: '20px',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		display: 'flex',
		alignItems: 'center',
		gap: '14px',
		backgroundColor: '#1a1a1a',
		border: '1px solid #2a2a2a',
		borderRadius: '14px',
		padding: '18px',
		minWidth: '240px',
		flex: '1',
		transition: 'transform 0.2s ease, box-shadow 0.2s ease',
		cursor: 'pointer',
	},
	iconContainer: {
		width: '44px',
		height: '44px',
		borderRadius: '11px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		gap: '3px',
	},
	label: {
		color: '#9ca3af',
		fontSize: '13px',
		fontWeight: '500',
	},
	value: {
		fontSize: '26px',
		fontWeight: '700',
		lineHeight: '1',
	},
};
