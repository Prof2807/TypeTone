

interface TypingAreaProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export default function TypingArea( { value, onChange, onKeyDown }: TypingAreaProps ) {

    return (
        <textarea   
            placeholder="Just type normally, and enjoy the melody ..." 
            aria-label="Typing area"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="resize-none w-[95%] h-full rounded-b-md mt-1 focus:outline-none focus:ring-0 scrollbar-none"
            onKeyDown={onKeyDown}
        />
    )
}