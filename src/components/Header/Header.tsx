import { Volume2 } from "lucide-react";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 mb-12">

            <div>
                <h1 className="text-3xl font-deca font-bold cursor-pointer select-none">typetone</h1>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 px-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/20">Ambient</button>
                <button className="p-2 px-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/20">Chip</button>
                <button className="p-2 px-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/20">Lo-Fi</button>

                <span className="mx-3"> </span>

                <div>
                    <button><Volume2 /></button>
                </div>
            </div>

        </header>
    )
}