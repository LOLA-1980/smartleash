import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.utils import to_categorical
from dataset_loader import load_dataset

# Cargar datos
X, y = load_dataset()

# Añadir dimensión de canal (para CNN)
X = X[..., np.newaxis]

# One-hot encoding
y = to_categorical(y)

# Separar entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Crear modelo
model = Sequential([
    Conv2D(16, (3, 3), activation='relu', input_shape=(13, 32, 1)),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(32, activation='relu'),
    Dense(4, activation='softmax')  # 4 clases
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Entrenar
history = model.fit(
    X_train,
    y_train,
    epochs=20,
    validation_data=(X_test, y_test)
)

# Evaluar
loss, accuracy = model.evaluate(X_test, y_test)
print("Test Accuracy:", accuracy)

model.save("ai/training/smartleash_model.h5")
print("Modelo guardado correctamente.")
