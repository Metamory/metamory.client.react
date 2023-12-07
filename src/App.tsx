import React, { useEffect, useState } from "react"
import "./App.css"
import { Metamory } from "./Metamory/Metamory"
import { VersionSelector } from "./Metamory/VersionSelector"
import { ContentIdSelector } from "./Metamory/ContentIdSelector"
import { PlainTextEditor } from "./Editors/PlainTextEditor"
import { PublishButton } from "./Metamory/PublishButton"
import { SaveButton } from "./Metamory/SaveButton"
import { MarkdownEditor } from "./Editors/MarkdownEditor"
import { ContentTypeSelector } from "./Metamory/ContentTypeSelector"
import { AutoMimeTypeEditor } from "./Editors/AutoMimeTypeEditor"
import { AgendaEditor } from "./Editors/AgendaEditor/AgendaEditor"

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import IsAuthenticated from "./components/Auth/IsAuthenticated"

type AuthHeaders = {
	Authorization: string
}


function App() {
	const {
		user,
		isAuthenticated,
		loginWithRedirect,
		getAccessTokenSilently,
		logout,
	} = useAuth0()

	const [authHeaders, setAuthHeaders] = useState<AuthHeaders>()
	useEffect(() => {
		if (isAuthenticated) {
			getAccessTokenSilently({
				authorizationParams: {
					audience: `https://metamory.server/`,
					// scope: "openid",
				},
			}).then((token) => {
				setAuthHeaders({
					Authorization: `Bearer ${token}`,
				})
			})
		}
		else {
			setAuthHeaders(undefined)
		}
	}, [isAuthenticated])

	const logoutWithRedirect = () =>
		logout({
			logoutParams: {
				returnTo: window.location.origin,
			}
		})

	return (
		<div className="App">
			<IsAuthenticated
				yes={
					<>
						You are logged in as {user?.name} ({user?.email}).
						<button onClick={() => logoutWithRedirect()}>Log out</button>
					</>
				}
				no={
					<button onClick={() => loginWithRedirect({})}>Log in</button>
				} />

			<IsAuthenticated
				yes={
					<Metamory
						serviceBaseUrl=""
						siteName="first-site"
						contentId="agenda"
						// contentId="frontpage"
						currentUser={user?.name ?? "n/a"}
						authHeaders={authHeaders}
					>
						<ContentIdSelector />
						<VersionSelector />
						<PublishButton />
						<ContentTypeSelector />
						{/* <PlainTextEditor /> */}
						{/* <MarkdownEditor /> */}
						<AutoMimeTypeEditor editors={[PlainTextEditor, MarkdownEditor, AgendaEditor]} fallbackEditor={PlainTextEditor} />
						<SaveButton />
					</Metamory>
				}
			/>

		</div>
	)
}


export default App


// export default withAuthenticationRequired(App, {
// 	onRedirecting: () => <h1>L...O...A...D...I..N...G<br />A...U...T...H...0</h1>,
// })
