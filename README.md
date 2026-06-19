# 🤖 ChatBot IA con Flask + Claude

## Estructura del proyecto

```
chatbot/
├── app.py              ← Servidor Flask + lógica IA
├── requirements.txt    ← Dependencias
└── templates/
    └── index.html      ← Interfaz del chat
```

## Instalación y uso

### 1. Instala las dependencias
```bash
pip install -r requirements.txt
```

### 2. Agrega tu API Key de Anthropic
Edita `app.py` y reemplaza:
```python
API_KEY = "TU_API_KEY_AQUI"
```
O usa una variable de entorno (recomendado):
```bash
# Mac/Linux
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows
set ANTHROPIC_API_KEY=sk-ant-...
```
Obtén tu key en: https://console.anthropic.com

### 3. Ejecuta el servidor
```bash
python app.py
```

### 4. Abre el navegador
Visita: http://localhost:5000

## Personalización

### Cambiar el comportamiento del bot
En `app.py`, edita `SYSTEM_PROMPT`:
```python
SYSTEM_PROMPT = """Eres un asistente de soporte técnico de una empresa 
de software. Solo respondes preguntas sobre el producto. Sé formal."""
```

### Cambiar el modelo
```python
model="claude-haiku-4-5-20251001"   # Más rápido y económico
model="claude-sonnet-4-6"           # Balance (por defecto)
model="claude-opus-4-6"             # Más potente
```
