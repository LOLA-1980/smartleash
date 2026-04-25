import tensorflow as tf
import pickle
import os


def load_model_and_encoder():
    # Obtener ruta base del proyecto
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    model_path = os.path.join(BASE_DIR, "models", "smartleash_model.h5")
    encoder_path = os.path.join(BASE_DIR, "models", "label_encoder.pkl")

    model = tf.keras.models.load_model(model_path)

    with open(encoder_path, "rb") as f:
        label_encoder = pickle.load(f)

    return model, label_encoder