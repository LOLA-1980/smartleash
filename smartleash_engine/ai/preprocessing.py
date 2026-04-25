import librosa
import numpy as np

def preprocess_audio(audio, sr=22050):
    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=sr,
        n_mels=40
    )

    mel_db = librosa.power_to_db(mel, ref=np.max)

    # asegurar tamaño fijo
    if mel_db.shape[1] < 64:
        pad_width = 64 - mel_db.shape[1]
        mel_db = np.pad(mel_db, ((0, 0), (0, pad_width)))
    else:
        mel_db = mel_db[:, :64]

    mel_db = np.expand_dims(mel_db, axis=-1)
    mel_db = np.expand_dims(mel_db, axis=0)

    return mel_db