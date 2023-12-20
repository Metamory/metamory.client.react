import React from "react"
import { AnnotatedText } from "./Reducers/types"
import { ACTION } from "./Reducers/AnnotatedTextReducer"

type annotatedTextEditorContext = {
    state: AnnotatedText
    dispatch: (message: ACTION) => void
}

export const initialAnnotatedText: AnnotatedText = {
    "text": "Lorem ipsum",
    "annotations": []
}

export const AnnotatedTextEditorContext = React.createContext<annotatedTextEditorContext>({state: initialAnnotatedText, dispatch: (message: ACTION) => {}})
