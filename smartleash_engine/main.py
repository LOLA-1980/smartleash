import sounddevice as sd
import numpy as np

from ai.model_loader import load_model_and_encoder
from ai.preprocessing import preprocess_audio
from ai.inference import predict
from communication.bluetooth_sim import send_command

# Cargar modelo y encoder
model, encoder = load_model_and_encoder()

CONFIDENCE_THRESHOLD = 0.85
VOLUME_THRESHOLD = 2.0

print("🎤 SmartLeash escuchando... di un comando\n")

def audio_callback(indata, frames, time, status):
    volume = np.linalg.norm(indata)

    if volume < VOLUME_THRESHOLD:
        return

    audio = indata.flatten()

    processed_audio = preprocess_audio(audio)
    label, confidence = predict(model, encoder, processed_audio)

    print(f"Predicción: {label} | Confianza: {confidence:.2f}")

    if confidence > CONFIDENCE_THRESHOLD and label == "vamonos":
        send_command(label)

with sd.InputStream(callback=audio_callback):
    while True:
        pass