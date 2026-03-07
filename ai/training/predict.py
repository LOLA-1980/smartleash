import numpy as np
import librosa
from tensorflow.keras.models import load_model

# Cargar modelo
model = load_model("ai/training/smartleash_model.h5")

# Clases (IMPORTANTE: mismo orden que en entrenamiento)
classes = ["vamonos", "fea", "otro", "silencio"]

def extract_features(file_path):
    audio, sr = librosa.load(file_path, sr=16000)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)

    # Ajustar tamaño a 32 frames
    if mfcc.shape[1] < 32:
        pad_width = 32 - mfcc.shape[1]
        mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)))
    else:
        mfcc = mfcc[:, :32]

    return mfcc

# 👇 CAMBIA ESTA RUTA
test_file = "ai/training/audioTest/test_silencio.wav"

features = extract_features(test_file)
features = features[np.newaxis, ..., np.newaxis]

prediction = model.predict(features)

print("Probabilidades:", prediction)

confidence = np.max(prediction)
predicted_index = np.argmax(prediction)

if confidence < 0.7:
    print("Predicción: otro")
else:
    predicted_class = classes[predicted_index]
    print("Predicción:", predicted_class)
