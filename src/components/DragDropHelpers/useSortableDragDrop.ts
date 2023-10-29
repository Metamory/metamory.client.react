import { useEffect, useRef, useState } from "react"
import { DropFn, MimeTypeConverterArray } from "./types"
import { JsonStringifyIfNotString } from "./helpers"

type DragStatus<TIndex> = {
    fromIndex?: TIndex
    currentIndex?: TIndex
    isDragHandle: boolean
}

const emptyDragOverStatus: DragStatus<any> = { fromIndex: undefined, currentIndex: undefined, isDragHandle: false }


export const useSortableDragDrop = <TData, TIndex>(
    dragHandleQuerySelector: string,
    mimeTypeConverters: MimeTypeConverterArray<TData, TIndex>,
    elementCount: number,
    drop: DropFn<TIndex>
) => {
    const [dragStatus, setDragStatus] = useState<DragStatus<TIndex>>(emptyDragOverStatus)
    const draggables = useRef<(HTMLTableRowElement | null)[]>([])

    const defaultMimeType = mimeTypeConverters[0].mimeType

    useEffect(() => {
        draggables.current = draggables.current.slice(0, elementCount)
    }, [elementCount])

    const setElementRef = (elmnt: HTMLTableRowElement | null, index: number) => draggables.current[index] = elmnt

    // --- Drag and Drop ---
    const mouseDown = (event: React.MouseEvent) => {
        const target = event.target as Element
        const isDragHandle = Array.from(draggables.current!)
            .flatMap(draggable => Array.from(draggable!.querySelectorAll(dragHandleQuerySelector)))
            .some(handle => handle.contains(target))

        setDragStatus({
            ...dragStatus,
            isDragHandle
        })
    }

    const mouseUp = (event: React.MouseEvent) => {
        setDragStatus(emptyDragOverStatus)
    }

    const dragStart = (index: TIndex, data: TData) => (event: React.DragEvent) => {
        if (!dragStatus.isDragHandle) {
            event.preventDefault()
            return
        }
        
        setDragStatus({
            ...dragStatus,
            fromIndex: index,
            currentIndex: undefined,
        })

        mimeTypeConverters.forEach(converter => {
            event.dataTransfer.setData(converter.mimeType, JsonStringifyIfNotString(converter.fn(data, index)))
        })
        event.dataTransfer.effectAllowed = "move"
        const x = event.clientX - event.currentTarget.getBoundingClientRect().left
        event.dataTransfer.setDragImage(event.currentTarget, x, event.currentTarget.clientHeight / 2)
        event.stopPropagation()
    }

    const dragEnd = (event: React.DragEvent) => {
        setDragStatus(emptyDragOverStatus)
    }

    const dragOver = (index: TIndex) => (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()

        setDragStatus({
            ...dragStatus,
            currentIndex: index
        })

        if (event.dataTransfer.types.includes(defaultMimeType)) {
            event.dataTransfer.dropEffect = "move"
        } else {
            event.dataTransfer.dropEffect = "none"
        }
    }

    const handleDrop = (index: TIndex) => (event: React.DragEvent) => {
        event.preventDefault()
        if (!event.dataTransfer.types.includes(defaultMimeType)) {
            return
        }

        const fromIndex = dragStatus.fromIndex!
        const toIndex = index
        drop(fromIndex, toIndex)
    }

    return {
        setElementRef,
        dragStatus,
        mouseDown,
        mouseUp,
        dragStart,
        dragEnd,
        dragOver,
        handleDrop
    }
}
