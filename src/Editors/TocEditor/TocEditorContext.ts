import React from "react"
import { Toc } from "./Reducers/types"
import { ACTION } from "./Reducers/TocReducer"

type tocEditorContext = {
    state: Toc
    dispatch: (message: ACTION) => void
}

export const initialToc: Toc = {
    "title": "wiki-site",
    "toc": []
}

export const TocEditorContext = React.createContext<tocEditorContext>({state: initialToc, dispatch: (message: ACTION) => {}})
