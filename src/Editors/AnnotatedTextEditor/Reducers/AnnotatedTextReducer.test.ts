import { annotatedTextReducer } from "./AnnotatedTextReducer"
import { AnnotatedText } from "./types"

describe("From text with just a single segment", () => {
	const initialState: AnnotatedText = {
		segments: [
			{ text: "Lorem ipsum dolor sit amet", annotationIds: [] }
		],
		annotations: []
	}

	describe("Add annotation", () => {

		test("from the start", () => {
			const fromSplitPoint = { segmentIndex: 0, charPos: 0 }
			const toSplitPoint = { segmentIndex: 0, charPos: 5 }

			const state = annotatedTextReducer(initialState, { type: "ADD_ANNOTATION_TO_ANNOTATED_TEXT", fromSplitPoint, toSplitPoint, text: "Footnote for 'Lorem'" })

			expect(state).toMatchObject({
				segments: [
					{ text: "Lorem", annotationIds: [1] },
					{ text: " ipsum dolor sit amet", annotationIds: [] }
				],
				annotations: [
					{
						type: "footnote", id: 1, text: "Footnote for 'Lorem'"
					}
				]
			})
		})

		test("in the middle", () => {
			const fromSplitPoint = { segmentIndex: 0, charPos: 12 }
			const toSplitPoint = { segmentIndex: 0, charPos: 17 }

			const state = annotatedTextReducer(initialState, { type: "ADD_ANNOTATION_TO_ANNOTATED_TEXT", fromSplitPoint, toSplitPoint, text: "Footnote for 'dolor'" })

			expect(state).toMatchObject({
				segments: [
					{ text: "Lorem ipsum ", annotationIds: [] },
					{ text: "dolor", annotationIds: [1] },
					{ text: " sit amet", annotationIds: [] }
				],
				annotations: [
					{
						type: "footnote", id: 1, text: "Footnote for 'dolor'"
					}
				]

			})
		})

		test("at the end", () => {
			const fromSplitPoint = { segmentIndex: 0, charPos: 22 }
			const toSplitPoint = { segmentIndex: 0, charPos: 26 }

			const state = annotatedTextReducer(initialState, { type: "ADD_ANNOTATION_TO_ANNOTATED_TEXT", fromSplitPoint, toSplitPoint, text: "Footnote for 'amet'" })

			expect(state).toMatchObject({
				segments: [
					{ text: "Lorem ipsum dolor sit ", annotationIds: [] },
					{ text: "amet", annotationIds: [1] }
				],
				annotations: [
					{
						type: "footnote", id: 1, text: "Footnote for 'amet'"
					}
				]
			})
		})

		test("selected in reverse", () => {
			const fromSplitPoint = { segmentIndex: 0, charPos: 12 }
			const toSplitPoint = { segmentIndex: 0, charPos: 17 }

			const state = annotatedTextReducer(initialState, { type: "ADD_ANNOTATION_TO_ANNOTATED_TEXT", fromSplitPoint, toSplitPoint, text: "Footnote for 'dolor'" })

			expect(state).toMatchObject({
				segments: [
					{ text: "Lorem ipsum ", annotationIds: [] },
					{ text: "dolor", annotationIds: [1] },
					{ text: " sit amet", annotationIds: [] }
				],
				annotations: [
					{
						type: "footnote", id: 1, text: "Footnote for 'dolor'"
					}
				]
			})

		})
	})
})


	// describe("From text with multiple segments", () => {
	// 	describe("Add annotation", () => {
	// 		test("left boundary matches an existing boundary", () => {
	// 		})
	// 		test("right boundary matches an existing boundary", () => {
	// 		})
	// 		test("segment crosses one boundary", () => {
	// 		})
	// 		test("segment crosses multiple boundaries", () => {
	// 		})
	// 	})
	// })
