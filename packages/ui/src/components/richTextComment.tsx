import { useCallback, useMemo } from 'react'
import { Descendant, createEditor } from 'slate'
import {
    Editable,
    RenderElementProps,
    RenderLeafProps,
    Slate,
    withReact,
} from 'slate-react'

export const RichTextComment = ({ value }: { value: Descendant[] }) => {
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        [],
    )
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        [],
    )
    const editor = useMemo(() => withReact(createEditor()), [])

    return (
        <Slate editor={editor} initialValue={value}>
            <Editable
                className="textTitleItemSm"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                readOnly={true}
            />
        </Slate>
    )
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote
                    {...attributes}
                    className="ml-4 border-l-4 pl-4 border-bg border-bg-menu py-1"
                >
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul {...attributes} className="px-3">
                    {children}
                </ul>
            )
        case 'list-item':
            return (
                <li className="list-disc" {...attributes}>
                    {children}
                </li>
            )
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}
