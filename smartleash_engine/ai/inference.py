import numpy as np

def predict(model, encoder, processed_audio):
    prediction = model.predict(processed_audio, verbose=0)

    confidence = float(np.max(prediction))
    predicted_index = int(np.argmax(prediction))

    label = encoder.inverse_transform([predicted_index])[0]

    return label, confidence