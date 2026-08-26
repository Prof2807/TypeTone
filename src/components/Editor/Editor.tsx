import { useState } from "react"
import MarkdownToolbar from "./MarkdownToolbar"
import TypingArea from "./TypingArea"
import { mapKeyToNote } from "../../music/keyMapping"
import { playNote } from "../../music/audioEngine"

export default function Editor() {

    const [text, setText] = useState("")

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const result = mapKeyToNote({ key: e.key, shiftKey: e.shiftKey })
        console.log(result)

        if (result.type === "note") {
            playNote(result.note)
        }
    }

    return (
        <main className="flex grow justify-center items-stretch">

            <div className="bg-white/1 items-center backdrop-blur-2xl border border-white/20 flex flex-col w-[50%] rounded-lg">
                <MarkdownToolbar />
                <hr className="h-px w-full border-none bg-linear-to-r from-transparent via-slate-400 to-transparent"/>
                <TypingArea value={text} onChange={setText} onKeyDown={handleKeyDown}/>
            </div>

        </main>
    )
}