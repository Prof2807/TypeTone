import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";

interface HeaderProps {
  isMuted: boolean
  onToggleMute: () => void
  volume: number
  onVolumeChange: (value: number) => void
}

export default function Header({ isMuted, onToggleMute, volume, onVolumeChange }: HeaderProps) {
  const [showSlider, setShowSlider] = useState(false)
  const timeoutRef = useRef<number | null>(null)

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
              className="absolute left-1/2 -translate-x-1/2 top-full mt-1 flex flex-col items-center bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-lg min-w-[60px]"
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
    </header>
  )
}