import { Bold, Italic, Code, Strikethrough, Underline, Heading, Link, ListOrdered, Quote, ListTodo, EyeOff, Eye } from "lucide-react"

interface MarkdownProps {
    onTogglePreview: () => void
    isPreview: boolean
    onBold: () => void
    onItalic: () => void
    onUnderline: () => void
    onStrikethrough: () => void
    onHeading: () => void
    onLink: () => void
    onListOrdered: () => void
    onListTodo: () => void
    onQuote: () => void
    onCode: () => void
    onCaptureSelection: () => void
}

export default function MarkdownToolbar( { onTogglePreview, isPreview, onBold, onItalic, onUnderline, onStrikethrough, onHeading, onLink, onListOrdered, onListTodo, onQuote, onCode, onCaptureSelection }: MarkdownProps ) {
    return (
        <div className="w-full flex gap-2 items-center justify-center my-2">

            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onBold}><Bold className="w-4 h-4"/></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onItalic}><Italic className="w-4 h-4"/></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onUnderline}><Underline className="w-4 h-4"/></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onStrikethrough}><Strikethrough className="w-4 h-4" /></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onHeading}><Heading className="w-4 h-4"/></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onLink}><Link className="w-4 h-4"/></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onListOrdered}><ListOrdered className="w-4 h-4"/></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onListTodo}><ListTodo className="w-4 h-4"/></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onQuote}><Quote className="w-4 h-4"/></button>
            <button onMouseDown={onCaptureSelection} className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5" onClick={onCode}><Code className="w-4 h-4"/></button>

            <span className="w-px h-6 bg-white/20 mx-1" />

            <button
                onClick={onTogglePreview}
                className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"
                title={isPreview? "Edit mode" : "Preview mode"}
            >
                {isPreview ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4" /> }
            </button>

        </div>
    )
}