# PREDICT.PY

import librosa
import numpy as np
from tensorflow.keras.models import load_model

model = load_model("ai/training/smartleash_model.h5")

classes = ["vamonos", "fea", "silencio", "otro"]

test_file = "test_audio.wav"

audio, sr = librosa.load(test_file, sr=16000)

audio = audio - np.mean(audio)
if np.max(np.abs(audio)) > 0:
    audio = audio / np.max(np.abs(audio))

# 🔥 IMPORTANTE:
# Si entrenaste con trim, déjalo.
# Si quitaste trim en entrenamiento, quítalo aquí también.
audio, _ = librosa.effects.trim(audio, top_db=20)

max_len = 16000
if len(audio) > max_len:
    audio = audio[:max_len]
else:
    audio = np.pad(audio, (0, max_len - len(audio)))

mel = librosa.feature.melspectrogram(
    y=audio,
    sr=16000,
    n_mels=40
)

mel = librosa.power_to_db(mel, ref=np.max)
mel = (mel - np.mean(mel)) / (np.std(mel) + 1e-6)

if mel.shape[1] < 64:
    pad = 64 - mel.shape[1]
    mel = np.pad(mel, ((0, 0), (0, pad)))
else:
    mel = mel[:, :64]

mel = np.expand_dims(mel, axis=-1)
mel = np.expand_dims(mel, axis=0)

prediction = model.predict(mel, verbose=0)[0]

predicted_index = np.argmax(prediction)
predicted_class = classes[predicted_index]
confidence = float(prediction[predicted_index])

print("Probabilidades:", prediction)
print("Predicción:", predicted_class)
print("Confianza:", confidence)