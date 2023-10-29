import React from "react"
import { MimeTypeConverterArray } from "./types"
import { JsonStringifyIfNotString } from "./helpers"

export const useDrag = <TData, TIndex>(
    mimeTypeConverters: MimeTypeConverterArray<TData, TIndex>
) => {
    const dragStart = (index: TIndex, data: TData) => (event: React.DragEvent) => {
        mimeTypeConverters.forEach(converter => {
            event.dataTransfer.setData(converter.mimeType, JsonStringifyIfNotString(converter.fn(data, index)))
        })
        event.dataTransfer.effectAllowed = "move"
        const x = event.clientX - event.currentTarget.getBoundingClientRect().left
        event.dataTransfer.setDragImage(event.currentTarget, x, event.currentTarget.clientHeight / 2)
        event.stopPropagation()
    }

    const dragEnd = (event: React.DragEvent) => {
    }

    return {
        dragStart,
        dragEnd
    }
}

