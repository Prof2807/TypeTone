

export default function StatusBar() {
    return (
        <footer className="flex items-center justify-between mt-auto p-4">

            <div className="flex items-center gap-8">
                <span>0 notes</span>
                <span>0 BPM</span>
            </div>

            <button className="mr-8 p-2 px-3 hover:bg-red-900/20 rounded-lg border border-transparent hover:border-red-900/60">Clear</button>

        </footer>
    )
}