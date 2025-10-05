import React from 'react';
import { Calendar, Clock, Target, Zap } from 'lucide-react';

export default function StatsDashboard() {
	const stats = [
		{
			icon: Calendar,
			label: 'Total Sessions',
			value: '6',
			color: '#3b82f6',
		},
		{
			icon: Clock,
			label: 'Total Time',
			value: '13h 45m',
			color: '#a855f7',
		},
		{
			icon: Target,
			label: 'Avg. Focus',
			value: '88%',
			color: '#10b981',
		},
		{
			icon: Zap,
			label: 'Total XP',
			value: '1,370',
			color: '#f59e0b',
		},
	];

	const [hoveredIndex, setHoveredIndex] = React.useState(null);

	return (
		<div style={styles.container}>
			<style>{`
        @keyframes lift {
          to {
            transform: translateY(-4px);
          }
        }
      `}</style>
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

if (typeof document !== 'undefined') {
	const styleSheet = document.createElement('style');
	styleSheet.textContent = ``;
	document.head.appendChild(styleSheet);
}
