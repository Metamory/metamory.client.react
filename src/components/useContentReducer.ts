import { useContext } from "react"
import { MetamoryContext } from "./Metamory"

export type reducerFn<TState, TAction> = (state: TState, action: TAction) => TState

export const useContentReducer = <TState, TAction>(contentReducer: reducerFn<TState, TAction>, initialState: TState) => {
    const metamoryContext = useContext(MetamoryContext)

    let state = metamoryContext.content as TState ?? initialState
    metamoryContext.setContentReducer(contentReducer)

    let dispatch = (contentAction: TAction) => metamoryContext.dispatchOnContent(contentAction)

    return [state, dispatch]
}
