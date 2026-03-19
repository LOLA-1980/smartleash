#CONVERT_AUDIO.PY
import librosa
import soundfile as sf
import os

dataset_path = "dataset"

for root, dirs, files in os.walk(dataset_path):
    for file in files:
        if file.endswith(".wav"):
            file_path = os.path.join(root, file)

            audio, sr = librosa.load(file_path, sr=16000)

            sf.write(file_path, audio, 16000)

            print("Converted:", file_path)