import React, { useEffect, useRef, useState } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';

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
						if (duration > 10 && !prev.overTen)
							console.log(
								'🚨 Hand has been touching face for over 10s!'
							);
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
		<div
			style={{ position: 'relative', width: 640, height: 480 }}
		>
			<video
				ref={videoRef}
				style={{ display: 'none' }}
				autoPlay
				playsInline
				muted
			/>
			<canvas
				ref={canvasRef}
				width={640}
				height={480}
				style={{ border: '1px solid black' }}
			/>
			{handTouch.overTen && (
				<div
					style={{
						position: 'absolute',
						top: 20,
						left: '50%',
						transform: 'translateX(-50%)',
						padding: '10px 20px',
						backgroundColor: 'red',
						color: 'white',
						fontWeight: 'bold',
						borderRadius: '8px',
						zIndex: 10,
					}}
				>
					🚨 Hand has been touching face for over 10
					seconds!
				</div>
			)}
		</div>
	);
}
