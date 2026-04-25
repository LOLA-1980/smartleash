#RECORD_TEST.PY
import sounddevice as sd
import soundfile as sf

samplerate = 44100
duration = 3

print("🎤 Habla ahora...")

audio = sd.rec(
    int(duration * samplerate),
    samplerate=samplerate,
    channels=1,
    device=17
)

sd.wait()

sf.write("mic_test.wav", audio, samplerate)

print("✅ Audio grabado como mic_test.wav")