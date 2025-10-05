import { useSession } from '../context/SessionContext';

export default function SessionToggle({ onChange }) {
	const { isCurrentSession, setIsCurrentSession } = useSession();

	const handleClick = (value) => {
		setIsCurrentSession(value);
		if (onChange) onChange(value);
	};

	const tabStyle = (isActive) => ({
		padding: '10px 20px',
		borderRadius: '12px',
		cursor: 'pointer',
		fontWeight: '500',
		fontSize: '14px',
		transition: 'all 0.3s ease',
		background: isActive
			? 'linear-gradient(90deg, #00ffc6, #8a2be2)'
			: 'rgba(255, 255, 255, 0.05)',
		color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
		boxShadow: isActive
			? '0 0 10px rgba(0,255,200,0.6), 0 0 20px rgba(138,43,226,0.4)'
			: 'none',
	});

	return (
		<div
			style={{
				display: 'flex',
				gap: '10px',
				background: 'rgba(0,0,0,0.3)',
				padding: '5px',
				borderRadius: '14px',
				backdropFilter: 'blur(6px)',
				width: 'fit-content',
                marginLeft:"20px"
			}}
		>
			<div
				style={tabStyle(isCurrentSession === true)}
				onClick={() => handleClick(true)}
			>
				Current Session
			</div>
			<div
				style={tabStyle(isCurrentSession === false)}
				onClick={() => handleClick(false)}
			>
				Past Sessions
			</div>
		</div>
	);
}
