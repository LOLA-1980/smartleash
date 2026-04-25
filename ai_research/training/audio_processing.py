#AUDIO_PROCESSING.PY
import librosa
import numpy as np
import matplotlib.pyplot as plt

# Cargar audio (1 segundo recomendado)
audio_path = "ai/training/sample.wav"
signal, sample_rate = librosa.load(audio_path, sr=16000)

print("Duración (segundos):", len(signal) / sample_rate)
print("Sample rate:", sample_rate)

# Generar MFCC
mfcc = librosa.feature.mfcc(
    y=signal,
    sr=sample_rate,
    n_mfcc=13  # estándar en reconocimiento de voz
)

print("Shape del MFCC:", mfcc.shape)

# Visualizar
plt.figure(figsize=(10, 4))
plt.imshow(mfcc, aspect='auto', origin='lower')
plt.colorbar()
plt.title("MFCC")
plt.ylabel("Coeficientes")
plt.xlabel("Tiempo")
plt.tight_layout()
plt.show()
