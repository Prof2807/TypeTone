// export type TypingEvent = {
//     key: string;
//     shiftKey: boolean;
// }

// export type MappingResult = 
//     | { type: "note"; note: string; row: "bottom" | "home" | "top" }
//     | { type: "space" }
//     | { type: "backspace" }
//     | { type: "enter" }
//     | { type: "ignore" }

// const SCALE = ["C4","D4","E4","G4","A4","C5","D5","E5","G5","A5"]

// const TOP_ROW = "qwertyuiop"
// const HOME_ROW = "asdfghjkl"
// const BOTTOM_ROW = "zxcvbnm"

// export function mapKeyToNote(e: TypingEvent): MappingResult {
//     const { key } = e
//     const lower = key.toLowerCase()

//     if (key === " ") return { type: "space" }
//     if (key === "Backspace") return { type: "backspace" }
//     if (key === "Enter") return { type: "enter" }
//     if (key === "Shift" || key === "Control" || key === "Alt" || key === "Escape") {
//         return { type: "ignore" }
//     }

//     let row: string | null = null
//     let index = -1

//     if (TOP_ROW.includes(lower)) { row = TOP_ROW; index = TOP_ROW.indexOf(lower) }
//     else if (HOME_ROW.includes(lower)) { row = HOME_ROW; index = HOME_ROW.indexOf(lower) }
//     else if (BOTTOM_ROW.includes(lower)) { row = BOTTOM_ROW; index = BOTTOM_ROW.indexOf(lower) }

//     if (row === null) return { type: "ignore" }

//     const scaleIndex = row === TOP_ROW ? (index % 5) + 5 : index
//     const rowName = row === TOP_ROW ? "top" : row === HOME_ROW ? "home" : "bottom"
//     return { type: "note", note: SCALE[scaleIndex], row: rowName }
// }

export type TypingEvent = {
    key: string;
    shiftKey: boolean;
}

export type MappingResult = 
    | { type: "note"; note: string; row: "bottom" | "home" | "top" }
    | { type: "space" }
    | { type: "backspace" }
    | { type: "enter" }
    | { type: "ignore" }

// ─── Hand-tuned static map ────────────────────────────────────────────────
// Every letter maps to a specific note.
// Common pairs (bigrams) are placed close together for a melodic feel.
//   th → G4 + G4 (unison)   | he → G4 + E4 (minor 3rd)
//   in → C5 + A4 (major 3rd) | is → C5 + A4 (major 3rd)
//   er → E4 + F4 (minor 2nd) | an → C4 + A4 (major 6th)
//   on → D5 + A4 (perfect 4th) | at → C4 + G4 (perfect 5th)
//   en → E4 + A4 (perfect 4th) | nd → A4 + E4 (perfect 4th)
const NOTE_MAP: Record<string, string> = {
    // Top row
    'q': 'C4', 'w': 'D4', 'e': 'E4', 'r': 'F4', 't': 'G4',
    'y': 'A4', 'u': 'B4', 'i': 'C5', 'o': 'D5', 'p': 'E5',
    
    // Home row
    'a': 'C4', 's': 'A4', 'd': 'E4', 'f': 'F4', 'g': 'G4',
    'h': 'G4', 'j': 'B4', 'k': 'C5', 'l': 'D5',
    
    // Bottom row
    'z': 'C4', 'x': 'D4', 'c': 'E4', 'v': 'F4', 'b': 'G4',
    'n': 'A4', 'm': 'B4'
};

// Row strings used only to determine synth timbre (bottom/home/top)
const TOP_ROW    = "qwertyuiop";
const HOME_ROW   = "asdfghjkl";
const BOTTOM_ROW = "zxcvbnm";

function getRowName(rowString: string): "bottom" | "home" | "top" {
    if (rowString === TOP_ROW) return "top";
    if (rowString === HOME_ROW) return "home";
    return "bottom";
}

export function mapKeyToNote(e: TypingEvent): MappingResult {
    const { key } = e;
    const lower = key.toLowerCase();

    // Special keys
    if (key === " ") return { type: "space" };
    if (key === "Backspace") return { type: "backspace" };
    if (key === "Enter") return { type: "enter" };
    if (["Shift", "Control", "Alt", "Escape", "CapsLock", "Tab", "Meta"].includes(key)) {
        return { type: "ignore" };
    }

    // Which row is this key on? (affects synth timbre only)
    let rowString: string | null = null;
    if (TOP_ROW.includes(lower)) rowString = TOP_ROW;
    else if (HOME_ROW.includes(lower)) rowString = HOME_ROW;
    else if (BOTTOM_ROW.includes(lower)) rowString = BOTTOM_ROW;

    if (rowString === null) return { type: "ignore" };

    const rowName = getRowName(rowString);
    const note = NOTE_MAP[lower];

    if (!note) return { type: "ignore" };

    return { type: "note", note, row: rowName };
}