import { useEffect, useRef, useState } from "react"
import MarkdownToolbar from "./MarkdownToolbar"
import TypingArea from "./TypingArea"
import { marked } from "marked"
import { mapKeyToNote } from "../../music/keyMapping"
import { playBackspace, playEnter, playNote, playSpace } from "../../music/audioEngine"
import * as Tone from "tone"

interface EditorProps {
    noteCount: number
    onNoteTyped: (count: number) => void
    onBpmUpdate: (bpm: number) => void
    editorBlur: number
}

export default function Editor( { onNoteTyped, onBpmUpdate, noteCount, editorBlur }: EditorProps ) {

    const [text, setText] = useState("")
    const [isPreview, setIsPreview] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const startedRef = useRef(false)
    const gapRef = useRef<number[]>([])
    const lastTimeRef = useRef<number>(0)
    const BPM_WINDOW = 10

    useEffect(() => {
        if (noteCount === 0) {
            gapRef.current = []
            lastTimeRef.current = 0
        }
    }, [noteCount])

    const selectionRef = useRef({ start: 0, end: 0 })

    const captureSelection = () => {
        const el = textAreaRef.current
        if (el) {
            selectionRef.current = {
                start: el.selectionStart,
                end: el.selectionEnd,
            }
            console.log("Captured selection:", selectionRef.current)
        }
    }

    const wrapText = (prefix: string, suffix: string) => {
        const el = textAreaRef.current
        if (!el) {
            console.log("No textArea ref")
            return
        }

        const { start, end } = selectionRef.current
        const selectedText = text.substring(start, end)

        console.log("wrapText - start:", start, "end:", end, "selected:", selectedText)

        let newText: string
        let newCursorPos: number

        if (selectedText.length === 0) {
            newText = text.substring(0, start) + prefix + suffix + text.substring(end)
            newCursorPos = start + prefix.length
        } else {
            newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end)
            newCursorPos = start + prefix.length + selectedText.length + suffix.length  
        }

        setText(newText)

        setTimeout(() => {
            el.focus()
            el.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
    }

    const handleBold = () => wrapText("**", "**")
    const handleItalic = () => wrapText("*", "*")
    const handleUnderline = () => wrapText("_", "_")
    const handleStrikethrough = () => wrapText("~~", "~~")
    const handleHeading = () => {
        const el = textAreaRef.current
        if (!el) return
        const start = el.selectionStart
        const end = el.selectionEnd
        const selectedText = text.substring(start, end)
        const prefix = "# "
        const newText = text.substring(0, start) + prefix + selectedText + text.substring(end)
        setText(newText)
        setTimeout(() => {
            el.focus()
            el.setSelectionRange(start + prefix.length + selectedText.length, start + prefix.length + selectedText.length)
        }, 0)
    }
    const handleLink = () => {
        const el = textAreaRef.current
        if (!el) return
        const start = el.selectionStart
        const end = el.selectionEnd
        const selectedText = text.substring(start, end) || "link text"
        const newText = text.substring(0, start) + `[${selectedText}](url)` + text.substring(end)
        setText(newText)
        setTimeout(() => {
            el.focus()
            const urlStart = start + selectedText.length + 3
            el.setSelectionRange(urlStart, urlStart + 3)
        }, 0)
    }
    const handleListOrdered = () => wrapText("1. ", "")
    const handleListTodo = () => wrapText("- [ ] " , "")
    const handleQuote = () => wrapText(`> "`, `"`)
    const handleCode = () => wrapText("`", "`")


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

        if (!startedRef.current) {
            Tone.start()
            console.log('Audio context state:', Tone.context.state)
            startedRef.current = true
        }

        const result = mapKeyToNote({ key: e.key, shiftKey: e.shiftKey })
        console.log(result)

        switch (result.type) {
            case "note":
                const newCount = noteCount + 1
                onNoteTyped(newCount)

                const now = performance.now()
                const gap = lastTimeRef.current === 0 ? 400 : now - lastTimeRef.current
                lastTimeRef.current = now

                const gaps = gapRef.current
                gaps.push(gap)
                if (gaps.length > BPM_WINDOW) gaps.shift()
                
                const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length
                const bpm = Math.round(60000 / avgGap)
                onBpmUpdate(bpm)

                playNote(result.note, result.row)
                break
            case "space":
                playSpace()
                break
            case "backspace":
                playBackspace()
                break
            case "enter":
                playEnter()
                break
            case "ignore":
                break
        }
    }

    const togglePreview = () => setIsPreview(!isPreview)

    return (
        <main className="flex flex-1 h-full justify-center items-stretch min-h-0 overflow-hidden">

            <div className="items-center  border border-white/20 flex flex-col w-[50%] h-full rounded-lg min-h-0 overflow-hidden scrollbar-none"
                style={{ backdropFilter: `blur(${editorBlur}px)` }}
            >
                <MarkdownToolbar onTogglePreview={togglePreview} isPreview={isPreview}
                    onBold={handleBold}
                    onItalic={handleItalic}
                    onUnderline={handleUnderline}
                    onStrikethrough={handleStrikethrough}
                    onHeading={handleHeading}
                    onLink={handleLink}
                    onListOrdered={handleListOrdered}
                    onListTodo={handleListTodo}
                    onQuote={handleQuote}
                    onCode={handleCode}
                    onCaptureSelection={captureSelection}
                />
                <hr className="h-px w-full border-none bg-linear-to-r from-transparent via-slate-400 to-transparent"/>
                {isPreview ? (
                    <div
                        className="markdown-preview"
                        dangerouslySetInnerHTML={{ __html: marked(text) }}
                    >

                    </div>
                ) : (
                    <div className="flex-1 w-[95%] min-h-0">
                        <TypingArea ref={textAreaRef} value={text} onChange={setText} onKeyDown={handleKeyDown} />
                    </div>
                )}
            </div>

        </main>
    )
}