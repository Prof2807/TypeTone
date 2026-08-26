import * as Tone from "tone"

let synth: Tone.Synth | null = null
let lastTime = 0
let started = false

function getSynth() {
    if (!synth) {
        synth = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.3 },
        }).toDestination()
    }
    return synth
}

export function playNote(note: string) {

    if (!started) {
        Tone.start()
        started = true
    }

    const now = performance.now()
    const gap = lastTime === 0 ? 400 : now - lastTime
    lastTime = now

    const duration = Math.min(Math.max(gap / 6, 0.05), 0.5)
    const release = Math.min(Math.max(gap / 4, 0.05), 0.8)

    const s = getSynth()
    s.set({ envelope: { release } })
    s.triggerAttackRelease(note, duration)

}