import * as Tone from "tone"

let masterGain: Tone.Gain | null = null
let analyser: Tone.Analyser | null = null
let mediaStreamDestination: MediaStreamAudioDestinationNode | null = null

let currentMode: SoundMode = "ambient"

export type SoundMode = "ambient" | "chirp" | "lofi"

type SynthConfig = {
    oscillator: { type: "sine" | "triangle" | "square" | "sawtooth" };
    envelope: { attack: number; decay: number; sustain: number; release: number };
    volume: number;
};

const MODE_CONFIGS: Record<SoundMode, { bottom: SynthConfig; home: SynthConfig; top: SynthConfig }> = {
    ambient: {
        bottom: { oscillator: { type: "sine" }, envelope: { attack: 0.02, decay: 0.3, sustain: 0.6, release: 1.2 }, volume: -8 },
        home: { oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 1.0 }, volume: -5 },
        top: { oscillator: { type: "sine" }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.4, release: 0.8 }, volume: -4 }
    },
    chirp: {
        bottom: { oscillator: { type: "triangle" }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.3 }, volume: -6 },
        home: { oscillator: { type: "triangle" }, envelope: { attack: 0.003, decay: 0.08, sustain: 0.15, release: 0.2 }, volume: -3 },
        top: { oscillator: { type: "triangle" }, envelope: { attack: 0.002, decay: 0.05, sustain: 0.1, release: 0.15 }, volume: -2 }
    },
    lofi: {
        bottom: { oscillator: { type: "square" }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 }, volume: -7 },
        home: { oscillator: { type: "square" }, envelope: { attack: 0.008, decay: 0.15, sustain: 0.2, release: 0.4 }, volume: -4 },
        top: { oscillator: { type: "square" }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.3 }, volume: -3 }
    }
    
}

function getMaster() {
    if (!masterGain) {
        masterGain = new Tone.Gain(1)
        analyser = new Tone.Analyser('waveform', 1024)
        
        masterGain.connect(analyser)
        analyser.connect(Tone.Destination)

        if (!mediaStreamDestination) {
            mediaStreamDestination = Tone.context.createMediaStreamDestination()
            masterGain.connect(mediaStreamDestination)
        }
    }
    return { masterGain, analyser }
}

let synths = {
    bottom: null as Tone.Synth | null,
    home: null as Tone.Synth | null,
    top: null as Tone.Synth | null,
}
let lastTime = 0

function getSynth(row: "bottom" | "home" | "top") {
    if (!synths[row]) {
        const config = MODE_CONFIGS[currentMode][row]
        const synth = new Tone.Synth(config)
        synth.connect(getMaster().masterGain)
        synths[row] = synth
    }
    return synths[row]
}

export function setMode(mode: SoundMode) {
    currentMode = mode
    if (synths.bottom) { synths.bottom.dispose(); synths.bottom = null }
    if (synths.home) { synths.home.dispose(); synths.home = null }
    if (synths.top) { synths.top.dispose(); synths.top = null }
}

export function getMediaStream(): MediaStream | null {
    if (!mediaStreamDestination) {
        getMaster()
    }
    return mediaStreamDestination ? mediaStreamDestination.stream : null
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
        }).connect(getMaster().masterGain)
    }
    return kick
}

function getSnare() {
    if (!snare) {
        snare = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
            volume: -8
        }).connect(getMaster().masterGain)
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
        }).connect(getMaster().masterGain)
        crash.frequency.value = 200
    }
    return crash
}

export function playSpace() {
    // Kick drum on space
    const now = performance.now()
    const gap = lastTime === 0 ? 400 : now - lastTime
    lastTime = now

    const pitch = Math.min(Math.max(gap / 200, 80), 150)
    getKick().triggerAttackRelease(pitch, "8n")
}

export function playBackspace() {
    lastTime = performance.now()

    getSnare().triggerAttackRelease("8n")
}

export function playEnter() {
    lastTime = performance.now()

    getCrash().triggerAttackRelease(200, "4n")
}

export function getAnalyser() {
    return getMaster().analyser
}

export function setVolume(value: number) {
    const master = getMaster().masterGain
    master.gain.value = Math.max(0, Math.min(1, value))
}

export function setMute(muted: boolean) {
    Tone.Destination.mute = muted
}