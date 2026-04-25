# TRAIN_MODEL.PY

import os
import numpy as np
import librosa
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras import layers, models
from sklearn.preprocessing import LabelEncoder
import pickle


DATASET_PATH = "dataset"
CLASSES = ["vamonos", "fea", "silencio", "otro"]

X = []
y = []

# ==========================
# Cargar audios
# ==========================
for class_name in CLASSES:

    folder = os.path.join(DATASET_PATH, class_name)

    for file in os.listdir(folder):

        file_path = os.path.join(folder, file)

        audio, sr = librosa.load(file_path, sr=16000)

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

        X.append(mel)
        y.append(class_name)

# ==========================
# Convertir a arrays
# ==========================
X = np.array(X)
y = np.array(y)

# ==========================
# Label Encoder
# ==========================
le = LabelEncoder()
y_encoded = le.fit_transform(y)

y_categorical = tf.keras.utils.to_categorical(y_encoded)

# Guardar encoder
with open("C:/Users/rahel/Desktop/smartleash-app/models/label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)

print("Label encoder guardado correctamente")

# ==========================
# Train / Test split
# ==========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y_categorical, test_size=0.2, random_state=42
)

# ==========================
# Modelo CNN
# ==========================
num_classes = y_categorical.shape[1]

model = models.Sequential([
    layers.Conv2D(16, (3, 3), activation='relu', input_shape=(40, 64, 1)),
    layers.MaxPooling2D((2, 2)),

    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(num_classes, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(
    X_train, y_train,
    epochs=20,
    batch_size=16,
    validation_data=(X_test, y_test)
)

# ==========================
# Guardar modelo
# ==========================
model.save("models/smartleash_model.h5")

print("Modelo entrenado y guardado correctamente")