import React, { Fragment, useContext } from "react"
import classNames from "classnames"
import { useSortableDragDrop } from "../../components/DragDropHelpers/useSortableDragDrop"
import { insertAtIndex, removeAtIndex } from "../../components/array-helpers"
import { MimeTypeConverterArray } from "../../components/DragDropHelpers/types"
import { TocEditorContext } from "./TocEditorContext"
import { TocItem } from "./Reducers/types"

type Row<T> = {
    rowType: "item-row" | "drop-row"
    data: T
    key: React.Key
}

export const TocRows = () => {
    const { state, dispatch } = useContext(TocEditorContext)

    const removeTocItem = (tocIndex: number) => {
        dispatch({
            type: "REMOVE_TOC_ITEM",
            tocIndex
        })
    }

    const setTocItemTitle = (title: string, tocIndex: number) => {
        dispatch({
            type: "CHANGE_TOC_ITEM_TITLE",
            tocIndex,
            title
        })
    }

    const mimeTypeConverters: MimeTypeConverterArray<TocItem, number> = [
        {
            mimeType: "application/table-of-contents+index+json",
            convertDragDataToPayload: (_, index) => ({ index }),
            convertDropPayloadToAction: (fromTocIndex, toTocIndex, _) => ({
                type: "MOVE_TOC_ITEM",
                fromTocIndex,
                toTocIndex
            })
        },
        {
            mimeType: "text",
            convertDragDataToPayload: (tocItem, _) => `title: ${tocItem.title}, id: ${tocItem.id}`
        }
    ]
    const dnd = useSortableDragDrop<TocItem, number>(
        ".toc-item .draghandle",
        mimeTypeConverters,
        state.toc.length,
        dispatch
    )

    let rows: Row<TocItem>[] = state.toc.map((tocItem, index) => ({ rowType: "item-row", index, data: tocItem, key: index }))

    if (dnd.dragStatus.fromIndex !== undefined && dnd.dragStatus.currentIndex !== undefined) {
        const { data } = rows[dnd.dragStatus.fromIndex]
        rows = removeAtIndex(rows, dnd.dragStatus.fromIndex)
        rows = insertAtIndex(rows, dnd.dragStatus.currentIndex, { rowType: "drop-row", data, key: dnd.dragStatus.currentIndex })
    }

    const rowElements = rows.map((row, index) => {
        const tocItem = row.data!
        return (
            <Fragment key={tocItem.id}>
                {
                    row.rowType === "item-row"
                        ?
                        <tr className={classNames("toc-item")}
                            draggable={true}
                            onMouseDown={dnd.mouseDown}
                            onMouseUp={dnd.mouseUp}
                            onDragStart={dnd.dragStart(index, tocItem)}
                            onDragOver={dnd.dragOver(index)}
                            onDragEnd={dnd.dragEnd}
                            ref={elmnt => dnd.setElementRef(elmnt, index)}
                        >
                            <td className="draghandle">
                                <div className="icons">
                                    <button onClick={() => removeTocItem(index)}>
                                        &times;
                                    </button>
                                </div>
                                <div className="toc">
                                    <input type="text" value={tocItem.title} onChange={event => setTocItemTitle(event.target.value, index)} />
                                </div>
                            </td>
                        </tr>
                        :
                        // row.rowType === "drop-row"
                        <tr onDragEnd={dnd.dragEnd}
                            onDragOver={e => e.preventDefault()}
                            onDrop={dnd.handleDrop(index)}
                            ref={elmnt => dnd.setElementRef(elmnt, index)}
                            className="drop-area"
                        >
                            <td>
                            </td>
                        </tr>
                }
            </Fragment >
        )
    })

    return (
        <>
            {rowElements}
        </>
    )
}

