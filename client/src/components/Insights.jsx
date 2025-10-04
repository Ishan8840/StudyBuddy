import React from 'react';
import { TrendingDown, Target, Sparkles } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function AIInsights() {
	const { insightsFromBackend } = useSession();

	if (!insightsFromBackend || insightsFromBackend.length === 0) {
		return (
			<div className="insights-container">
				<div className="insights-wrapper">
					<div className="insights-header">
						<Sparkles className="header-icon" />
						<h1 className="insights-title">
							AI Insights
						</h1>
					</div>
					<p className="no-insights-text">
						No insights available yet. Check back later!
					</p>
				</div>

				<style jsx>{`
					.insights-container {
						min-height: 100vh;
						padding: 2rem;
						display: flex;
						justify-content: center;
						font-family: -apple-system, BlinkMacSystemFont,
							'Segoe UI', sans-serif;
					}

					.insights-wrapper {
						max-width: 32rem;
						width: 100%;
					}

					.insights-header {
						display: flex;
						align-items: center;
						gap: 0.5rem;
						margin-bottom: 1.25rem;
					}

					.header-icon {
						width: 1.5rem;
						height: 1.5rem;
						color: #a855f7;
					}

					.insights-title {
						font-size: 1.5rem;
						font-weight: 600;
						color: #e0e7ff;
						margin: 0;
					}
				`}</style>
			</div>
		);
	}

	const insights = [
		{
			id: 1,
			icon: TrendingDown,
			iconColor: 'magenta',
			cardColor: 'magenta',
			text: insightsFromBackend[0],
		},
		{
			id: 2,
			icon: Target,
			iconColor: 'cyan',
			cardColor: 'cyan',
			text: insightsFromBackend[1],
		},
		{
			id: 3,
			icon: Sparkles,
			iconColor: 'purple',
			cardColor: 'purple',
			text: insightsFromBackend[2],
		},
	];

	return (
		<div className="insights-container">
			<div className="insights-wrapper">
				<div className="insights-header">
					<Sparkles className="header-icon" />
					<h1 className="insights-title">AI Insights</h1>
				</div>

				<div className="insights-list">
					{insights.map((insight) => (
						<div
							key={insight.id}
							className={`insight-card card-${insight.cardColor}`}
						>
							<div
								className={`insight-icon icon-${insight.iconColor}`}
							>
								<insight.icon
									className="icon-svg"
									strokeWidth={2}
								/>
							</div>
							<p className="insight-text">
								{insight.text}
							</p>
						</div>
					))}
				</div>
			</div>

			<style jsx>{`
				.insights-container {
					min-height: 100vh;
					padding: 2rem;
					display: flex;
					justify-content: center;
					font-family: -apple-system, BlinkMacSystemFont,
						'Segoe UI', sans-serif;
				}

				.insights-wrapper {
					max-width: 32rem;
					width: 100%;
				}

				.insights-header {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					margin-bottom: 1.25rem;
				}

				.header-icon {
					width: 1.5rem;
					height: 1.5rem;
					color: #a855f7;
				}

				.insights-title {
					font-size: 1.5rem;
					font-weight: 600;
					color: #e0e7ff;
					margin: 0;
				}

				.insights-list {
					display: flex;
					flex-direction: column;
					gap: 1rem;
				}

				.insight-card {
					display: flex;
					align-items: flex-start;
					gap: 1rem;
					padding: 1rem;
					border-radius: 1rem;
					border: 1px solid;
					transition: transform 0.2s ease;
				}

				.insight-card:hover {
					transform: translateY(-2px);
				}

				.card-magenta {
					background: linear-gradient(
						135deg,
						rgba(88, 28, 135, 0.3),
						rgba(88, 28, 135, 0.1)
					);
					border-color: rgba(168, 85, 247, 0.3);
				}

				.card-cyan {
					background: linear-gradient(
						135deg,
						rgba(21, 94, 117, 0.3),
						rgba(21, 94, 117, 0.1)
					);
					border-color: rgba(34, 211, 238, 0.3);
				}

				.card-purple {
					background: linear-gradient(
						135deg,
						rgba(76, 29, 149, 0.3),
						rgba(76, 29, 149, 0.1)
					);
					border-color: rgba(147, 51, 234, 0.3);
				}

				.insight-icon {
					flex-shrink: 0;
					width: 3rem;
					height: 3rem;
					border-radius: 0.75rem;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 2px solid;
				}

				.icon-magenta {
					background: linear-gradient(
						135deg,
						rgba(168, 85, 247, 0.2),
						rgba(168, 85, 247, 0.05)
					);
					border-color: rgba(168, 85, 247, 0.4);
				}

				.icon-cyan {
					background: linear-gradient(
						135deg,
						rgba(34, 211, 238, 0.2),
						rgba(34, 211, 238, 0.05)
					);
					border-color: rgba(34, 211, 238, 0.4);
				}

				.icon-purple {
					background: linear-gradient(
						135deg,
						rgba(147, 51, 234, 0.2),
						rgba(147, 51, 234, 0.05)
					);
					border-color: rgba(147, 51, 234, 0.4);
				}

				.icon-svg {
					width: 1.25rem;
					height: 1.25rem;
					color: inherit;
				}

				.icon-magenta .icon-svg {
					color: #e879f9;
				}

				.icon-cyan .icon-svg {
					color: #22d3ee;
				}

				.icon-purple .icon-svg {
					color: #a855f7;
				}

				.insight-text {
					flex: 1;
					font-size: 0.9375rem;
					line-height: 1.6;
					color: #e0e7ff;
					margin: 0;
					padding-top: 0.25rem;
				}

				@media (max-width: 640px) {
					.insights-header {
						flex-direction: column;
						align-items: flex-start;
					}

					.insights-title {
						font-size: 1.5rem;
					}

					.insight-card {
						flex-direction: column;
						gap: 1rem;
					}

					.insight-text {
						font-size: 1rem;
						padding-top: 0;
					}
				}
			`}</style>
		</div>
	);
}
