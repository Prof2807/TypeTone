import Header from "./components/Header/Header"
import Editor from "./components/Editor/Editor"
import StatusBar from "./components/StatusBar/StatusBar"
import { useState } from "react"

export default function App() {

  const [noteCount, setNoteCount] = useState(0)
  const [bpm, setBpm] = useState(0)

  const handleClear = () => {
    setNoteCount(0)
    setBpm(0)
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-(--background-color) text-white/85"> 

      <Header />
      <Editor onNoteTyped={setNoteCount} onBpmUpdate={setBpm} noteCount={noteCount} />
      <StatusBar noteCount={noteCount} bpm={bpm} onClear={handleClear} />

    </div>
  )
}