type SelectorFn<TIn, TOut> = (obj: TIn) => TOut

export const maxBy = <TIn>(extract: SelectorFn<TIn, number>) => (agg: number, curr: TIn) => agg = agg > extract(curr) ? agg : extract(curr)
export const max = maxBy((x: number) => x)