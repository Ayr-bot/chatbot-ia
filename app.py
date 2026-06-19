from flask import Flask, request, jsonify, render_template
import anthropic
import os

app = Flask(__name__, template_folder='templates')

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

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
        respuesta = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=historial
        )
        texto = respuesta.content[0].text
        historial.append({"role": "assistant", "content": texto})
        return jsonify({"respuesta": texto})
    except Exception as e:
        historial.pop()
        return jsonify({"error": str(e)}), 500

@app.route("/limpiar", methods=["POST"])
def limpiar():
    historial.clear()
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)