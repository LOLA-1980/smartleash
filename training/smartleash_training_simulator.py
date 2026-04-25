import random
import matplotlib.pyplot as plt


def simular_comando(prob_inicial, factor_mejora, dias=30, dias_sin_entreno=None):
    probabilidad = prob_inicial
    historial = []

    if dias_sin_entreno is None:
        dias_sin_entreno = []

    for dia in range(dias):

        # Si es día sin entrenamiento → aplicar olvido
        if dia in dias_sin_entreno:
            probabilidad *= 0.97  # pierde 3% de consolidación
            historial.append(probabilidad)
            continue

        intentos = 10
        respuestas_correctas = 0

        for intento in range(intentos):
            if random.random() < probabilidad:
                respuestas_correctas += 1

        mejora = (respuestas_correctas / intentos) * factor_mejora
        probabilidad += mejora
        probabilidad = min(probabilidad, 1.0)

        historial.append(probabilidad)

    return historial


# Parámetros
dias_entrenamiento = 30
probabilidad_inicial = 0.2

# Simular 3 días sin entrenamiento
dias_descanso = [10, 11, 12]


# Simulación
nombre = simular_comando(probabilidad_inicial, 0.08, dias_entrenamiento, dias_descanso)
ven = simular_comando(probabilidad_inicial, 0.05, dias_entrenamiento, dias_descanso)
emergencia = simular_comando(probabilidad_inicial, 0.03, dias_entrenamiento, dias_descanso)


# Gráfica
plt.plot(range(1, dias_entrenamiento + 1), nombre)
plt.plot(range(1, dias_entrenamiento + 1), ven)
plt.plot(range(1, dias_entrenamiento + 1), emergencia)

plt.xlabel("Días")
plt.ylabel("Probabilidad de respuesta correcta")
plt.title("SmartLeash - Aprendizaje con Olvido")

plt.legend(["Nombre", "Ven", "Emergencia"])

plt.show()