import { useState } from "react"


export default function TypingArea() {

    const [text, setText] = useState("")

    return (
        <textarea   
            placeholder="Just type normally, and enjoy the melody ..." 
            aria-label="Typing area"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="resize-none w-[95%] h-full rounded-b-md mt-1 focus:outline-none focus:ring-0 scrollbar-none" 
        />
    )
}