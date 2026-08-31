import Header from "./components/Header/Header"
import Editor from "./components/Editor/Editor"
import StatusBar from "./components/StatusBar/StatusBar"
import Visualiser from "./components/Visualiser/Visualiser"
import { useEffect, useState } from "react"
import { setMute, setVolume, setMode } from "./music/audioEngine"
import type { SoundMode } from "./music/audioEngine"

export default function App() {

  const [noteCount, setNoteCount] = useState(0)
  const [bpm, setBpm] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolumeState] = useState(1.0)
  const [mode, setModeState] = useState<SoundMode>("ambient")
  const [editorBlur, setEditorBlur] = useState(5.5)
  const [waveOffset, setWaveOffset] = useState(0)

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

  useEffect(() => {
    setMode(mode)
  }, [mode])

  return (
    <div className="h-dvh flex flex-col overflow-hidden  text-white/85 relative"> 

      <Visualiser waveOffset={waveOffset} />
      <Header 
        isMuted={isMuted}
        onToggleMute={toggleMute}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        mode={mode}
        onModeChange={setModeState}
        editorBlur={editorBlur}
        onEditorBlurChange={setEditorBlur}
        waveOffset={waveOffset}
        onWaveOffsetChange={setWaveOffset}
      />
      <Editor onNoteTyped={setNoteCount} onBpmUpdate={setBpm} noteCount={noteCount} editorBlur={editorBlur} />
      <StatusBar noteCount={noteCount} bpm={bpm} onClear={handleClear} />

    </div>
  )
}