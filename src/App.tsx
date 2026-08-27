import Header from "./components/Header/Header"
import Editor from "./components/Editor/Editor"
import StatusBar from "./components/StatusBar/StatusBar"
import Visualiser from "./components/Visualiser/Visualiser"
import { useState } from "react"
import { setMute, setVolume } from "./music/audioEngine"

export default function App() {

  const [noteCount, setNoteCount] = useState(0)
  const [bpm, setBpm] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolumeState] = useState(1.0)

  const handleClear = () => {
    setNoteCount(0)
    setBpm(0)
  }

  const toggleMute = () => {
    const newState = !isMuted
    setIsMuted(newState)
    setMute(newState)
  }

  const handleVolumeChange = (value: number) => {
    setVolumeState(value)
    setVolume(value)
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden  text-white/85 relative"> 

      <Visualiser />
      <Header 
        isMuted={isMuted}
        onToggleMute={toggleMute}
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />
      <Editor onNoteTyped={setNoteCount} onBpmUpdate={setBpm} noteCount={noteCount} />
      <StatusBar noteCount={noteCount} bpm={bpm} onClear={handleClear} />

    </div>
  )
}