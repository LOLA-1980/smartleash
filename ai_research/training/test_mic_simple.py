#TEST_MIC_SIMPLE.PY
import sounddevice as sd
import numpy as np
import soundfile as sf

duration = 4
fs = 44100

print("🎤 Habla ahora...")

recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
sd.wait()

print("Grabación terminada")

print("Nivel máximo:", np.max(np.abs(recording)))

sf.write("test_audio.wav", recording, fs)

print("Archivo guardado como test_audio.wav")