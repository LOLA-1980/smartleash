# LISTEN_MIC.PY

import numpy as np
import sounddevice as sd
import librosa
import tensorflow as tf
import pickle

# ==========================
# Cargar modelo y encoder
# ==========================
model = tf.keras.models.load_model("ai/training/smartleash_model.h5")

with open("C:/Users/rahel/Desktop/smartleash-app/ai/training/label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

# ==========================
# Parámetros
# ==========================
SAMPLE_RATE = 16000
DURATION = 1
THRESHOLD_VOLUME = 3
THRESHOLD_CONFIDENCE = 0.85

print("🎤 Escuchando... di un comando\n")

while True:

    audio = sd.rec(int(SAMPLE_RATE * DURATION),
                   samplerate=SAMPLE_RATE,
                   channels=1,
                   dtype='float32')
    sd.wait()

    audio = np.squeeze(audio)

    volume = np.linalg.norm(audio)
    print("Nivel de audio:", volume)

    if volume < THRESHOLD_VOLUME:
        print("🔇 Muy bajo, ignorado\n---------------------")
        continue

    # ==========================
    # MISMO PROCESAMIENTO QUE TRAIN
    # ==========================

    audio = audio - np.mean(audio)

    if np.max(np.abs(audio)) > 0:
        audio = audio / np.max(np.abs(audio))

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

    # ==========================
    # Predicción
    # ==========================

    prediction = model.predict(mel, verbose=0)
    predicted_index = np.argmax(prediction)
    confidence = prediction[0][predicted_index]
    predicted_label = le.inverse_transform([predicted_index])[0]

    print("Predicción:", predicted_label)
    print("Confianza:", confidence)

    # ==========================
    # FILTRO FINAL
    # ==========================

    if predicted_label == "vamonos" and confidence > THRESHOLD_CONFIDENCE:
        print("🐕 COMANDO DETECTADO: VÁMONOS 🔥")
    else:
        print("Ignorado")

    print("---------------------")