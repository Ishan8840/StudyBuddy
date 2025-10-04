import React, { useEffect } from 'react';
import { TrendingDown, Target, Sparkles } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function AIInsights() {
	const { insightsFromBackend, isLoading, setIsLoading } = useSession();
	

	useEffect(() => {
		// Check if insights are available
		if (
			insightsFromBackend !== undefined &&
			insightsFromBackend !== null
		) {
			// Add a small delay to show the loading animation
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 800);
			return () => clearTimeout(timer);
		}
	}, [insightsFromBackend]);

	// Loading state
	if (
		isLoading ||
		insightsFromBackend === undefined ||
		insightsFromBackend === null
	) {
		return (
			<div className="insights-container">
				<div className="insights-wrapper">
					<div className="insights-header">
						<Sparkles className="header-icon" />
						<h1 className="insights-title">
							AI Insights
						</h1>
					</div>

					<div className="loading-container">
						<div className="loading-animation">
							<div className="orbit-ring">
								<div className="orbit-dot dot-1"></div>
								<div className="orbit-dot dot-2"></div>
								<div className="orbit-dot dot-3"></div>
							</div>
							<Sparkles className="loading-icon" />
						</div>
						<p className="loading-text">
							Analyzing your session data...
						</p>
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
						animation: sparkle 2s ease-in-out infinite;
					}

					.insights-title {
						font-size: 1.5rem;
						font-weight: 600;
						color: #e0e7ff;
						margin: 0;
					}

					.loading-container {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						padding: 4rem 2rem;
					}

					.loading-animation {
						position: relative;
						width: 120px;
						height: 120px;
						margin-bottom: 2rem;
					}

					.orbit-ring {
						position: absolute;
						inset: 0;
						border-radius: 50%;
						border: 2px solid rgba(168, 85, 247, 0.2);
						animation: rotate 3s linear infinite;
					}

					.orbit-dot {
						position: absolute;
						width: 12px;
						height: 12px;
						border-radius: 50%;
						top: 50%;
						left: 50%;
						margin-left: -6px;
						margin-top: -6px;
					}

					.dot-1 {
						background: linear-gradient(
							135deg,
							#a855f7,
							#e879f9
						);
						box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
						animation: orbit1 2s ease-in-out infinite;
					}

					.dot-2 {
						background: linear-gradient(
							135deg,
							#22d3ee,
							#06b6d4
						);
						box-shadow: 0 0 20px rgba(34, 211, 238, 0.8);
						animation: orbit2 2s ease-in-out infinite;
					}

					.dot-3 {
						background: linear-gradient(
							135deg,
							#e879f9,
							#c026d3
						);
						box-shadow: 0 0 20px rgba(232, 121, 249, 0.8);
						animation: orbit3 2s ease-in-out infinite;
					}

					.loading-icon {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 2.5rem;
						height: 2.5rem;
						color: #a855f7;
						animation: pulse-glow 2s ease-in-out infinite;
					}

					.loading-text {
						font-size: 1rem;
						color: #9ca3af;
						margin: 0;
						animation: fade-pulse 2s ease-in-out infinite;
					}

					@keyframes rotate {
						from {
							transform: rotate(0deg);
						}
						to {
							transform: rotate(360deg);
						}
					}

					@keyframes orbit1 {
						0%,
						100% {
							transform: translate(50px, 0) scale(1);
						}
						50% {
							transform: translate(50px, 0) scale(1.5);
						}
					}

					@keyframes orbit2 {
						0%,
						100% {
							transform: translate(-25px, 43px) scale(1);
						}
						50% {
							transform: translate(-25px, 43px)
								scale(1.5);
						}
					}

					@keyframes orbit3 {
						0%,
						100% {
							transform: translate(-25px, -43px)
								scale(1);
						}
						50% {
							transform: translate(-25px, -43px)
								scale(1.5);
						}
					}

					@keyframes pulse-glow {
						0%,
						100% {
							opacity: 1;
							filter: drop-shadow(
								0 0 10px rgba(168, 85, 247, 0.5)
							);
						}
						50% {
							opacity: 0.7;
							filter: drop-shadow(
								0 0 20px rgba(168, 85, 247, 0.8)
							);
						}
					}

					@keyframes fade-pulse {
						0%,
						100% {
							opacity: 0.6;
						}
						50% {
							opacity: 1;
						}
					}

					@keyframes sparkle {
						0%,
						100% {
							transform: scale(1) rotate(0deg);
						}
						50% {
							transform: scale(1.2) rotate(180deg);
						}
					}
				`}</style>
			</div>
		);
	}

	// No insights available
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

					.no-insights-text {
						color: #9ca3af;
						font-size: 1rem;
						text-align: center;
						padding: 2rem;
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
					{insights.map((insight, index) => (
						<div
							key={insight.id}
							className={`insight-card card-${insight.cardColor}`}
							style={{
								animationDelay: `${index * 0.1}s`,
							}}
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
					animation: slide-in 0.5s ease-out forwards;
					opacity: 0;
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

				@keyframes slide-in {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
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
