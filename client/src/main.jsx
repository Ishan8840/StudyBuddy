import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CamFeed from './components/CamFeed.jsx'
import CombinedTracker from './components/CombinedTracker.jsx'
import SessionBar from './components/TopBar.jsx'
import { SessionProvider } from './context/SessionContext.jsx'
import SessionTimeline from './components/Timeline.jsx'

createRoot(document.getElementById('root')).render(
	<SessionProvider>
		<SessionBar />
		<div style={{display:"flex", marginTop:"2rem", gap:"50px"}}>
			<CombinedTracker />
			<SessionTimeline />
		</div>
	</SessionProvider>
);
