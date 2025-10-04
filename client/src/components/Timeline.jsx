import React from 'react';
import { Clock, Zap, Hand, Eye } from 'lucide-react';
import './Timeline.css';

export default function SessionTimeline() {
	const timelineEvents = [
		{
			id: 1,
			type: 'start',
			title: 'Session Start',
			time: '14:23',
			icon: Clock,
			color: 'cyan',
			xp: null,
		},
		{
			id: 2,
			type: 'focus',
			title: 'Deep Focus',
			time: '14:28',
			icon: Zap,
			color: 'green',
			xp: 20,
		},
		{
			id: 3,
			type: 'touch',
			title: 'Face Touch',
			time: '14:35',
			icon: Hand,
			color: 'magenta',
			xp: -5,
		},
		{
			id: 4,
			type: 'check',
			title: 'Phone Check',
			time: '14:42',
			icon: Eye,
			color: 'orange',
			xp: null,
		},
		{
			id: 5,
			type: 'focus',
			title: 'Focus Zone',
			time: '14:50',
			icon: Zap,
			color: 'green',
			xp: 20,
		},
		{
			id: 6,
			type: 'touch',
			title: 'Face Touch',
			time: '14:58',
			icon: Hand,
			color: 'magenta',
			xp: -5,
		},
	];

	return (
		<div className="timeline-container">
			<div className="timeline-wrapper">
				<h1 className="timeline-title">Session Timeline</h1>

				<div className="timeline-content">
					<div className="timeline-line"></div>

					{timelineEvents.map((event, index) => (
						<div
							key={event.id}
							className="timeline-event"
						>
							<div
								className={`event-icon icon-${event.color}`}
							>
								<div
									className={`icon-pulse pulse-${event.color}`}
								></div>
								<event.icon
									className={`icon-svg icon-color-${event.color}`}
									strokeWidth={2.5}
								/>
							</div>

							<div
								className={`event-card card-${event.color}`}
							>
								<div className="event-content">
									<div className="event-info">
										<h3
											className={`event-title text-${event.color}`}
										>
											{event.title}
										</h3>
										<p className="event-time">
											{event.time}
										</p>
									</div>
									{event.xp !== null && (
										<div
											className={`xp-badge xp-badge-${
												event.xp > 0
													? 'positive'
													: 'negative'
											}`}
										>
											{event.xp > 0 ? '+' : ''}
											{event.xp} XP
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
