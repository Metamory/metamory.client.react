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
import { TocEditor } from "./Editors/TocEditor/TocEditor"
import { AnnotatedTextEditor } from "./Editors/AnnotatedTextEditor/AnnotatedTextEditor"

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import IsAuthenticated from "./components/Auth/IsAuthenticated"

type AuthHeaders = {
	Authorization: string
}
type RoleHeaders = {
	role: string
}


function App() {
	const user = {name: "Joe Q. Editor"}
	const [authHeaders, setAuthHeaders] = useState<AuthHeaders|RoleHeaders>({role: "editor"})

	return (
		<div className="App">
			<Metamory
				serviceBaseUrl=""
				siteName="first-site"
				contentId="test"
				currentUser={user?.name ?? "n/a"}
				authHeaders={authHeaders}
			>
				<ContentIdSelector />
				<VersionSelector />
				<PublishButton />
				<ContentTypeSelector />
				<AutoMimeTypeEditor editors={[PlainTextEditor, MarkdownEditor, AgendaEditor, TocEditor, AnnotatedTextEditor]} fallbackEditor={PlainTextEditor} />
				<SaveButton />
			</Metamory>
		</div>
	)
}


export default App
