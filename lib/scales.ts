export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export const SCALES: Record<string, { name: string; intervals: number[] }> = {
  major: { name: "Major", intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { name: "Natural Minor", intervals: [0, 2, 3, 5, 7, 8, 10] },
  harmonicMinor: { name: "Harmonic Minor", intervals: [0, 2, 3, 5, 7, 8, 11] },
  melodicMinor: { name: "Melodic Minor", intervals: [0, 2, 3, 5, 7, 9, 11] },
  dorian: { name: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10] },
  locrian: { name: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10] },
  pentatonicMajor: { name: "Pentatonic Major", intervals: [0, 2, 4, 7, 9] },
  pentatonicMinor: { name: "Pentatonic Minor", intervals: [0, 3, 5, 7, 10] },
  blues: { name: "Blues", intervals: [0, 3, 5, 6, 7, 10] },
  chromatic: { name: "Chromatic", intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
}

export const getScaleMidiNotes = (rootMidi: number, scaleKey: string, numNotes: number): number[] => {
  const scale = SCALES[scaleKey]
  if (!scale) return []

  const notes: number[] = []
  for (let i = 0; i < numNotes; i++) {
    const octave = Math.floor(i / scale.intervals.length)
    const noteInScale = i % scale.intervals.length
    const midiNote = rootMidi + octave * 12 + scale.intervals[noteInScale]
    notes.push(midiNote)
  }
  return notes
}
