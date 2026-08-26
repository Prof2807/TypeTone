import { Bold, Italic, Code, Strikethrough, Underline, Heading, Link, ListOrdered, Quote, ListTodo } from "lucide-react"

export default function MarkdownToolbar() {
    return (
        <div className="w-full flex gap-2 items-center justify-center my-2">

            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><Bold className="w-4 h-4"/></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><Italic className="w-4 h-4"/></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><Underline className="w-4 h-4"/></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><Strikethrough className="w-4 h-4" /></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><Heading className="w-4 h-4"/></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><Link className="w-4 h-4"/></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><ListOrdered className="w-4 h-4"/></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><ListTodo className="w-4 h-4"/></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><Quote className="w-4 h-4"/></button>
            <button className="aspect-square px-2 rounded-sm border border-transparent hover:border-white/20 hover:bg-white/5"><Code className="w-4 h-4"/></button>

        </div>
    )
}