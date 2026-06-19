


const chat    = document.getElementById('chat');
const input   = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');

// ─── Menú de categorías ───────────────────────────────────────────────
const MENU = {
  inicio: {
    texto: "¡Bienvenido! 👋🏻 Seleccione una opción a continuación para comenzar:",
    label: "Seleccione 1 categoría:",
    opciones: [
      { texto: "Aplicaciones Informáticas (STD - SIIT - RR.HH)", id: "apps" },
      { texto: "Renovación del Certificado Digital", id: "cert" },
      { texto: "Impresora", id: "impresora" },
      { texto: "Red / Internet", id: "red" },
    ]
  },
  apps: {
    texto: "Inconveniente con el inicio de sesión:\nEnvíe su requerimiento por el link del Proactivanet:\nhttps://proactivanet.sunafil.gob.pe/",
    opciones: null
  },
  cert: {
    texto: "Envíe su requerimiento por el link del Proactivanet:\nhttps://proactivanet.sunafil.gob.pe/",
    opciones: null
  },
  impresora: {
    texto: "Seleccione el tipo de problema con la impresora:",
    label: "Seleccione una opción:",
    opciones: [
      { texto: "Atasco de Papel", id: "atasco" },
      { texto: "No enciende", id: "noenciende" },
      { texto: "Impresión no legible", id: "nolegible" },
    ]
  },
  atasco: {
    texto: "Para un atasco de papel:\n1. Apague la impresora.\n2. Retire el papel con cuidado sin rasgarlo.\n3. Revise que no queden trozos dentro.\n4. Vuelva a encender.\n\n¿Necesita más ayuda? Contacte a soporte.",
    opciones: null
  },
  noenciende: {
    texto: "Si la impresora no enciende:\n1. Verifique el cable de alimentación.\n2. Pruebe en otro tomacorriente.\n3. Si persiste, cree un ticket en:\nhttps://proactivanet.sunafil.gob.pe/",
    opciones: null
  },
  nolegible: {
    texto: "Para impresión no legible:\n1. Limpie los cabezales desde el panel de la impresora.\n2. Verifique el nivel de tinta/tóner.\n3. Si persiste, envíe un ticket en:\nhttps://proactivanet.sunafil.gob.pe/",
    opciones: null
  },
  red: {
    texto: "Para problemas de red o internet:\n1. Reinicie el router.\n2. Verifique el cable de red.\n3. Si el problema persiste, cree un ticket en:\nhttps://proactivanet.sunafil.gob.pe/",
    opciones: null
  },
  otro: {
    texto: "Describa su problema en el chat o cree un ticket de soporte en:\nhttps://proactivanet.sunafil.gob.pe/\n\nTambién puede escribirme directamente y le ayudaré.",
    opciones: null
  }
};

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensaje(); }
}

function linkify(texto) {
  return texto
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');
}

function agregarMsg(texto, tipo) {
  const isBot = tipo === 'bot';
  const div = document.createElement('div');
  div.className = `msg ${tipo}`;
  div.innerHTML = `
    <div class="msg-avatar">${isBot ? '👷' : 'TÚ'}</div>
    <div class="msg-bubble">${linkify(texto)}</div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function mostrarMenu(nodo) {
  const data = MENU[nodo];
  if (!data) return;
  agregarMsg(data.texto, 'bot');
  if (data.opciones) {
    const group = document.createElement('div');
    group.className = 'btn-group' + (data.opciones.length <= 3 ? ' inline' : '');
    if (data.label) {
      const lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:13px;color:#6b7280;margin-bottom:2px;';
      lbl.textContent = data.label;
      chat.appendChild(lbl);
    }
    data.opciones.forEach(op => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn' + (data.opciones.length <= 3 ? ' secondary' : '');
      btn.textContent = op.texto;
      btn.onclick = () => {
        agregarMsg(op.texto, 'user');
        setTimeout(() => mostrarMenu(op.id), 400);
        // Desactiva todos los botones del grupo
        group.querySelectorAll('button').forEach(b => b.disabled = true);
      };
      group.appendChild(btn);
    });
    chat.appendChild(group);
    chat.scrollTop = chat.scrollHeight;

    // Botón volver al inicio
    setTimeout(() => {
      const volver = document.createElement('button');
      volver.className = 'cat-btn secondary';
      volver.style.cssText = 'margin-left:38px;margin-top:4px;width:fit-content;font-size:12px;';
      volver.textContent = '🏠 Menú principal';
      volver.onclick = () => { agregarMsg('Menú principal', 'user'); setTimeout(()=>mostrarMenu('inicio'),300); volver.remove(); };
      chat.appendChild(volver);
      chat.scrollTop = chat.scrollHeight;
    }, 200);
  } else {
    // Sin subcategorías — mostrar botón para volver
    setTimeout(() => {
      const volver = document.createElement('button');
      volver.className = 'cat-btn secondary';
      volver.style.cssText = 'margin-left:38px;margin-top:4px;width:fit-content;font-size:12px;';
      volver.textContent = '🏠 Menú principal';
      volver.onclick = () => { agregarMsg('Menú principal', 'user'); setTimeout(()=>mostrarMenu('inicio'),300); volver.remove(); };
      chat.appendChild(volver);
      chat.scrollTop = chat.scrollHeight;
    }, 200);
  }
}

function mostrarTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot'; div.id = 'typing';
  div.innerHTML = `<div class="msg-avatar">👷</div><div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function enviarMensaje() {
  const texto = input.value.trim();
  if (!texto || sendBtn.disabled) return;
  agregarMsg(texto, 'user');
  input.value = ''; input.style.height = 'auto';
  sendBtn.disabled = true;
  mostrarTyping();
  try {
    const res  = await fetch('/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({mensaje: texto}) });
    const data = await res.json();
    document.getElementById('typing')?.remove();
    agregarMsg(data.error ? '⚠️ ' + data.error : data.respuesta, 'bot');
  } catch {
    document.getElementById('typing')?.remove();
    agregarMsg('⚠️ No se pudo conectar con el servidor.', 'bot');
  }
  sendBtn.disabled = false;
  input.focus();
}

async function reiniciar() {
  await fetch('/limpiar', { method:'POST' });
  chat.innerHTML = '';
  mostrarMenu('inicio');
}

// Arranque
mostrarMenu('inicio');
