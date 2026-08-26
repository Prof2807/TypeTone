export type TypingEvent = {
    key: string;
    shiftKey: boolean;
}

export type MappingResult = 
    | { type: "note"; note: string }
    | { type: "space" }
    | { type: "backspace" }
    | { type: "enter" }
    | { type: "ignore" }

const SCALE = ["C3","D3","E3","G3","A3","C4","D4","E4","G4","A4"]

const TOP_ROW = "qwertyuiop"
const HOME_ROW = "asdfghjkl"
const BOTTOM_ROW = "zxcvbnm"

export function mapKeyToNote(e: TypingEvent): MappingResult {
    const { key } = e
    const lower = key.toLowerCase()

    if (key === " ") return { type: "space" }
    if (key === "Backspace") return { type: "backspace" }
    if (key === "Enter") return { type: "enter" }
    if (key === "Shift" || key === "Control" || key === "Alt" || key === "Escape") {
        return { type: "ignore" }
    }

    let row: string | null = null
    let index = -1

    if (TOP_ROW.includes(lower)) { row = TOP_ROW; index = TOP_ROW.indexOf(lower) }
    else if (HOME_ROW.includes(lower)) { row = HOME_ROW; index = HOME_ROW.indexOf(lower) }
    else if (BOTTOM_ROW.includes(lower)) { row = BOTTOM_ROW; index = BOTTOM_ROW.indexOf(lower) }

    if (row === null) return { type: "ignore" }

    const scaleIndex = row === TOP_ROW ? (index % 5) + 5 : index
    return { type: "note", note: SCALE[scaleIndex] }
}