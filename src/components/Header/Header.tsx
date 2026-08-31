import { Volume2, VolumeX, Settings } from "lucide-react";
import { useState, useRef } from "react";
import type { SoundMode } from "../../music/audioEngine";

interface HeaderProps {
  isMuted: boolean
  onToggleMute: () => void
  volume: number
  onVolumeChange: (value: number) => void
  mode: string
  onModeChange: (mode: SoundMode) => void
  editorBlur: number
  onEditorBlurChange: (value: number) => void
  waveOffset: number
  onWaveOffsetChange: (value: number) => void
}

export default function Header({ isMuted, onToggleMute, volume, onVolumeChange, mode, onModeChange, editorBlur, onEditorBlurChange, waveOffset, onWaveOffsetChange }: HeaderProps) {
  const [showSlider, setShowSlider] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowSlider(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShowSlider(false)
      timeoutRef.current = null
    }, 800)
  }

  const isIconMuted = isMuted || volume === 0

  return (
    <header className="flex items-center justify-between p-4 mb-12">
      <div>
        <h1 className="text-3xl font-deca font-bold cursor-pointer select-none">typetone</h1>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2 mx-8">
        {(["ambient", "chirp", "lofi"] as SoundMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`px-3 py-2 rounded-md  transition-colors border border-transparent hover:border-white/20 ${
              mode === m ? "bg-white/5 border-white/20" : "hover:bg-white/10"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1) }
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-4xl border transition-colors ${
              isMuted
                ? 'border-red-500/60 bg-red-500/10 hover:bg-red-500/20'
                : 'border-transparent hover:border-white/20 hover:bg-white/5'
            }`}
          >
            {isIconMuted ? <VolumeX className="w-6 h-6"/> : <Volume2 className="w-6 h-6" />}
          </button>

          {showSlider && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-1 flex flex-col items-center bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-lg min-w-15"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-1.5 h-24 cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                style={{
                  background: `linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
                  borderRadius: '4px',
                  accentColor: '#ffffff'
                }}
              />
              <span className="text-xs text-white/60 mt-2">{Math.round(volume * 100)}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-4xl  border border-transparent hover:border-white/20 hover:bg-white/5"
          >
            <Settings className="w-6 h-6"/>
          </button>

          {showSettings && (
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg p-4 shadow-lg w-64 z-50">
              <div className="mb-3">
                <label className="text-sm text-white/70">Editor Transparency</label>
                <input 
                  type="range"
                  min={0}
                  max={20}
                  step={0.5}
                  value={editorBlur}
                  onChange={(e) => onEditorBlurChange(parseFloat(e.target.value))}
                  className="w-full mt-1"
                />
                <span> { editorBlur }px </span>
              </div>
              <div>
                <label className="text-sm text-white/70">Wave Vertical Offset</label>
                <input 
                  type="range"
                  min={-200}
                  max={200}
                  step={1}
                  value={waveOffset}
                  onChange={(e) => onWaveOffsetChange(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
                <span className="text-sm text-white/50"> {waveOffset}px </span>
              </div>
            </div>
          ) }
      </div>

      </div>
    </header>
  )
}