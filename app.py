from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/chat"
MODELO = "llama3.2"

SYSTEM_PROMPT = """Eres un asistente virtual amable, útil y conciso.
Responde siempre en español. Sé claro y directo."""

historial = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    mensaje = request.json.get("mensaje", "").strip()
    if not mensaje:
        return jsonify({"error": "Mensaje vacío"}), 400
    historial.append({"role": "user", "content": mensaje})
    try:
        payload = {
            "model": MODELO,
            "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + historial,
            "stream": False,
        }
        respuesta = requests.post(OLLAMA_URL, json=payload, timeout=60)
        respuesta.raise_for_status()
        texto = respuesta.json()["message"]["content"]
        historial.append({"role": "assistant", "content": texto})
        return jsonify({"respuesta": texto})
    except requests.exceptions.ConnectionError:
        historial.pop()
        return jsonify({"error": "Ollama no está corriendo"}), 500
    except Exception as e:
        historial.pop()
        return jsonify({"error": str(e)}), 500

@app.route("/limpiar", methods=["POST"])
def limpiar():
    historial.clear()
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True)