import React, { useEffect, useRef, useState } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';
import { useSession } from '../context/SessionContext';
import { CameraIcon } from 'lucide-react';


export default function App() {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const cameraRef = useRef(null);

	const smoothedBoxRef = useRef(null);
	const smoothedHandsRef = useRef([]);

	const [handTouch, setHandTouch] = useState({
		touching: false,
		startTime: null,
		overTen: false,
	});

	const { touchedFace } = useSession();

	const HAND_CONNECTIONS = [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 4],
		[0, 5],
		[5, 6],
		[6, 7],
		[7, 8],
		[0, 9],
		[9, 10],
		[10, 11],
		[11, 12],
		[0, 13],
		[13, 14],
		[14, 15],
		[15, 16],
		[0, 17],
		[17, 18],
		[18, 19],
		[19, 20],
	];

	function drawCyberBox(ctx, box, label = 'Face Detected') {
		const cornerSize = 20;
		const radius = 8;

		ctx.strokeStyle = handTouch.overTen ? 'red' : '#00eaff';
		ctx.lineWidth = 3;
		ctx.shadowColor = handTouch.overTen ? 'red' : '#00eaff';
		ctx.shadowBlur = 20;

		ctx.beginPath();
		ctx.moveTo(box.x, box.y + cornerSize);
		ctx.lineTo(box.x, box.y + radius);
		ctx.quadraticCurveTo(box.x, box.y, box.x + radius, box.y);
		ctx.lineTo(box.x + cornerSize, box.y);

		ctx.moveTo(box.x + box.w - cornerSize, box.y);
		ctx.lineTo(box.x + box.w - radius, box.y);
		ctx.quadraticCurveTo(
			box.x + box.w,
			box.y,
			box.x + box.w,
			box.y + radius
		);
		ctx.lineTo(box.x + box.w, box.y + cornerSize);

		ctx.moveTo(box.x, box.y + box.h - cornerSize);
		ctx.lineTo(box.x, box.y + box.h - radius);
		ctx.quadraticCurveTo(
			box.x,
			box.y + box.h,
			box.x + radius,
			box.y + box.h
		);
		ctx.lineTo(box.x + cornerSize, box.y + box.h);

		ctx.moveTo(box.x + box.w - cornerSize, box.y + box.h);
		ctx.lineTo(box.x + box.w - radius, box.y + box.h);
		ctx.quadraticCurveTo(
			box.x + box.w,
			box.y + box.h,
			box.x + box.w,
			box.y + box.h - radius
		);
		ctx.lineTo(box.x + box.w, box.y + box.h - cornerSize);

		ctx.stroke();
		ctx.shadowBlur = 0;

		const tabWidth = 140;
		const tabHeight = 30;
		const tabX = box.x + box.w / 2 - tabWidth / 2;
		const tabY = box.y - tabHeight - 10;

		ctx.fillStyle = 'rgba(0, 234, 255, 0.15)';
		ctx.strokeStyle = '#00eaff';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.roundRect(tabX, tabY, tabWidth, tabHeight, 8);
		ctx.fill();
		ctx.stroke();

		ctx.font = '16px sans-serif';
		ctx.fillStyle = '#00eaff';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(
			label,
			tabX + tabWidth / 2,
			tabY + tabHeight / 2
		);
	}

	function isPointInBox(point, box) {
		return (
			point.x >= box.x &&
			point.x <= box.x + box.w &&
			point.y >= box.y &&
			point.y <= box.y + box.h
		);
	}

	function smoothValue(prev, current, alpha = 0.2) {
		if (!prev) return current;
		return prev * (1 - alpha) + current * alpha;
	}

	function smoothBox(prevBox, newBox, alpha = 0.2) {
		if (!prevBox) return newBox;
		return {
			x: smoothValue(prevBox.x, newBox.x, alpha),
			y: smoothValue(prevBox.y, newBox.y, alpha),
			w: smoothValue(prevBox.w, newBox.w, alpha),
			h: smoothValue(prevBox.h, newBox.h, alpha),
		};
	}

	function smoothHands(prevHands, newHands, alpha = 0.2) {
		if (!prevHands.length) return newHands;
		return newHands.map((hand, i) => {
			if (!prevHands[i]) return hand;
			return hand.map((point, j) => ({
				x: smoothValue(prevHands[i][j].x, point.x, alpha),
				y: smoothValue(prevHands[i][j].y, point.y, alpha),
			}));
		});
	}

	useEffect(() => {
		const faceDetection = new FaceDetection({
			locateFile: (file) =>
				`https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
		});

		const hands = new Hands({
			locateFile: (file) =>
				`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
		});

		faceDetection.setOptions({
			model: 'short',
			minDetectionConfidence: 0.5,
		});
		hands.setOptions({
			maxNumHands: 2,
			modelComplexity: 1,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});

		hands.onResults((results) => {
			if (!smoothedBoxRef.current) return;
			const canvasEl = canvasRef.current;

			let touchingFace = false;
			const landmarksList = [];

			if (results.multiHandLandmarks) {
				results.multiHandLandmarks.forEach((landmarks) => {
					const mirrored = landmarks.map((l) => ({
						x: canvasEl.width - l.x * canvasEl.width,
						y: l.y * canvasEl.height,
					}));
					landmarksList.push(mirrored);
					mirrored.forEach((p) => {
						if (isPointInBox(p, smoothedBoxRef.current))
							touchingFace = true;
					});
				});
			}

			smoothedHandsRef.current = smoothHands(
				smoothedHandsRef.current,
				landmarksList
			);

			if (touchingFace) {
				setHandTouch((prev) => {
					if (!prev.touching) {
						return {
							touching: true,
							startTime: Date.now(),
							overTen: false,
						};
					} else {
						const duration =
							(Date.now() - prev.startTime) / 1000;
						if (duration > 10 && !prev.overTen) {
							console.log(
								'🚨 Hand has been touching face for over 10s!'
							);
							setTimeout(() => touchedFace(), 0);
						}
						return { ...prev, overTen: duration > 10 };
					}
				});
			} else {
				setHandTouch({
					touching: false,
					startTime: null,
					overTen: false,
				});
			}
		});

		faceDetection.onResults((results) => {
			if (results.detections.length > 0) {
				const canvasEl = canvasRef.current;
				const relativeBox = results.detections[0].boundingBox;
				const newBox = {
					x:
						canvasEl.width -
						(relativeBox.xCenter * canvasEl.width +
							(relativeBox.width * canvasEl.width) / 2),
					y:
						relativeBox.yCenter * canvasEl.height -
						(relativeBox.height * canvasEl.height) / 2,
					w: relativeBox.width * canvasEl.width,
					h: relativeBox.height * canvasEl.height,
				};
				smoothedBoxRef.current = smoothBox(
					smoothedBoxRef.current,
					newBox
				);
			}
		});

		if (videoRef.current) {
			cameraRef.current = new Camera(videoRef.current, {
				onFrame: async () => {
					await faceDetection.send({
						image: videoRef.current,
					});
					await hands.send({ image: videoRef.current });

					// DRAW LOOP
					const canvasEl = canvasRef.current;
					const ctx = canvasEl.getContext('2d');
					ctx.clearRect(
						0,
						0,
						canvasEl.width,
						canvasEl.height
					);

					// draw video
					ctx.save();
					ctx.scale(-1, 1);
					ctx.translate(-canvasEl.width, 0);
					ctx.drawImage(
						videoRef.current,
						0,
						0,
						canvasEl.width,
						canvasEl.height
					);
					ctx.restore();

					// draw face box
					if (smoothedBoxRef.current)
						drawCyberBox(ctx, smoothedBoxRef.current);

					// draw hands
					smoothedHandsRef.current.forEach((hand) => {
						hand.forEach((p) => {
							const touching =
								smoothedBoxRef.current &&
								isPointInBox(
									p,
									smoothedBoxRef.current
								);
							ctx.beginPath();
							ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
							ctx.fillStyle = touching
								? 'red'
								: 'rgba(255,0,234,0.8)';
							ctx.fill();
						});
						HAND_CONNECTIONS.forEach(([start, end]) => {
							const p1 = hand[start];
							const p2 = hand[end];
							ctx.beginPath();
							ctx.moveTo(p1.x, p1.y);
							ctx.lineTo(p2.x, p2.y);
							ctx.strokeStyle = 'rgba(255,0,234,0.8)';
							ctx.lineWidth = 2;
							ctx.stroke();
						});
					});
				},
				width: 640,
				height: 480,
			});

			cameraRef.current.start();
		}

		return () => {
			if (cameraRef.current) cameraRef.current.stop();
		};
	}, []);

	return (
		<div>
			<video
				ref={videoRef}
				style={{ display: 'none' }}
				autoPlay
				playsInline
				muted
			/>
			<div
				style={{
					background:
						'linear-gradient(145deg, #0a0a0a, #141414)',
					borderRadius: '16px',
					padding: '20px',
					width: '720px',
					margin: '30px auto',
					boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
					color: '#fff',
					fontFamily: 'system-ui, sans-serif',
				}}
			>
				{/* Header */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '16px',
					}}
				>
					<h3
						style={{
							fontSize: '18px',
							fontWeight: '600',
							margin: 0,
							background:
								'linear-gradient(90deg, #60a5fa, #a78bfa)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						Live Detection
					</h3>
					<span
						style={{
							background: '#064e3b',
							color: '#22c55e',
							fontSize: '14px',
							padding: '4px 12px',
							borderRadius: '999px',
							fontWeight: '500',
						}}
					>
						● Active
					</span>
				</div>

				{/* Main content box */}
				<div
					style={{
						background:
							'linear-gradient(180deg, #0d0d0d, #111)',
						borderRadius: '12px',
						padding: '16px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						minHeight: '380px',
						border: '1px solid rgba(255,255,255,0.08)',
					}}
				>
					{/* Webcam Canvas */}
					<canvas
						ref={canvasRef}
						width={640}
						height={480}
						style={{
							borderRadius: '12px',
							border: '1px solid rgba(255,255,255,0.1)',
							boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
							maxWidth: '100%',
							height: 'auto',
						}}
					/>
				</div>

				{/* Stats Row */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginTop: '20px',
						gap: '12px',
					}}
				>
					{[
						{
							label: 'Face Touches',
							value: 12,
							gradient:
								'linear-gradient(90deg,#ec4899,#a855f7)',
						},
						{
							label: 'Distractions',
							value: 8,
							gradient:
								'linear-gradient(90deg,#f59e0b,#facc15)',
						},
						{
							label: 'Focus Score',
							value: '87%',
							gradient:
								'linear-gradient(90deg,#06b6d4,#3b82f6)',
						},
					].map((stat, i) => (
						<div
							key={i}
							style={{
								flex: 1,
								background:
									'linear-gradient(180deg, #111, #0a0a0a)',
								border: '1px solid rgba(255,255,255,0.08)',
								borderRadius: '10px',
								padding: '12px',
								textAlign: 'center',
								boxShadow:
									'0 4px 12px rgba(0,0,0,0.5)',
							}}
						>
							<div
								style={{
									fontSize: '14px',
									color: '#aaa',
									marginBottom: '6px',
								}}
							>
								{stat.label}
							</div>
							<div
								style={{
									fontSize: '20px',
									fontWeight: '600',
									background: stat.gradient,
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor:
										'transparent',
								}}
							>
								{stat.value}
							</div>
						</div>
					))}
				</div>
			</div>
			{handTouch.overTen && (
				<div
					style={{
						position: 'fixed',
						top: 20,
						left: '50%',
						transform: 'translateX(-50%)',
						padding: '16px 32px',
						background:
							'linear-gradient(90deg, #ff073a, #ff3c6e)', // intense red/pink
						color: '#fff',
						fontWeight: '700',
						borderRadius: '14px',
						boxShadow:
							'0 0 20px #ff073a, 0 0 40px #ff3c6e', // glowing effect
						zIndex: 1000,
						opacity: 1,
						transition:
							'top 0.5s ease, opacity 0.5s ease',
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
						fontFamily: 'sans-serif',
						pointerEvents: 'none',
						textShadow: '0 0 6px #fff, 0 0 12px #ff073a', // glow around text
					}}
				>
					<span style={{ fontSize: '22px' }}>🚨</span>
					<span>
						Hand has been touching face for over 10
						seconds!
					</span>
				</div>
			)}
		</div>
	);
}
