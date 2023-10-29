import React from "react"
import { DropFn, MimeTypeConverterArray } from "./types"

export const useDrop = <TData, TIndex>(
    mimeTypeConverters: MimeTypeConverterArray<TData, TIndex>,
    dropFn: DropFn<TIndex>
) => {
    const defaultMimeType = mimeTypeConverters[0].mimeType

    const dragOver = (index: TIndex) => (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.dataTransfer.types.includes(defaultMimeType)) {
            event.dataTransfer.dropEffect = "move"
        } else {
            event.dataTransfer.dropEffect = "none"
        }
    }

    const handleDrop = (toIndex: TIndex) => (event: React.DragEvent) => {
        event.preventDefault()
        if (!event.dataTransfer.types.includes(defaultMimeType)) {
            return
        }

        // The default mimetype must return an object of type `{index: any}`
        const fromIndex = JSON.parse(event.dataTransfer.getData(defaultMimeType)).index as TIndex
        dropFn(fromIndex, toIndex)
    }

    return {
        dragOver,
        handleDrop
    }
}
