
export type SessionData = {
	id: number
	title: string
	speakers: { id: number }[]
	tags: { id: number }[]
}

export const sessions: Array<SessionData> = [
	{
		id: 0,
		title: 'The Keynote',
		speakers: [
			{ id: 0 }
		], tags: [
			{ id: 0 }, { id: 1 }
		]
	},
	{
		id: 1,
		title: 'Breakout Session 1.1',
		speakers: [
			{ id: 1 }
		], tags: [
			{ id: 2 }, { id: 3 }, { id: 4 }
		]
	},
	{
		id: 2,
		title: 'Breakout Session 1.2',
		speakers: [
			{ id: 2 }, { id: 0 }
		], tags: [
			{ id: 0 }, { id: 1 }
		]
	},
	{
		id: 3,
		title: 'Breakout Session 1.3',
		speakers: [
			{ id: 3 }
		], tags: [
		]
	},
	{
		id: 4,
		title: 'Breakout Session 2.1',
		speakers: [
			{ id: 1 }
		], tags: [
			{ id: 2 }, { id: 3 }, { id: 5 }
		]
	},
	{
		id: 5,
		title: 'Breakout Session 2.2',
		speakers: [
			{ id: 2 }
		], tags: [
			{ id: 0 }, { id: 4 }
		]
	},
	{
		id: 6,
		title: 'Breakout Session 2.3',
		speakers: [
			{ id: 3 }, { id: 0 }
		], tags: [
			{ id: 2 }
		]
	},
	{
		id: 7,
		title: 'Lightning Talk 1',
		speakers: [
			{ id: 4 }
		], tags: [
			{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }
		]
	},
	{
		id: 8,
		title: 'Lightning Talk 2',
		speakers: [
			{ id: 5 }
		], tags: [
			{ id: 0 }, { id: 3 }
		]
	},
	{
		id: 9,
		title: 'Lightning Talk 3',
		speakers: [
		], tags: [
			{ id: 4 }, { id: 5 }
		]
	}
]


export type Speaker = {
	id: number
	name: string
}

export const speakers: Record<number, Speaker> = {
	0: { id: 0, name: 'Peter Pan' },
	1: { id: 1, name: 'Minnie Mouse' },
	2: { id: 2, name: 'Donald Duck' },
	3: { id: 3, name: 'Goofey' },
	4: { id: 4, name: 'Lars Mjøen' },
	5: { id: 5, name: 'Knut Lystad' },
}


export type Tag = {
	id: number
	name: string
}

export const tags: Record<number, Tag> = {
	0: { id: 0, name: 'Smalltalk' },
	1: { id: 1, name: 'Jokes' },
	2: { id: 2, name: 'Lies' },
	3: { id: 3, name: 'Praise' },
	4: { id: 4, name: 'Bullshit' },
	5: { id: 5, name: 'Hokum' },
}