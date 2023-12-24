
export type AnnotatedText = {
    segments: Array<Segment>
    annotations: Array<Annotation>
}

export type Segment = {
    text: string
    annotationIds: Array<number>
}

export function segmentComparer(left: SplitPoint, right: SplitPoint) {
    if (left.segmentIndex !== right.segmentIndex) {
        return left.segmentIndex - right.segmentIndex
    } else {
        return left.charPos - right.charPos
    }
}

export type SplitPoint = { segmentIndex: number, charPos: number }

export type Annotation =
    | CommentThread
    | Footnote


type AnnotationId = {
    id: number
}

type CommentThread = AnnotationId & {
    type: "commentThread"
    comments: Array<Comment>
}

type Comment = {
    text: string
    status: "hidden" | "collapsed" | "open"
    comments: Array<Comment>
}

export type Footnote = AnnotationId & {
    type: "footnote"
    text: string
}


const testAnnotatedText: AnnotatedText = {
    "segments": [
        {text: "#this is ", annotationIds: []},
        {text: "markdown ", annotationIds: [1]},
        {text: "text", annotationIds: [1, 2]},
        {text: " with", annotationIds: [2]},
        {text: " with comment", annotationIds: []},
    ],
    "annotations": [
        {
            "type": "commentThread",
            "id": 1,
            "comments": [
                {
                    "text": "What about n?",
                    "status": "open",
                    "comments": [
                        {
                            "text": "This is a reply to 'What about n?'",
                            "status": "open",
                            "comments": []
                        }
                    ]
                },
                {
                    "text": "This is another comment at the same place",
                    "status": "open",
                    "comments": []
                }
            ]
        },
        {
            "type": "footnote",
            "id": 2,
            "text": "This is a footnote"
        }
    ]
}