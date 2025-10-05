import React, { useEffect, useRef, useState } from 'react';
import { useSession } from '../context/SessionContext';

export default function CombinedTracker() {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const cameraRef = useRef(null);
	const holisticRef = useRef(null);
	const yawHistory = useRef([]);
	const hasSpokenDistractionRef = useRef(false);
	const hasSpokenFaceTouchRef = useRef(false);

	const {
		touchedFace,
		distractionStart,
		distractionEnd,
		isSessionActive,
		isOnBreak,
		distractedNum,
		faceTouches,
		focusPercentage,
		exp,
		setExp,
	} = useSession();

	const sessionActiveRef = useRef(isSessionActive);

	const [isDistracted, setIsDistracted] = useState(false);
	const [handTouch, setHandTouch] = useState({
		touching: false,
		startTime: null,
		overThreshold: false,
	});
	const [faceBox, setFaceBox] = useState(null);

	const lookStartTime = useRef(null);
	const distractionThreshold = 2000;
	const faceTouchThreshold = 2000;

	const smoothedBoxRef = useRef(null);
	const smoothedHandsRef = useRef([]);

	const voices = [
		'Fz7HYdHHCP1EF1FLn46C',
		'iCrDUkL56s3C8sCRl7wb',
		'Qe9WSybioZxssVEwlBSo',
	];

	useEffect(() => {
		sessionActiveRef.current = isSessionActive;
	}, [isSessionActive]);

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

	// Helpers
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

	function isPointInBox(point, box) {
		return (
			point.x >= box.x &&
			point.x <= box.x + box.w &&
			point.y >= box.y &&
			point.y <= box.y + box.h
		);
	}

	function drawCyberBox(ctx, box) {
		const cornerSize = 20;
		const radius = 8;

		ctx.strokeStyle = handTouch.overThreshold ? 'red' : '#00eaff';
		ctx.lineWidth = 3;
		ctx.shadowColor = handTouch.overThreshold ? 'red' : '#00eaff';
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
	}

	const estimateYaw = (landmarks) => {
		const nose = landmarks[1];
		const leftEar = landmarks[234];
		const rightEar = landmarks[454];
		const midEarX = (leftEar.x + rightEar.x) / 2;
		return nose.x - midEarX;
	};

	const generateSpeech = async (type) => {
		const distractionMessages = [
			'Get back to work boy!',
			'Naughty Naughty you got distracted!',
			"Don't get sidetracked!",
		];

		const faceTouchMessages = [
			'Stop those sneaky touches Ishan!',
			'Ishan! Dont touch your face.',
		];

		const messages =
			type === 'distraction'
				? distractionMessages
				: faceTouchMessages;
		const randomMessage =
			messages[Math.floor(Math.random() * messages.length)];
		const randomVoice =
			voices[Math.floor(Math.random() * voices.length)];

		try {
			const response = await fetch(
				`https://api.elevenlabs.io/v1/text-to-speech/${randomVoice}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'xi-api-key': import.meta.env
							.VITE_ELEVEN_LABS_KEY,
					},
					body: JSON.stringify({
						text: randomMessage,
						modelId: 'eleven_multilingual_v2',
						voice_settings: {
							stability: 0.5,
							similarity_boost: 0.75,
						},
					}),
				}
			);

			const audioBlob = await response.blob();
			const audioUrl = URL.createObjectURL(audioBlob);
			const audio = new Audio(audioUrl);
			await audio.play();
			audio.onended = () => URL.revokeObjectURL(audioUrl);
		} catch (err) {
			console.error('Eleven Labs error:', err);
		}
	};

	const onResults = (results) => {
		const canvasEl = canvasRef.current;
		const ctx = canvasEl?.getContext('2d');

		if (!ctx || !canvasEl) return;

		ctx.save();
		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		ctx.translate(canvasEl.width, 0);
		ctx.scale(-1, 1);

		ctx.drawImage(
			results.image,
			0,
			0,
			canvasEl.width,
			canvasEl.height
		);

		// Face landmarks
		if (results.faceLandmarks) {
			const landmarks = results.faceLandmarks;
			const yaw = estimateYaw(landmarks);

			yawHistory.current.push(yaw);
			if (yawHistory.current.length > 5)
				yawHistory.current.shift();
			const avgYaw =
				yawHistory.current.reduce((a, b) => a + b, 0) /
				yawHistory.current.length;

			const threshold = 0.05;
			let newDirection = 'Focused';
			if (avgYaw < -threshold || avgYaw > threshold)
				newDirection = 'Distracted';

			if (newDirection !== 'Focused') {
				if (!lookStartTime.current)
					lookStartTime.current = Date.now();
				else {
					const duration =
						Date.now() - lookStartTime.current;
					if (
						duration >= distractionThreshold &&
						!isDistracted
					)
						setIsDistracted(true);
				}
			} else if (lookStartTime.current) {
				lookStartTime.current = null;
				setIsDistracted(false);
			}

			// Face box
			const canvasW = canvasEl.width;
			const canvasH = canvasEl.height;
			let minX = 1,
				maxX = 0,
				minY = 1,
				maxY = 0;
			landmarks.forEach((lm) => {
				minX = Math.min(minX, lm.x);
				maxX = Math.max(maxX, lm.x);
				minY = Math.min(minY, lm.y);
				maxY = Math.max(maxY, lm.y);
			});
			const newBox = {
				x: minX * canvasW,
				y: minY * canvasH,
				w: (maxX - minX) * canvasW,
				h: (maxY - minY) * canvasH,
			};
			smoothedBoxRef.current = smoothBox(
				smoothedBoxRef.current,
				newBox
			);
			setFaceBox(smoothedBoxRef.current);

			if (sessionActiveRef.current && smoothedBoxRef.current) {
				drawCyberBox(ctx, smoothedBoxRef.current);
			}
		}

		// Hands
		let touchingFace = false;
		const landmarksList = [];

		if (results.leftHandLandmarks) {
			landmarksList.push(
				results.leftHandLandmarks.map((l) => ({
					x: l.x * canvasEl.width,
					y: l.y * canvasEl.height,
				}))
			);
		}
		if (results.rightHandLandmarks) {
			landmarksList.push(
				results.rightHandLandmarks.map((l) => ({
					x: l.x * canvasEl.width,
					y: l.y * canvasEl.height,
				}))
			);
		}

		if (smoothedBoxRef.current) {
			landmarksList.forEach((hand) => {
				hand.forEach((p) => {
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
				if (!prev.touching)
					return {
						touching: true,
						startTime: Date.now(),
						overThreshold: false,
					};
				return {
					...prev,
					overThreshold:
						(Date.now() - prev.startTime) / 1000 >
						faceTouchThreshold / 1000,
				};
			});
		} else {
			setHandTouch({
				touching: false,
				startTime: null,
				overThreshold: false,
			});
		}

		// Draw hands
		smoothedHandsRef.current.forEach((hand) => {
			hand.forEach((p) => {
				const touching =
					smoothedBoxRef.current &&
					isPointInBox(p, smoothedBoxRef.current);
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
				if (p1 && p2) {
					ctx.beginPath();
					ctx.moveTo(p1.x, p1.y);
					ctx.lineTo(p2.x, p2.y);
					ctx.strokeStyle = 'rgba(255,0,234,0.8)';
					ctx.lineWidth = 2;
					ctx.stroke();
				}
			});
		});

		ctx.restore();
	};

	// Camera setup
	useEffect(() => {
		if (!window.Holistic || !window.Camera)
			return console.error('MediaPipe not loaded');

		const holistic = new window.Holistic({
			locateFile: (file) =>
				`https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
		});

		holistic.setOptions({
			modelComplexity: 1,
			smoothLandmarks: true,
			enableSegmentation: false,
			smoothSegmentation: false,
			refineFaceLandmarks: true,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});

		holistic.onResults(onResults);
		holisticRef.current = holistic;

		// Async camera setup
		const initCamera = async () => {
			// Wait for the WASM module to finish initializing
			await holisticRef.current.initialize();

			if (videoRef.current) {
				const camera = new window.Camera(videoRef.current, {
					onFrame: async () => {
						if (holisticRef.current) {
							await holisticRef.current.send({
								image: videoRef.current,
							});
						}
					},
					width: 640,
					height: 480,
				});
				camera.start();
				cameraRef.current = camera;
			}
		};

		initCamera();

		return () => {
			cameraRef.current?.stop();
			holisticRef.current?.close();
		};
	}, []);

	// Speech triggers
	useEffect(() => {
		if (!isSessionActive || isOnBreak) return;

		if (isDistracted && !hasSpokenDistractionRef.current) {
			generateSpeech('distraction');
			hasSpokenDistractionRef.current = true;
			distractionStart();
			setExp(exp-10);
		}
		if (!isDistracted && hasSpokenDistractionRef.current) {
			// **record distraction end**
			distractionEnd();
			hasSpokenDistractionRef.current = false;
		}
	}, [isDistracted]);

	useEffect(() => {
		if (!isSessionActive) return;

		if (
			handTouch.overThreshold &&
			!hasSpokenFaceTouchRef.current
		) {
			generateSpeech('faceTouch');
			hasSpokenFaceTouchRef.current = true;

			touchedFace();
			setExp(exp-5);
			console.log(exp)
		}
		if (!handTouch.overThreshold)
			hasSpokenFaceTouchRef.current = false;
	}, [handTouch.overThreshold]);

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
			<div
				style={{
					background:
						'linear-gradient(145deg, #0a0a0a, #141414)',
					borderRadius: '16px',
					padding: '20px',
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
							value: faceTouches,
							gradient:
								'linear-gradient(90deg,#ec4899,#a855f7)',
						},
						{
							label: 'Distractions',
							value: distractedNum,
							gradient:
								'linear-gradient(90deg,#f59e0b,#facc15)',
						},
						{
							label: 'Focus Score',
							value: `${focusPercentage}%`,
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

			{/* Distracted text above face */}
			{isSessionActive && faceBox && (
				<div
					style={{
						position: 'absolute',
						left: `${
							640 - (faceBox.x + faceBox.w / 2)
						}px`, // mirrored
						top: `${Math.max(faceBox.y - 40, 0)}px`,
						transform: 'translateX(-50%)',
						color: isDistracted ? '#FF005C' : '#00FFE7', // neon red/cyan
						fontSize: '20px',
						fontWeight: '600',
						fontFamily: "'Orbitron', sans-serif",
						textShadow: `0 0 8px ${
							isDistracted ? '#FF005C' : '#00FFE7'
						}`, // subtle glow
						pointerEvents: 'none',
						padding: '2px 8px',
						borderRadius: '4px',
						letterSpacing: '0.5px',
					}}
				>
					{isDistracted ? 'Distracted' : 'Focused'}
				</div>
			)}

			{/* Face touch warning */}
			{isSessionActive && handTouch.overThreshold && (
				<div
					style={{
						position: 'absolute',
						top: 60,
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
					🚨 Stop touching your face!
				</div>
			)}
		</div>
	);
}
