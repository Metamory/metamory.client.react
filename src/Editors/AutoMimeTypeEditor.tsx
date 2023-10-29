import React, { useContext } from "react"
import { MetamoryContext } from "../Metamory/Metamory"

type Props = {
	editors: any[]
	fallbackEditor: any
}

export const AutoMimeTypeEditor = ({ editors, fallbackEditor }: Props) => {
	const metamoryContext = useContext(MetamoryContext)
	const editor = editors.find((editor) => editor.mimeType === metamoryContext.contentType) ?? fallbackEditor

	return React.createElement(editor)
}
