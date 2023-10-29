import { reducer, initialState, DRAFT } from "./MetamoryReducer"

describe("from initialState", () => {
	describe("VERSIONS_LOADED", () => {
		test("for a non-existing document (ie. no versions yet)", () => {
			const versions : any[] = []
			const publishedVersionId = undefined

			const state = reducer(initialState, { type: "VERSIONS_LOADED", versions, publishedVersionId })

			expect(state.versions).toEqual([])
			expect(state.content).toBeUndefined()
			// expect(state.currentVersionId).toEqual(DRAFT)
		})

		test("for an existing document with one unpublished version", () => {
			const versions = [{ versionId: "1", timestamp: "2020-01-01T00:00:00.000Z", author: "author", label: "" }]
			const publishedVersionId = undefined

			const state = reducer(initialState, { type: "VERSIONS_LOADED", versions, publishedVersionId })

			expect(state.versions).toEqual(versions)
			expect(state.content).toBeUndefined()
			expect(state.currentVersionId).toEqual("1")
		})

		test("for an existing document with multiple unpublished versions", () => {
			const versions = [
				{ versionId: "1", timestamp: "2020-01-01T00:00:00.000Z", author: "author", label: "" },
				{
					versionId: "2",
					timestamp: "2020-01-02T00:00:00.000Z",
					author: "author",
					label: "",
					previousVersionId: "1"
				}
			]
			const publishedVersionId = undefined

			const state = reducer(initialState, { type: "VERSIONS_LOADED", versions, publishedVersionId })

			expect(state.versions).toEqual(versions)
			expect(state.content).toBeUndefined()
			expect(state.currentVersionId).toEqual("2")
		})

		test("for an existing document with multiple versions, and one is published", () => {
			const versions = [
				{ versionId: "1", timestamp: "2020-01-01T00:00:00.000Z", author: "author", label: "" },
				{
					versionId: "2",
					timestamp: "2020-01-02T00:00:00.000Z",
					author: "author",
					label: "",
					previousVersionId: "1"
				}
			]
			const state = reducer(initialState, { type: "VERSIONS_LOADED", versions, publishedVersionId: "1" })

			expect(state.versions).toEqual(versions)
			expect(state.content).toBeUndefined()
			expect(state.currentVersionId).toEqual("1")
		})
	})
})
