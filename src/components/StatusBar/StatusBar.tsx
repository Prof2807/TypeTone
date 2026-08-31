import { useEffect, useRef, useState } from "react"
import { getMediaStream } from "../../music/audioEngine"
import { Circle, Square, Download } from "lucide-react"

interface StatusBarProps {
    noteCount: number
    bpm: number
    onClear: () => void
}

function RecordingControls() {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current)
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop()
            }
        }
    }, [])

    const startRecording = () => {
        const stream = getMediaStream()
        if (!stream) {
            alert("Recording not Supported!!")
            return
        }

        chunksRef.current = []
        const recorder = new MediaRecorder(stream)
        mediaRecorderRef.current = recorder

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" })
            const url = URL.createObjectURL(blob)
            setAudioUrl(url)
            setIsRecording(false)
            if (timerRef.current) window.clearInterval(timerRef.current)
        }

        recorder.start()
        setIsRecording(true)
        setRecordingTime(0)
        timerRef.current = window.setInterval(() => {
            setRecordingTime(prev => prev + 1)
        }, 1000)
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current &&  mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop()
        }
    }

    const downloadRecording = () => {
        if (audioUrl) {
            const a = document.createElement("a")
            a.href = audioUrl
            a.download = "typetone-recording.webm"
            a.click()
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="flex items-cenetr gap-2">
            {isRecording ? (
                <div className="flex items-center gap-3">
                    <button
                        onClick={stopRecording}
                        className="px-3 py-1 flex items-center gap-2 rounded-md bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-sm"
                    > <Square className="w-4 h-4 text-red-500"/> Stop</button>
                    <span className="font-mono">{ formatTime(recordingTime) }</span>
                </div>
            ) : (
                <button
                    onClick={startRecording}
                    className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/20 text-sm flex items-center gap-2"
                >
                    <Circle className="fill-red-500 text-red-500 w-4 h-4" /> Record
                </button>
            )}
            {audioUrl && !isRecording && (
                <button
                    onClick={downloadRecording}
                    className="px-3 py-1 flex items-center gap-2 rounded-md bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-sm"
                >
                    <Download className="w-5 h-5"/> Download
                </button>
            ) }
        </div>
    )

}

export default function StatusBar({ noteCount, bpm, onClear }: StatusBarProps) {
    return (
        <footer className="flex items-center justify-between mt-auto p-4">

            <div className="flex items-center gap-8">
                <span>{noteCount} notes</span>
                <span>{bpm} BPM</span>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex">
                <RecordingControls />
            </div>

            <button className="mr-8 p-2 px-3 hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-900/60" onClick={onClear} >Clear</button>

        </footer>
    )
}