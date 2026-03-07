import sounddevice as sd
import numpy as np
import librosa
import tensorflow as tf


# cargar modelo
model = tf.keras.models.load_model("ai/training/smartleash_model.h5")

classes = ["vamonos", "fea", "otro", "silencio"]

samplerate = 16000
duration = 1.5  # segundos

print("🎤 Escuchando... di un comando")

while True:

    audio = sd.rec(
        int(duration * samplerate),
        samplerate=samplerate,
        channels=1,
    )

    sd.wait()

    volume = np.linalg.norm(audio)
    print("Nivel de audio:", volume)

    audio = audio.flatten()

    audio = audio - np.mean(audio)
    audio = audio / np.max(np.abs(audio))

    # extraer MFCC
    mfcc = librosa.feature.mfcc(
    y=audio,
    sr=samplerate,
    n_mfcc=13
)

    # asegurar 32 frames
    if mfcc.shape[1] < 32:
        pad_width = 32 - mfcc.shape[1]
        mfcc = np.pad(mfcc, pad_width=((0,0),(0,pad_width)))
    else:
        mfcc = mfcc[:, :32]

    # añadir canal
    mfcc = np.expand_dims(mfcc, axis=-1)

    # añadir batch
    mfcc = np.expand_dims(mfcc, axis=0)

    # predicción
    prediction = model.predict(mfcc)

    predicted_index = np.argmax(prediction)
    predicted_class = classes[predicted_index]

    print("Probabilidades:", prediction)
    print("Predicción:", predicted_class)
    print("---------------------")

    