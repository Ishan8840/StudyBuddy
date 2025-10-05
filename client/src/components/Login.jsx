import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';



export default function Login() {
	const { form, setForm, login } = useSession();
	const [error, setError] = useState(null);
    const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async(e) => {
		e.preventDefault();
		setError(null);

		if (!form.email || !form.password) {
			setError('All fields are required.');
			return;
		}
		if (form.password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return;
		}

		await login();
        navigate('/'); 
        window.location.reload();
	};

	return (
		<div style={styles.page}>
			{/* Cyber background overlay */}
			<div style={styles.cyberBg}></div>

			<div style={styles.formWrapper}>
				<h1 style={styles.title}>Login</h1>

				{error && <div style={styles.error}>{error}</div>}

				<form onSubmit={handleSubmit} style={styles.form}>
					{[
						{
							name: 'email',
							placeholder: 'Email Address',
							type: 'email',
							icon: <Mail size={20} />,
						},
						{
							name: 'password',
							placeholder: 'Password',
							type: 'password',
							icon: <Lock size={20} />,
						},
					].map((field, idx) => (
						<div key={idx} style={styles.inputWrapper}>
							<div style={styles.icon}>
								{field.icon}
							</div>
							<input
								type={field.type || 'text'}
								name={field.name}
								placeholder={field.placeholder}
								value={form[field.name]}
								onChange={handleChange}
								style={styles.input}
							/>
						</div>
					))}

					<button type="submit" style={styles.button}>
						Login
					</button>
				</form>

				<p style={styles.footer}>
					Dont have an account?{' '}
					<a href="/signup" style={styles.link}>
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
}

const styles = {
	page: {
		minHeight: '100vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: 'sans-serif',
		position: 'relative',
		overflow: 'hidden',
		color: '#e0e0e0',
		width: '100vw',
	},
	cyberBg: {
		position: 'absolute',
		inset: 0,
		background: `
      radial-gradient(circle at top, rgba(0,255,200,0.1), transparent 70%),
      repeating-linear-gradient(0deg, rgba(0,255,200,0.08) 0px, transparent 2px, transparent 40px),
      repeating-linear-gradient(90deg, rgba(0,140,255,0.08) 0px, transparent 2px, transparent 40px),
      linear-gradient(180deg, #0d0d1a, #000)
    `,
		animation: 'cyberShift 15s linear infinite',
		zIndex: 0,
	},
	formWrapper: {
		position: 'relative',
		width: '20%',
		maxWidth: '600px',
		padding: '50px',
		borderRadius: '16px',
		background: 'rgba(10,10,20,0.85)',
		boxShadow:
			'0 0 25px rgba(0,255,200,0.3), 0 0 50px rgba(0,0,0,0.7)',
		backdropFilter: 'blur(8px)',
		zIndex: 1,
	},
	title: {
		textAlign: 'center',
		marginBottom: '30px',
		fontSize: '36px',
		fontWeight: '700',
		color: '#00ffc6',
		textShadow: '0 0 12px rgba(0,255,200,0.8)',
	},
	error: {
		marginBottom: '20px',
		color: '#ff3333',
		fontSize: '16px',
		textAlign: 'center',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		gap: '20px',
	},
	inputWrapper: {
		display: 'flex',
		alignItems: 'center',
		border: '2px solid rgba(0,255,200,0.5)',
		borderRadius: '10px',
		padding: '15px 18px',
		background: 'rgba(255,255,255,0.05)',
		boxShadow: 'inset 0 0 10px rgba(0,255,200,0.3)',
	},
	icon: {
		marginRight: '12px',
		color: '#00ffc6',
	},
	input: {
		flex: 1,
		border: 'none',
		outline: 'none',
		fontSize: '16px',
		background: 'transparent',
		color: '#e0e0e0',
	},
	button: {
		width: '100%',
		padding: '16px',
		background: 'linear-gradient(90deg, #00ffc6, #008cff)',
		color: '#000',
		fontSize: '18px',
		fontWeight: '600',
		border: 'none',
		borderRadius: '10px',
		cursor: 'pointer',
		boxShadow: '0 4px 15px rgba(0,255,200,0.4)',
		transition: 'all 0.3s ease',
	},
	footer: {
		marginTop: '25px',
		textAlign: 'center',
		fontSize: '16px',
		color: '#aaa',
	},
	link: {
		color: '#00ffc6',
		textDecoration: 'none',
		fontWeight: '600',
	},
};

// inject keyframes for cyber shift
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
	`
@keyframes cyberShift {
  0% { background-position: 0 0, 0 0, 0 0, 0 0; }
  100% { background-position: 100px 100px, 40px 0, 0 40px, 0 0; }
}`,
	styleSheet.cssRules.length
);
