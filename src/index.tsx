import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { getConfig } from "./config"


const root = createRoot(document.getElementById('root')!)

const onRedirectCallback = (appState: any) => {
	// console.log("*** history.push", { appState, location: window.location })
	
	// history.push(
	//   appState && appState.returnTo ? appState.returnTo : window.location.pathname
	// )
}


root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
