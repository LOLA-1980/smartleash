#DATASET_LOADER.PY

import os
import numpy as np
import librosa

DATASET_PATH = "dataset"
CLASSES = ["vamonos", "fea", "silencio", "otro"]

def load_dataset():

    X = []
    y = []

    for label_index, label_name in enumerate(CLASSES):

        folder_path = os.path.join(DATASET_PATH, label_name)

        for file_name in os.listdir(folder_path):

            if not file_name.endswith(".wav"):
                continue

            file_path = os.path.join(folder_path, file_name)

            signal, sr = librosa.load(file_path, sr=16000)

            signals = []

            # original
            signals.append(signal)

            # pitch up
            signals.append(librosa.effects.pitch_shift(signal, sr=sr, n_steps=1))

            # pitch down
            signals.append(librosa.effects.pitch_shift(signal, sr=sr, n_steps=-1))

            # speed up
            signals.append(librosa.effects.time_stretch(signal, rate=1.1))

            # speed down
            signals.append(librosa.effects.time_stretch(signal, rate=0.9))

            # noise
            noise = np.random.normal(0, 0.005, len(signal))
            signals.append(signal + noise)

            for s in signals:

                # normalizar señal
                s = s - np.mean(s)
                if np.max(np.abs(s)) > 0:
                    s = s / np.max(np.abs(s))

                # quitar silencio
                s, _ = librosa.effects.trim(s, top_db=20)

                # forzar a 1 segundo
                max_len = 16000

                if len(s) > max_len:
                    s = s[:max_len]
                else:
                    s = np.pad(s, (0, max_len - len(s)))

                # LOG MEL SPECTROGRAM
                mel = librosa.feature.melspectrogram(
                    y=s,
                    sr=sr,
                    n_mels=40
                )

                mel = librosa.power_to_db(mel, ref=np.max)

                # normalizar
                mel = (mel - np.mean(mel)) / (np.std(mel) + 1e-6)

                # ajustar frames
                if mel.shape[1] < 64:

                    pad = 64 - mel.shape[1]

                    mel = np.pad(mel, ((0,0),(0,pad)))

                else:

                    mel = mel[:, :64]

                X.append(mel)
                y.append(label_index)

    return np.array(X), np.array(y)