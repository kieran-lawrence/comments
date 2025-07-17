import { Descendant, BaseEditor, BaseRange, Range, Element } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type BlockQuoteElement = {
    type: 'block-quote'
    children: Descendant[]
}

export type BulletedListElement = {
    type: 'bulleted-list'
    children: Descendant[]
}

export type ListItemElement = { type: 'list-item'; children: Descendant[] }

export type ParagraphElement = {
    type: 'paragraph'
    children: Descendant[]
}

type CustomElement =
    | BlockQuoteElement
    | BulletedListElement
    | ListItemElement
    | ParagraphElement

export type CustomText = {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    list?: boolean
    blockquote?: boolean
    text: string
}

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor
        Element: CustomElement
        Text: CustomText
        Range: BaseRange
    }
}
