import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { getConfig } from "./config"
import IsAuthenticated from './components/Auth/IsAuthenticated'


const root = createRoot(document.getElementById('root')!)

const onRedirectCallback = (appState: any) => {
	console.log("*** history.push", { appState, location: window.location })
	// history.push(
	//   appState && appState.returnTo ? appState.returnTo : window.location.pathname
	// )
}


// Please see https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html
// for a full list of the available properties on the provider
const config = getConfig()

const providerConfig = {
	domain: config.domain,
	clientId: config.clientId,
	onRedirectCallback,
	authorizationParams: {
		redirect_uri: window.location.origin,
		...(config.audience ? { audience: config.audience } : null),
	},
}

root.render(
	<React.StrictMode>
		<Auth0Provider {...providerConfig}>
			<App />
		</Auth0Provider>
	</React.StrictMode>
)
