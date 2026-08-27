import * as Tone from "tone"

let synths = {
    bottom: null as Tone.Synth | null,
    home: null as Tone.Synth | null,
    top: null as Tone.Synth | null,
}
let lastTime = 0

function getSynth(row: "bottom" | "home" | "top") {
    if (!synths[row]) {
        const configs = {
            bottom: {
                oscillator: { type: "sine" },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.5 },
                volume: -6  // slightly quieter, bassy
            },
            home: {
                oscillator: { type: "sine" },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.3 },
                volume: -3  // main voice, balanced
            },
            top: {
                oscillator: { type: "sine" },
                envelope: { attack: 0.004, decay: 0.05, sustain: 0.2, release: 0.2 },
                volume: -2  // slightly brighter/louder
            }
        } as const
        
        synths[row] = new Tone.Synth(configs[row]).toDestination()
    }
    return synths[row]
}

export function playNote(note: string, row: "bottom" | "home" | "top") {
    const now = performance.now()
    const gap = lastTime === 0 ? 400 : now - lastTime
    lastTime = now

    const duration = Math.min(Math.max(gap / 6, 0.05), 0.5)
    const release = Math.min(Math.max(gap / 4, 0.05), 0.8)

    const s = getSynth(row)
    s.set({ envelope: { release } })
    s.triggerAttackRelease(note, duration)
}

let kick: Tone.MembraneSynth | null = null
let snare: Tone.NoiseSynth | null = null
let crash: Tone.MetalSynth | null = null

function getKick() {
    if (!kick) {
        kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 5,
            oscillator: { type: "sine" },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4, attackCurve: "exponential" },
            volume: -4
        }).toDestination()
    }
    return kick
}

function getSnare() {
    if (!snare) {
        snare = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
            volume: -8
        }).toDestination()
    }
    return snare
}

function getCrash() {
    if (!crash) {
        crash = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
            harmonicity: 8.5,
            modulationIndex: 40,
            resonance: 800,
            volume: -10
        }).toDestination()
        crash.frequency.value = 200
    }
    return crash
}

// ─── Export functions for each special key ───────────────────────────

export function playSpace() {
    // Kick drum on space
    const now = performance.now()
    const gap = lastTime === 0 ? 400 : now - lastTime
    lastTime = now

    // Optional: pitch the kick slightly based on gap (fast = higher, slow = lower)
    const pitch = Math.min(Math.max(gap / 200, 80), 150) // 80–150 Hz
    getKick().triggerAttackRelease(pitch, "8n")
}

export function playBackspace() {
    // Snare / hat on backspace
    lastTime = performance.now()

    // Short, snappy sound
    getSnare().triggerAttackRelease("8n")
}

export function playEnter() {
    // Crash / impact on enter
    lastTime = performance.now()

    // Long, ringing sound
    getCrash().triggerAttackRelease(200, "4n")
}