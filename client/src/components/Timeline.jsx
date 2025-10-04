import React from 'react';
import { Clock, Zap, Hand, Eye } from 'lucide-react';
import './Timeline.css';
import { useSession } from '../context/SessionContext';

export default function SessionTimeline() {
	const {
            timelineEvents,
        } = useSession();

	return (
		<div className="timeline-container">
			<div className="timeline-wrapper">
				<h1 className="timeline-title">Session Timeline</h1>

				<div className="timeline-content">
					<div className="timeline-line"></div>

					{timelineEvents.map((event, index) => (
						<div
							key={index}
							className="timeline-event"
                            index = {index}
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
