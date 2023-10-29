import React from "react"
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

function App() {
	const currentUser = "Anonymous"	//TODO: Current users full name or username
	return (
		<div className="App">
			<Metamory
				serviceBaseUrl=""
				siteName="first-site"
				contentId="agenda"
				// contentId="frontpage"
				currentUser={currentUser}
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
		</div>
	)
}

export default App
