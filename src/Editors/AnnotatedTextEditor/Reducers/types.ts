
export type AnnotatedText = {
    text: string
    annotations: Array<Annotation>
}

export type Annotation =
    | CommentThread
    | Footnote


type AnnotationPosition = {
    fromChar: number
    length: number
}

type CommentThread = AnnotationPosition & {
    type: "commentThread"
    comments: Array<Comment>
}

type Comment = {
    text: string
    status: "hidden" | "collapsed" | "open"
    comments: Array<Comment>
}

type Footnote = AnnotationPosition & {
    type: "footnote"
    text: string
}


const testAnnotatedText: AnnotatedText = {
    "text": "#markdown text with comment",
    "annotations": [
        {
            "type": "commentThread",
            "fromChar": 20,
            "length": 7,
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
            "fromChar": 10,
            "length": 4,
            "text": "This is a footnote"
        },
        {
            "type": "footnote",
            "fromChar": 15,
            "length": 4,
            "text": "This is another footnote"
        }
    ]
}