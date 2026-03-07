import os
import numpy as np
import librosa

DATASET_PATH = "dataset"
CLASSES = ["vamonos", "fea", "otro", "silencio"]


def load_dataset():
    X = []
    y = []

    for label_index, label_name in enumerate(CLASSES):
        folder_path = os.path.join(DATASET_PATH, label_name)

        for file_name in os.listdir(folder_path):
            if file_name.endswith(".wav"):
                file_path = os.path.join(folder_path, file_name)

                signal, sr = librosa.load(file_path, sr=16000)

                mfcc = librosa.feature.mfcc(
                    y=signal,
                    sr=sr,
                    n_mfcc=13
                )

                # Normalizar duración (padding o corte)
                if mfcc.shape[1] < 32:
                    pad_width = 32 - mfcc.shape[1]
                    mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode='constant')
                else:
                    mfcc = mfcc[:, :32]

                X.append(mfcc)
                y.append(label_index)

    return np.array(X), np.array(y)


if __name__ == "__main__":
    X, y = load_dataset()
    print("Shape X:", X.shape)
    print("Shape y:", y.shape)
