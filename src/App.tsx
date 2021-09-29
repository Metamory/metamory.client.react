import React from "react"
import "./App.css"
import { Metamory } from "./components/Metamory"
import { VersionSelector } from "./components/VersionSelector"
import { ContentIdSelector } from "./components/ContentIdSelector"
import { PlainTextEditor } from "./components/PlainTextEditor"
import { PublishButton } from "./components/PublishButton"
import { SaveButton } from "./components/SaveButton"
import { MarkdownEditor } from "./components/MarkdownEditor"
import { ContentTypeSelector } from "./components/ContentTypeSelector"
import { AutoMimeTypeEditor } from "./components/AutoMimeTypeEditor"

function App() {
	const currentUser = "Anonymous"	//TODO: Current users full name or username
	return (
		<div className="App">
			<Metamory
				serviceBaseUrl="http://localhost:5000"
				siteName="first-site"
				contentId="frontpage"
				currentUser={currentUser}
			>
				<ContentIdSelector />
				<VersionSelector />
				<PublishButton />
				<ContentTypeSelector />
				{/* <PlainTextEditor /> */}
				{/* <MarkdownEditor /> */}
				<AutoMimeTypeEditor editors={[PlainTextEditor, MarkdownEditor]} fallbackEditor={PlainTextEditor} />
				<SaveButton />
			</Metamory>
		</div>
	)
}

export default App
