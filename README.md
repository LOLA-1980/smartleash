# 🐶 SmartLeash – Secure Intelligent Communication System for Deaf Dogs

SmartLeash is an intelligent and secure system designed to help dogs with hearing loss recognize their name and essential commands through vibration-based feedback using a smart collar or leash.

This project integrates Artificial Intelligence, Mobile Development, Embedded Systems, and Cybersecurity principles.

---

## 🎯 Project Objective

To develop a secure and adaptive keyword recognition system that:

- Detects the dog’s name (customizable per user)
- Detects predefined commands ("Ven", "No")
- Processes audio locally on the mobile device
- Sends encrypted signals via Bluetooth to a smart collar or leash
- Activates specific vibration patterns to communicate with the dog

---

## 🧠 Artificial Intelligence Component

The AI system is based on:

- Keyword spotting (small CNN model)
- Audio preprocessing using MFCC or spectrograms
- Personalized fine-tuning for the dog’s name
- On-device inference (no cloud dependency)

### Model Classes

- Dog Name (customizable)
- "Ven" (fixed)
- "No" (fixed)
- Background/Noise

---

## 🔐 Cybersecurity Features

- Local audio processing (privacy-first)
- No storage of raw audio recordings
- Encrypted Bluetooth communication
- Device authentication between app and collar
- Secure model storage

---

## 📱 System Architecture

Mobile App (React Native)
→ Audio capture
→ AI model inference
→ Secure Bluetooth signal
→ Smart collar vibration feedback

---

## 📂 Project Structure

smartleash-app/
│
├── ai/
│ ├── data/
│ ├── models/
│ ├── training/
│ └── inference/
│
├── docs/
├── requirements.txt
└── README.md


---

## 🚀 Development Roadmap

Phase 1 – Environment setup and architecture design  
Phase 2 – Base keyword detection model  
Phase 3 – Personalized name adaptation  
Phase 4 – Mobile integration  
Phase 5 – Secure Bluetooth communication  
Phase 6 – Hardware prototype  

---

## 👩‍💻 Author

Lillys 
SmartLeash Project – 2026

