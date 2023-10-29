
// export type MimeTypeConverter<TData, TIndex> = {
//     mimeType: string
//     fn: (data: TData, index: TIndex) => string
// }

export type MimeTypeConverter<TData, TIndex, TPayload> = {
    mimeType: string
    fn: (data: TData, index: TIndex) => TPayload
}

// The default converter MUST return an index object
export type MimeTypeConverterArray<TData, TIndex> = [MimeTypeConverter<TData, TIndex, {index: any}>, ...Array<MimeTypeConverter<TData, TIndex, any>>]


export type DropFn<TIndex> = (fromIndex: TIndex, toIndex: TIndex) => void

