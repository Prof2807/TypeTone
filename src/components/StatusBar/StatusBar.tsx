

interface StatusBarProps {
    noteCount: number
    bpm: number
    onClear: () => void
}

export default function StatusBar({ noteCount, bpm, onClear }: StatusBarProps) {
    return (
        <footer className="flex items-center justify-between mt-auto p-4">

            <div className="flex items-center gap-8">
                <span>{noteCount} notes</span>
                <span>{bpm} BPM</span>
            </div>

            <button className="mr-8 p-2 px-3 hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-900/60" onClick={onClear} >Clear</button>

        </footer>
    )
}