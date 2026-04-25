import time

def send_command(command):
    print(f"📡 Enviando comando al collar: {command}")

    if command == "vamonos":
        activate_vibration()


def activate_vibration():
    print("🐕 Collar vibrando...")
    time.sleep(1)
    print("✅ Vibración finalizada\n")