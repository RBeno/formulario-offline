/* eslint-env browser */
// Configuración y catálogos
const STORAGE_KEY = "agv_incidencias_v1";
const CURRENT_SCHEMA_VERSION = 2;
const SCHEMA_VERSION = CURRENT_SCHEMA_VERSION;
const TAB_NUEVA = "nueva";

const CIRCUITOS = ["MO3", "MO1", "Portadores"];

const AGVS_POR_CIRCUITO = {
  MO3: ["17", "31", "32", "34", "35", "36", "37", "44", "47", "48", "49", "50", "51", "52", "73", "74", "90", "91", "150", "306", "381", "2161", "2163", "2165", "2166", "2168", "2169", "2314", "2317", "2319"],
  MO1: ["2174", "2176", "2179", "2180", "2190", "2191", "2192", "2193", "2194", "2195", "2196", "2197", "2198", "2199", "2200", "2201", "2202", "2206", "2207", "2208", "2209", "2210", "2211", "2212", "2216", "2217", "2218", "2219", "2220", "2224", "2225", "2226", "2227", "2228", "2229", "2230", "2231", "2232", "2233", "2234", "2243", "2244", "2245", "2246", "2247", "2248", "2249", "2250", "2251"],
  Portadores: ["33", "53", "66", "2162", "2164", "2167", "2170", "2171", "2172", "2173", "2175", "2177"]
};

const FALLOS = {
  parado: {
    label: "Parado",
    detalles: [
      { value: "via_web", label: "Vía web" },
      { value: "parada_precisa_tag", label: "Parada precisa en tag" },
      { value: "sin_wifi", label: "Sin wifi" },
      { value: "sistema_seguridad", label: "Sistema de seguridad" },
      { value: "mapa_incorrecto", label: "Mapa incorrecto" },
      { value: "fallo_motor", label: "Fallo motor" },
      { value: "error_centralita", label: "Error de centralita" },
      { value: "gira_no_avanza", label: "Gira pero no avanza" },
      { value: "parada_manual", label: "Parada manual" },
      { value: "parada_seta", label: "Parada seta" },
      { value: "velocidad_restaurada", label: "Velocidad restaurada" },
      { value: "no_avanza", label: "No avanza" },
      { value: "otro", label: "Otro" }
    ]
  },
  fuera_de_guia: {
    label: "Fuera de guía",
    detalles: [
      { value: "obstaculo", label: "Obstáculo" },
      { value: "junta_dilatacion", label: "Junta de dilatación" },
      { value: "guia_deteriorada", label: "Guía deteriorada" },
      { value: "direccion_bloqueada", label: "Dirección bloqueada" },
      { value: "golpe", label: "Golpe" },
      { value: "otro", label: "Otro" }
    ]
  },
  se_salta_parada: {
    label: "Se salta parada",
    detalles: [
      { value: "error_centralita", label: "Error de centralita" },
      { value: "no_lee_tag", label: "No lee tag" },
      { value: "no_ejecuta_tag", label: "No ejecuta tag" },
      { value: "otro", label: "Otro" }
    ]
  },
  bateria: {
    label: "Batería",
    detalles: [
      { value: "descargada", label: "Descargada" },
      { value: "no_entra_carga_online", label: "No entra en carga online" },
      { value: "no_baja_pines_carga", label: "No baja pines de carga" },
      { value: "fallo_sistema_carga", label: "Fallo sistema de carga" },
      { value: "otro", label: "Otro" }
    ]
  },
  apagado: {
    label: "Apagado",
    detalles: [
      { value: "mala_conexion_bateria", label: "Mala conexión de batería" },
      { value: "bateria_suelta", label: "Batería suelta" },
      { value: "apagado_manual", label: "Apagado manual" },
      { value: "fallo_interno", label: "Fallo interno" },
      { value: "otro", label: "Otro" }
    ]
  },
  muy_despacio: {
    label: "Muy despacio",
    detalles: [
      { value: "reduccion_seguridad", label: "Red vel por escáner" },
      { value: "no_lee_tags", label: "No lee tags" },
      { value: "mapa_incorrecto", label: "Mapa incorrecto" },
      { value: "fallo_interno", label: "Fallo interno" },
      { value: "otro", label: "Otro" }
    ]
  },
  agv: {
    label: "AGV",
    detalles: [
      { value: "rueda", label: "Rueda" },
      { value: "carroceria", label: "Carrocería" },
      { value: "antena", label: "Antena" },
      { value: "pin_suelto", label: "Pin suelto" },
      { value: "otro", label: "Otro" }
    ]
  },
  seguidos: {
    label: "Seguidos",
    detalles: [{ value: "otro", label: "Otro" }]
  },
  sin_carro: {
    label: "Sin carro",
    detalles: [
      { value: "de_gmp", label: "De GMP" },
      { value: "baja_pin_de_carro", label: "Baja pin de carro" },
      { value: "otro", label: "Otro" }
    ]
  },
  sick: {
    label: "Sick",
    detalles: [
      { value: "u1", label: "U1" },
      { value: "n5", label: "N5" },
      { value: "e1", label: "E1" },
      { value: "iniciando", label: "Iniciando" },
      { value: "otro", label: "Otro" }
    ]
  }
};

const CSV_COLUMNS = [
  "id",
  "created_at",
  "schema_version",
  "circuito",
  "agv",
  "bateria_valor",
  "es_gmp",
  "incidente_fecha",
  "incidente_hora",
  "fallo_tipo",
  "fallo_detalle",
  "estado_carga",
  "minutos_incidente",
  "requiere_taller",
  "posicion_codigo",
  "observaciones"
];

/**
 * @typedef {Object} IncidenciaAGV
 * @property {string} id
 * @property {string} created_at
 * @property {string} circuito
 * @property {string} agv
 * @property {string} incidente_fecha
 * @property {string} incidente_hora
 * @property {string} fallo_tipo
 * @property {string} fallo_detalle
 * @property {string} bateria_valor
 * @property {number} es_gmp
 * @property {number} estado_carga
 * @property {number} minutos_incidente
 * @property {number} requiere_taller
 * @property {string} posicion_codigo
 * @property {string} observaciones
 * @property {number} schema_version
 */

// Utilidades de almacenamiento (localStorage)

let storageDisponibleFlag = true;

function storageDisponible() {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn("localStorage no disponible", error);
    return false;
  }
}

/**
 * Lee incidencias crudas desde localStorage sin migrar.
 * @returns {any[]} Lista cruda
 */
function cargarIncidenciasCrudas() {
  if (!storageDisponibleFlag && !storageDisponible()) {
    storageDisponibleFlag = false;
    mostrarMensajeError("El almacenamiento local no está disponible en este navegador.");
    return [];
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error parseando incidencias de localStorage", error);
    return [];
  }
}

/**
 * Guarda incidencias en localStorage.
 * @param {IncidenciaAGV[]} lista
 */
function guardarIncidencias(lista) {
  if (!storageDisponibleFlag && !storageDisponible()) {
    storageDisponibleFlag = false;
    mostrarMensajeError("No se pudieron guardar las incidencias: almacenamiento local no disponible.");
    return;
  }
  try {
    const safeList = Array.isArray(lista) ? lista : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeList));
  } catch (error) {
    console.error("No se pudieron guardar las incidencias", error);
  }
}

function generarIdIncidencia() {
  const now = Date.now();
  if (typeof self !== "undefined" && self.crypto && self.crypto.randomUUID) {
    return self.crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `inc-${now}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Normaliza incidencias antiguas al modelo actual sin perder datos.
 * @param {any[]} lista
 * @returns {IncidenciaAGV[]}
 */
function migrarIncidenciasAntiguas(lista) {
  if (!Array.isArray(lista)) return [];

  return lista.map((inc) => {
    const copia = { ...inc };

    const agvNormalizado = (() => {
      if (copia.agv !== undefined && copia.agv !== null) return String(copia.agv).trim();
      if (copia.agv_id !== undefined && copia.agv_id !== null) return String(copia.agv_id).trim();
      return "";
    })();

    const estadoCarga = (() => {
      const valor = copia.estado_carga;
      if (valor === 1 || valor === "1" || valor === true || valor === "true") return 1;
      return 0;
    })();

    const requiereTaller = (() => {
      const valor = copia.requiere_taller;
      if (valor === 1 || valor === "1" || valor === true || valor === "true") return 1;
      return 0;
    })();

    const minutosIncidente = (() => {
      const base = copia.minutos_incidente ?? copia.minutos_parada ?? 0;
      const n = Number(base);
      if (!Number.isFinite(n) || n < 0) return 0;
      return Math.min(Math.round(n), 9999);
    })();

    const esGmp = (() => {
      if (typeof copia.es_gmp === "number") return copia.es_gmp;
      if (typeof copia.bateria_no_gmp === "boolean") return copia.bateria_no_gmp ? 0 : 1;
      if (copia.bateria_no_gmp === 1 || copia.bateria_no_gmp === "1") return 0;
      return 1; // Por defecto consideramos que es de GMP
    })();

    const bateriaValor = (() => {
      if (copia.bateria_valor === undefined || copia.bateria_valor === null) return "";
      return String(copia.bateria_valor).trim();
    })();

    const posicionCodigo = (copia.posicion_codigo || copia.posicion_nota || copia.posicion || "").toString().trim();
    const observaciones = (copia.observaciones || "").toString().trim();

    const fechaIncidente = (copia.incidente_fecha || "").toString().trim();
    const horaIncidente = (copia.incidente_hora || "").toString().trim();

    const createdAt = (() => {
      if (copia.created_at) return copia.created_at;
      if (fechaIncidente && horaIncidente) return `${fechaIncidente}T${horaIncidente}:00`;
      return new Date().toISOString();
    })();

    return {
      id: copia.id || generarIdIncidencia(),
      schema_version: CURRENT_SCHEMA_VERSION,
      created_at: createdAt,
      circuito: (copia.circuito || "").toString().trim(),
      agv: agvNormalizado,
      bateria_valor: bateriaValor,
      es_gmp: esGmp,
      incidente_fecha: fechaIncidente,
      incidente_hora: horaIncidente,
      fallo_tipo: (copia.fallo_tipo || "").toString().trim(),
      fallo_detalle: (copia.fallo_detalle || "").toString().trim(),
      estado_carga: estadoCarga,
      minutos_incidente: minutosIncidente,
      requiere_taller: requiereTaller,
      posicion_codigo: posicionCodigo,
      observaciones
    };
  });
}

/**
 * Lee incidencias migradas desde localStorage.
 * @returns {IncidenciaAGV[]} Lista migrada
 */
function cargarIncidencias() {
  if (!storageDisponibleFlag && !storageDisponible()) {
    storageDisponibleFlag = false;
    mostrarMensajeError("El almacenamiento local no está disponible en este navegador.");
    return [];
  }

  const crudas = cargarIncidenciasCrudas();
  const migradas = migrarIncidenciasAntiguas(crudas);
  guardarIncidencias(migradas);
  return migradas;
}

// Utilidades de fechas/formatos

const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Devuelve la fecha en formato YYYY-MM-DD para inputs de fecha.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
function formateaFechaInput(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/**
 * Devuelve la hora en formato HH:MM para inputs de hora.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
function formateaHoraInput(date = new Date()) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/**
 * Devuelve la fecha actual en formato YYYY-MM-DD.
 * @returns {string}
 */
function hoyInput() {
  return formateaFechaInput(new Date());
}

/**
 * Establece por defecto fecha y hora del incidente al momento actual.
 * @param {Date} [date=new Date()]
 */
function setDefaultsIncidenteAhora(date = new Date()) {
  const fechaIncidente = $("#incidente_fecha");
  const horaIncidente = $("#incidente_hora");

  if (fechaIncidente) fechaIncidente.value = formateaFechaInput(date);
  if (horaIncidente) horaIncidente.value = formateaHoraInput(date);
}

// Lógica de catálogo

/**
 * @returns {{ value: string, label: string }[]}
 */
function getFallosTipoOptions() {
  return Object.entries(FALLOS).map(([value, data]) => ({
    value,
    label: data.label
  }));
}

/**
 * @param {string} tipo
 * @returns {{ value: string, label: string }[]}
 */
function getFalloDetalleOptions(tipo) {
  if (!tipo || !FALLOS[tipo]) return [];
  return FALLOS[tipo].detalles.slice();
}

/**
 * @returns {string[]}
 */
function getCircuitoOptions() {
  return CIRCUITOS.slice();
}

/**
 * @param {string} circuito
 * @returns {(string|number)[]}
 */
function getAgvOptions(circuito) {
  if (!circuito || !AGVS_POR_CIRCUITO[circuito]) return [];
  return AGVS_POR_CIRCUITO[circuito].map(String);
}

const isAgvValido = (circuito, agvValor) => {
  const agvList = getAgvOptions(circuito);
  if (!agvList.length) return true;
  return agvList.map(String).includes(String(agvValor));
};

// Estado de carga (checkboxes exclusivos)
function initEstadoCarro() {
  const estadoVacio = $("#estado_vacio");
  const estadoLleno = $("#estado_lleno");

  if (!estadoVacio || !estadoLleno) return;

  const asegurarVacioCuandoAmbosDesmarcados = () => {
    if (!estadoVacio.checked && !estadoLleno.checked) {
      estadoVacio.checked = true;
    }
  };

  estadoVacio.addEventListener("change", () => {
    if (estadoVacio.checked) {
      estadoLleno.checked = false;
    } else {
      asegurarVacioCuandoAmbosDesmarcados();
    }
  });

  estadoLleno.addEventListener("change", () => {
    if (estadoLleno.checked) {
      estadoVacio.checked = false;
    } else {
      asegurarVacioCuandoAmbosDesmarcados();
    }
  });

  estadoVacio.checked = true;
  estadoLleno.checked = false;
}

// Alias para compatibilidad
function initEstadoCargaCheckboxes() {
  initEstadoCarro();
}

// Lógica de formulario (lectura, validación, creación de objeto)

const fieldErrors = {};

function limpiarMensajes() {
  const contenedor = document.getElementById("app_messages");
  if (contenedor) contenedor.innerHTML = "";
}

function renderMensaje(tipo, texto) {
  const contenedor = document.getElementById("app_messages");
  if (!contenedor) {
    console.warn("Contenedor de mensajes (#app_messages) no encontrado");
    return;
  }
  contenedor.innerHTML = "";
  const mensaje = document.createElement("div");
  mensaje.className = `app-message app-message--${tipo}`;
  mensaje.textContent = texto;
  contenedor.appendChild(mensaje);
}

function mostrarMensajeExito(texto) {
  renderMensaje("success", texto);
}

function mostrarMensajeError(texto) {
  renderMensaje("error", texto);
}

/**
 * Actualiza el indicador de estado de conexión en el header.
 * @param {"local"|"remote"} modo
 * @param {boolean} online
 */
function actualizarEstadoConexion(modo, online) {
  const contenedor = document.getElementById("connection_status");
  if (!contenedor) return;

  const dot = contenedor.querySelector(".status-dot");
  const text = contenedor.querySelector(".status-text");

  if (dot) {
    dot.classList.remove("status-dot--online", "status-dot--offline");
    dot.classList.add(online ? "status-dot--online" : "status-dot--offline");
  }

  if (text) {
    if (modo === "remote") {
      text.textContent = online ? "Remoto (con servidor)" : "Remoto (sin servidor)";
    } else {
      text.textContent = online ? "Local (online)" : "Local (sin conexión)";
    }
  }
}

function initEstadoConexionUI() {
  actualizarEstadoConexion("local", navigator.onLine);
  window.addEventListener("online", () => actualizarEstadoConexion("local", true));
  window.addEventListener("offline", () => actualizarEstadoConexion("local", false));
}

function limpiarErroresCampos() {
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]);
  document.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
}

function marcarErrorCampo(idCampo, mensaje) {
  if (!mensaje) return;
  fieldErrors[idCampo] = mensaje;
  const input = document.getElementById(idCampo);
  if (input) input.classList.add("input-error");
  const errorEl = document.querySelector(`.field-error[data-error-for="${idCampo}"]`);
  if (errorEl) errorEl.textContent = mensaje;
}

function existeIncidenciaDuplicada(lista, nueva) {
  return lista.some(
    (inc) =>
      inc.circuito === nueva.circuito &&
      inc.agv === nueva.agv &&
      inc.incidente_fecha === nueva.incidente_fecha &&
      inc.incidente_hora === nueva.incidente_hora &&
      inc.fallo_tipo === nueva.fallo_tipo &&
      inc.fallo_detalle === nueva.fallo_detalle
  );
}

/**
 * Crea un objeto de incidencia con la estructura base unificada.
 * @param {Partial<IncidenciaAGV>} [formValues={}]
 * @returns {IncidenciaAGV}
 */
function crearIncidenciaBase(formValues = {}) {
  const nowIso = new Date().toISOString();
  const generatedId = generarIdIncidencia();

  const estadoCarga = formValues.estado_carga === 1 || formValues.estado_carga === "1" || formValues.estado_carga === true ? 1 : 0;
  const requiereTaller = formValues.requiere_taller === 1 || formValues.requiere_taller === "1" || formValues.requiere_taller === true ? 1 : 0;
  const minutosIncidente = (() => {
    const n = Number(formValues.minutos_incidente);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(Math.round(n), 9999);
  })();
  const esGmp = (() => {
    if (formValues.es_gmp === 0 || formValues.es_gmp === "0") return 0;
    if (formValues.es_gmp === 1 || formValues.es_gmp === "1") return 1;
    if (formValues.es_gmp === false) return 0;
    if (formValues.es_gmp === true) return 1;
    return 1; // Por defecto se considera que es de GMP
  })();

  return {
    id: formValues.id || generatedId,
    schema_version: formValues.schema_version || CURRENT_SCHEMA_VERSION,
    created_at: formValues.created_at || nowIso,
    circuito: (formValues.circuito || "").toString().trim(),
    agv: formValues.agv !== undefined && formValues.agv !== null ? String(formValues.agv).trim() : "",
    bateria_valor: formValues.bateria_valor !== undefined && formValues.bateria_valor !== null ? String(formValues.bateria_valor).trim() : "",
    es_gmp: esGmp,
    incidente_fecha: (formValues.incidente_fecha || "").toString().trim(),
    incidente_hora: (formValues.incidente_hora || "").toString().trim(),
    fallo_tipo: (formValues.fallo_tipo || "").toString().trim(),
    fallo_detalle: (formValues.fallo_detalle || "").toString().trim(),
    estado_carga: estadoCarga,
    minutos_incidente: minutosIncidente,
    requiere_taller: requiereTaller,
    posicion_codigo: (formValues.posicion_codigo || "").toString().trim(),
    observaciones: (formValues.observaciones || "").toString().trim()
  };
}

/**
 * Devuelve un elemento por id.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
function $(id) {
  return document.getElementById(id);
}

/**
 * Valida los campos obligatorios del formulario.
 * @returns {{ esValido: boolean, camposInvalidos: string[], valores: { circuito: string, agv: string, fechaIncidente: string, horaIncidente: string, tipoFallo: string, detalleFallo: string } }}
 */
function validarCamposObligatorios() {
  const circuitoEl = document.getElementById("circuito");
  const agvEl = document.getElementById("agv");
  const fechaEl = document.getElementById("incidente_fecha");
  const horaEl = document.getElementById("incidente_hora");
  const tipoFalloEl = document.getElementById("fallo_tipo");
  const detalleFalloEl = document.getElementById("fallo_detalle");

  const circuito = circuitoEl?.value?.trim() || "";
  const agv = agvEl?.value?.trim() || "";
  const fechaIncidente = fechaEl?.value?.trim() || "";
  const horaIncidente = horaEl?.value?.trim() || "";
  const tipoFallo = tipoFalloEl?.value?.trim() || "";
  const detalleFallo = detalleFalloEl?.value?.trim() || "";

  const camposInvalidos = [];

  if (!circuito) camposInvalidos.push("circuito");
  if (!agv) camposInvalidos.push("agv");
  if (!fechaIncidente) camposInvalidos.push("fecha de incidente");
  if (!horaIncidente) camposInvalidos.push("hora de incidente");
  if (!tipoFallo) camposInvalidos.push("tipo de fallo");
  if (!detalleFallo) camposInvalidos.push("detalle de fallo");

  if (circuito && agv) {
    const listaAgvs = (AGVS_POR_CIRCUITO[circuito] || []).map(String);
    if (listaAgvs.length && !listaAgvs.includes(String(agv))) {
      camposInvalidos.push("agv");
    }
  }

  return {
    esValido: camposInvalidos.length === 0,
    camposInvalidos,
    valores: {
      circuito,
      agv,
      fechaIncidente,
      horaIncidente,
      tipoFallo,
      detalleFallo
    }
  };
}

/**
 * Marca visualmente los campos con error.
 * @param {string[]} camposInvalidos
 */
function marcarErroresCampos(camposInvalidos) {
  limpiarErroresCampos();
  const idPorCampo = {
    circuito: "circuito",
    agv: "agv",
    "fecha de incidente": "incidente_fecha",
    "hora de incidente": "incidente_hora",
    "tipo de fallo": "fallo_tipo",
    "detalle de fallo": "fallo_detalle"
  };

  camposInvalidos.forEach((campo) => {
    const idCampo = idPorCampo[campo] || campo;
    const mensaje = campo === "agv" ? "Selecciona un AGV válido para el circuito" : "Obligatorio";
    marcarErrorCampo(idCampo, mensaje);
  });
}

/**
 * Lee el formulario y devuelve una incidencia lista para almacenar.
 * Devuelve null si no es válida.
 * @returns {IncidenciaAGV|null}
 */
function crearIncidenciaDesdeFormulario(valoresObligatorios) {
  if (!valoresObligatorios) {
    limpiarErroresCampos();
    limpiarMensajes();
  }

  const validacion = valoresObligatorios
    ? { esValido: true, camposInvalidos: [], valores: valoresObligatorios }
    : validarCamposObligatorios();

  if (!validacion.esValido) {
    marcarErroresCampos(validacion.camposInvalidos);
    mostrarMensajeError(`Revisa los campos: ${validacion.camposInvalidos.join(", ")}`);
    return null;
  }

  const { circuito, agv, fechaIncidente, horaIncidente, tipoFallo, detalleFallo } = validacion.valores;
  const estadoVacio = Boolean($("#estado_vacio")?.checked);
  const estadoLleno = Boolean($("#estado_lleno")?.checked);
  const estadoCarga = estadoLleno ? 1 : 0;
  const requiereTaller = ($("#requiere_taller")?.checked ? 1 : 0);
  const minutosInput = document.getElementById("minutos_parada");
  let minutosIncidente = 0;
  if (minutosInput && minutosInput.value !== "") {
    const n = Number(minutosInput.value);
    if (!Number.isNaN(n) && n >= 0) {
      minutosIncidente = Math.min(Math.round(n), 9999);
    }
  }
  const posicionCodigo = ($("#posicion_codigo")?.value || "").trim();
  const observaciones = ($("#observaciones")?.value || "").trim();
  const bateriaValorInput = document.getElementById("bateria_valor");
  const bateriaValorParsed = bateriaValorInput ? bateriaValorInput.value : "";
  const bateriaValor = bateriaValorParsed === null || bateriaValorParsed === undefined ? "" : String(bateriaValorParsed).trim();
  // Convención: es_gmp = 1 si NO está marcado "No es de GMP"; es_gmp = 0 si está marcado.
  const esGmp = document.getElementById("bateria_no_gmp")?.checked ? 0 : 1;

  const payload = crearIncidenciaBase({
    circuito,
    agv,
    incidente_fecha: fechaIncidente,
    incidente_hora: horaIncidente,
    fallo_tipo: tipoFallo,
    fallo_detalle: detalleFallo,
    estado_carga: estadoCarga,
    bateria_valor: bateriaValor,
    es_gmp: esGmp,
    requiere_taller: requiereTaller,
    minutos_incidente: minutosIncidente,
    posicion_codigo: posicionCodigo,
    observaciones
  });

  return payload;
}

// Lógica de UI/tabla

/**
 * Rellena el select de AGV según el circuito seleccionado.
 * @param {string|HTMLSelectElement} [circuitoSeleccionado]
 */
function actualizarAGVSegunCircuito(circuitoSeleccionado) {
  const agvSelect = document.getElementById("agv");
  if (!agvSelect) {
    console.warn("Select AGV no encontrado");
    return;
  }

  const circuito = typeof circuitoSeleccionado === "string" ? circuitoSeleccionado : document.getElementById("circuito")?.value;
  agvSelect.innerHTML = "";

  if (!circuito) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Selecciona un circuito primero";
    agvSelect.appendChild(opt);
    agvSelect.disabled = true;
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecciona un AGV...";
  agvSelect.appendChild(placeholder);

  const lista = getAgvOptions(circuito);
  lista.forEach((id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = id;
    agvSelect.appendChild(opt);
  });

  agvSelect.disabled = false;
}

/**
 * Rellena el select de detalle según el tipo de fallo.
 * @param {string|HTMLSelectElement} [tipoSeleccionado]
 */
function actualizarDetalleSegunTipoFallo(tipoSeleccionado) {
  const detalleSelect = document.getElementById("fallo_detalle");
  if (!detalleSelect) {
    console.warn("Select detalle de fallo no encontrado");
    return;
  }

  detalleSelect.innerHTML = "";

  const tipo = typeof tipoSeleccionado === "string" ? tipoSeleccionado : document.getElementById("fallo_tipo")?.value;

  if (!tipo) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Selecciona primero un tipo de fallo";
    detalleSelect.appendChild(opt);
    detalleSelect.disabled = true;
    return;
  }

  const config = FALLOS[tipo];
  if (!config || !Array.isArray(config.detalles)) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Tipo de fallo desconocido";
    detalleSelect.appendChild(opt);
    detalleSelect.disabled = true;
    console.warn("Tipo de fallo sin configuración en FALLOS:", tipo);
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecciona un detalle...";
  detalleSelect.appendChild(placeholder);

  config.detalles.forEach((det) => {
    const opt = document.createElement("option");
    opt.value = det.value;
    opt.textContent = det.label;
    detalleSelect.appendChild(opt);
  });

  detalleSelect.disabled = false;
}

/**
 * Actualiza los elementos de resumen (total y última incidencia).
 */
function actualizarResumenIncidencias() {
  const totalEl = document.getElementById("status_total_incidencias");
  const ultimaEl = document.getElementById("status_ultima_incidencia");
  const incidencias = cargarIncidencias();

  if (totalEl) totalEl.textContent = incidencias.length.toString();

  if (ultimaEl) {
    if (!incidencias.length) {
      ultimaEl.textContent = "-";
    } else {
      const ultima = incidencias[incidencias.length - 1];
      const fechaHora = ultima.incidente_fecha && ultima.incidente_hora
        ? `${ultima.incidente_fecha} ${ultima.incidente_hora}`
        : ultima.incidente_fecha || ultima.created_at || "";
      ultimaEl.textContent = `${fechaHora} · ${ultima.circuito || ""} ${ultima.agv || ""} · ${ultima.fallo_tipo || ""}`.trim();
    }
  }
}

/**
 * Rellena un select con opciones y placeholder.
 * @param {HTMLSelectElement} selectEl
 * @param {Array} options
 * @param {string} [placeholderText]
 */
function renderSelectOptions(selectEl, options, placeholderText) {
  if (!selectEl) return;

  const placeholder = placeholderText ?? selectEl.querySelector('option[value=""]')?.textContent ?? "";
  selectEl.innerHTML = "";

  if (placeholder) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    selectEl.appendChild(option);
  }

  options.forEach((opt) => {
    const option = document.createElement("option");
    if (typeof opt === "string" || typeof opt === "number") {
      option.value = String(opt);
      option.textContent = String(opt);
    } else {
      option.value = opt.value;
      option.textContent = opt.label || opt.value;
    }
    selectEl.appendChild(option);
  });
}

/**
 * Refresca la tabla según la pestaña activa y filtros.
 */
function refrescarTablaSegunTab() {
  const tabHistorico = document.getElementById("tab_historico");
  const historicoVisible = tabHistorico ? !tabHistorico.classList.contains("tab-content--hidden") : false;
  if (historicoVisible && historicoInicializado) {
    aplicarFiltroHistorico();
  } else {
    const todas = cargarIncidencias();
    ultimoHistoricoFiltrado = todas;
    renderTablaIncidencias(todas);
  }
}

function initAGV() {
  const circuitoSelect = document.getElementById("circuito");
  const agvSelect = document.getElementById("agv");

  if (!circuitoSelect || !agvSelect) {
    console.warn("Circuito o AGV no encontrados en el DOM");
    return;
  }

  const setPlaceholderCircuito = () => {
    agvSelect.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Selecciona un circuito primero";
    agvSelect.appendChild(opt);
    agvSelect.disabled = true;
  };

  setPlaceholderCircuito();

  circuitoSelect.addEventListener("change", () => {
    const circuito = circuitoSelect.value;
    if (!circuito) {
      setPlaceholderCircuito();
      return;
    }
    actualizarAGVSegunCircuito(circuito);
  });

  if (circuitoSelect.value) {
    actualizarAGVSegunCircuito(circuitoSelect.value);
  }
}

function initFalloDetalle() {
  const tipoSelect = document.getElementById("fallo_tipo");
  const detalleSelect = document.getElementById("fallo_detalle");

  if (!tipoSelect || !detalleSelect) {
    console.warn("Tipo o detalle de fallo no encontrados en el DOM");
    return;
  }

  detalleSelect.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = "Selecciona primero un tipo de fallo";
  detalleSelect.appendChild(opt);
  detalleSelect.disabled = true;

  tipoSelect.addEventListener("change", () => {
    actualizarDetalleSegunTipoFallo(tipoSelect.value);
  });

  if (tipoSelect.value) {
    actualizarDetalleSegunTipoFallo(tipoSelect.value);
  }
}

/**
 * Mantiene compatibilidad con llamadas previas.
 * @param {HTMLSelectElement} circuitoSelect
 * @param {HTMLSelectElement} agvSelect
 */
function actualizarAgvSelect(circuitoSelect, agvSelect) {
  actualizarAGVSegunCircuito(circuitoSelect?.value);
}

/**
 * Mantiene compatibilidad con llamadas previas.
 * @param {HTMLSelectElement} falloTipoSelect
 * @param {HTMLSelectElement} falloDetalleSelect
 */
function actualizarFalloDetalleSelect(falloTipoSelect, falloDetalleSelect) {
  actualizarDetalleSegunTipoFallo(falloTipoSelect?.value);
}

/**
 * Pinta la tabla de incidencias en el DOM.
 * @param {IncidenciaAGV[]} [lista]
 */
function renderTablaIncidencias(lista) {
  const tbody = document.getElementById("historial_tbody") || document.querySelector("#tabla_incidencias tbody");
  if (!tbody) {
    console.warn("No se encontró el tbody de la tabla de incidencias");
    return;
  }

  const incidencias = Array.isArray(lista) ? lista : cargarIncidencias();
  tbody.innerHTML = "";

  if (!incidencias.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 10;
    cell.textContent = "No hay incidencias para la fecha seleccionada.";
    cell.classList.add("historial-vacio");
    row.appendChild(cell);
    tbody.appendChild(row);
    actualizarResumenIncidencias();
    return;
  }

  incidencias.forEach((inc) => {
    const row = document.createElement("tr");
    if (inc.fallo_tipo) row.classList.add(`tipo-${inc.fallo_tipo}`);
    if (inc.circuito) row.classList.add(`fila-circuito-${inc.circuito}`);
    const fechaIncidente = `${inc.incidente_fecha || ""}${inc.incidente_hora ? " " + inc.incidente_hora : ""}`.trim();
    const estadoTexto = inc && (inc.estado_carga === 1 || inc.estado_carga === "1" || inc.estado_carga === true) ? "Lleno" : "Vacío";
    const tipoLabel = FALLOS[inc.fallo_tipo]?.label || inc.fallo_tipo || "-";
    const detalleLabel = (FALLOS[inc.fallo_tipo]?.detalles || []).find((d) => d.value === inc.fallo_detalle)?.label || inc.fallo_detalle || "-";
    const posicionTexto = inc.posicion_codigo || inc.posicion_nota || inc.posicion || "-";
    const incidenciaId = inc.id || "";

    const columns = [
      fechaIncidente || "-",
      inc.circuito || "-",
      inc.agv || "-",
      tipoLabel,
      detalleLabel,
      estadoTexto,
      Number.isFinite(inc.minutos_incidente) ? inc.minutos_incidente : "-",
      posicionTexto,
      inc.requiere_taller ? "Sí" : "No"
    ];

    columns.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const accionesCell = document.createElement("td");
    const btnBorrar = document.createElement("button");
    btnBorrar.type = "button";
    btnBorrar.className = "btn-borrar";
    if (incidenciaId) btnBorrar.dataset.id = incidenciaId;
    btnBorrar.setAttribute("aria-label", "Eliminar incidencia");
    btnBorrar.title = "Eliminar incidencia";
    btnBorrar.textContent = "🗑";
    if (!incidenciaId) btnBorrar.disabled = true;
    accionesCell.appendChild(btnBorrar);
    row.appendChild(accionesCell);

    tbody.appendChild(row);
  });

  actualizarResumenIncidencias();
}

// Alias para compatibilidad
function pintarTablaIncidencias(lista) {
  renderTablaIncidencias(lista);
}

function pintarHistorico(lista) {
  renderTablaIncidencias(lista);
}

/**
 * Devuelve incidencias filtradas por fecha (inclusive) y AGV.
 * @param {string} desde - YYYY-MM-DD
 * @param {string} hasta - YYYY-MM-DD
 * @param {string} agvFiltro
 * @returns {IncidenciaAGV[]}
 */
function filtrarIncidencias(desde, hasta, agvFiltro) {
  const incidencias = cargarIncidencias();
  const useDesde = Boolean(desde);
  const useHasta = Boolean(hasta);
  const agvTerm = (agvFiltro || "").trim().toLowerCase();
  const useAgv = agvTerm.length > 0;

  return incidencias.filter((inc) => {
    const fecha = inc.incidente_fecha || "";
    if (useDesde && (!fecha || fecha < desde)) return false;
    if (useHasta && (!fecha || fecha > hasta)) return false;

    if (useAgv) {
      const agvVal = (inc.agv || "").toString().toLowerCase();
      if (!agvVal.includes(agvTerm)) return false;
    }
    return true;
  });
}

/**
 * Inicializa filtros del histórico y ejecuta filtrado.
 */
let historicoInicializado = false;
let ultimoHistoricoFiltrado = [];

function aplicarFiltroHistorico() {
  const desde = ($("#filtro_fecha_desde")?.value || "").trim();
  const hasta = ($("#filtro_fecha_hasta")?.value || "").trim();
  const agvFiltro = ($("#filtro_agv")?.value || "").trim();
  const filtradas = filtrarIncidencias(desde, hasta, agvFiltro);
  ultimoHistoricoFiltrado = filtradas;
  renderTablaIncidencias(filtradas);
}

function eliminarIncidenciaPorId(id) {
  if (!id) return;
  const incidencias = cargarIncidencias();
  const index = incidencias.findIndex((inc) => inc.id === id);
  if (index === -1) {
    mostrarMensajeError("No se encontró la incidencia a eliminar.");
    return;
  }
  incidencias.splice(index, 1);
  guardarIncidencias(incidencias);
  mostrarMensajeExito("Incidencia eliminada.");
  aplicarFiltroHistorico();
}

function initHistorico() {
  const filtroDesde = $("#filtro_fecha_desde");
  const filtroHasta = $("#filtro_fecha_hasta");
  const btnFiltrar = $("#btn_filtrar_historico");
  const filtroAgv = $("#filtro_agv");
  const historialTbody = document.getElementById("historial_tbody") || document.querySelector("#tabla_incidencias tbody");

  if (filtroAgv && !filtroAgv.value) filtroAgv.value = "";

  const hoy = hoyInput();
  if (filtroDesde && !filtroDesde.value) filtroDesde.value = hoy;
  if (filtroHasta && !filtroHasta.value) filtroHasta.value = hoy;

  if (btnFiltrar) {
    btnFiltrar.addEventListener("click", (event) => {
      event.preventDefault();
      aplicarFiltroHistorico();
    });
  }

  [filtroDesde, filtroHasta, filtroAgv].forEach((input) => {
    if (input) {
      input.addEventListener("change", aplicarFiltroHistorico);
      input.addEventListener("keyup", aplicarFiltroHistorico);
      input.addEventListener("input", aplicarFiltroHistorico);
    }
  });

  if (historialTbody) {
    historialTbody.addEventListener("click", (event) => {
      const target = event.target.closest(".btn-borrar");
      if (!target) return;
      const id = target.dataset.id;
      if (!id) return;
      const ok = window.confirm("¿Seguro que quieres eliminar esta incidencia?");
      if (!ok) return;
      eliminarIncidenciaPorId(id);
    });
  }

  historicoInicializado = true;
  aplicarFiltroHistorico();
}

/**
 * Gestión de pestañas (Nueva incidencia / Histórico).
 */
function initTabs() {
  const tabButtons = document.querySelectorAll(".tabs .tab");
  const tabNueva = document.getElementById("tab_nueva_incidencia");
  const tabHistorico = document.getElementById("tab_historico");

  if (!tabButtons.length || !tabNueva || !tabHistorico) {
    console.warn("Tabs o contenidos de pestañas no encontrados");
    return;
  }

  const setActiveTab = (tabName) => {
    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle("tab--active", isActive);
    });

    const mostrarNueva = tabName === TAB_NUEVA;
    tabNueva.classList.toggle("tab-content--hidden", !mostrarNueva);
    tabHistorico.classList.toggle("tab-content--hidden", mostrarNueva);

    if (!mostrarNueva) {
      if (!historicoInicializado) initHistorico();
      else aplicarFiltroHistorico();
    } else {
      resetFormulario();
    }
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  setActiveTab(TAB_NUEVA);
}

/**
 * Obtiene la lista de incidencias a exportar.
 * @returns {IncidenciaAGV[]}
 */
function obtenerIncidenciasParaExportar() {
  return cargarIncidencias();
}

function toCsvValue(value) {
  const str = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Genera un CSV (string) desde una lista de incidencias.
 * @param {IncidenciaAGV[]} lista
 * @returns {string}
 */
function generarCSVDesdeIncidencias(lista) {
  const rows = (Array.isArray(lista) ? lista : []).map((inc) =>
    CSV_COLUMNS.map((col) => toCsvValue(inc?.[col])).join(",")
  );

  return [CSV_COLUMNS.join(","), ...rows].join("\n");
}

/**
 * Exporta las incidencias a CSV y dispara descarga.
 */
function exportarCSV() {
  const incidencias = historicoInicializado ? ultimoHistoricoFiltrado : obtenerIncidenciasParaExportar();
  if (!incidencias.length) {
    mostrarMensajeError("No hay incidencias para exportar.");
    return;
  }

  const csvContent = generarCSVDesdeIncidencias(incidencias);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "incidencias_agv.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  mostrarMensajeExito("Exportación CSV generada.");
}

function registrarEventosExportarCSV() {
  const exportBtn = document.getElementById("btn_exportar_csv");
  if (!exportBtn) {
    console.warn("Botón de exportar CSV no encontrado");
    return;
  }
  exportBtn.addEventListener("click", (event) => {
    event.preventDefault();
    exportarCSV();
  });
}

/**
 * Reinicia el formulario a un estado limpio y coherente.
 */
function resetFormulario() {
  const circuitoSelect = $("#circuito");
  const agvSelect = $("#agv");
  const fechaIncidente = $("#incidente_fecha");
  const horaIncidente = $("#incidente_hora");
  const estadoVacio = $("#estado_vacio");
  const estadoLleno = $("#estado_lleno");
  const requiereTaller = $("#requiere_taller");
  const minutosParada = $("#minutos_parada");
  const posicionCodigo = $("#posicion_codigo");
  const observaciones = $("#observaciones");
  const falloTipoSelect = $("#fallo_tipo");
  const falloDetalleSelect = $("#fallo_detalle");
  const bateriaValor = $("#bateria_valor");
  const bateriaNoGmp = $("#bateria_no_gmp");

  if (circuitoSelect) circuitoSelect.value = "";

  if (agvSelect) {
    agvSelect.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Selecciona un circuito primero";
    agvSelect.appendChild(opt);
    agvSelect.disabled = true;
  }

  setDefaultsIncidenteAhora();

  if (estadoVacio) estadoVacio.checked = true;
  if (estadoLleno) estadoLleno.checked = false;
  if (requiereTaller) requiereTaller.checked = false;
  if (minutosParada) minutosParada.value = "0";
  if (posicionCodigo) posicionCodigo.value = "";
  if (observaciones) observaciones.value = "";
  if (bateriaValor) bateriaValor.value = "";
  if (bateriaNoGmp) bateriaNoGmp.checked = false;

  if (falloTipoSelect) falloTipoSelect.value = "";
  if (falloDetalleSelect) {
    falloDetalleSelect.innerHTML = "";
    const optDetalle = document.createElement("option");
    optDetalle.value = "";
    optDetalle.textContent = "Selecciona primero un tipo de fallo";
    falloDetalleSelect.appendChild(optDetalle);
    falloDetalleSelect.disabled = true;
  }
}

/**
 * Registra los eventos de guardado para evitar envíos clásicos del formulario.
 */
function registrarEventosGuardarIncidencia() {
  const btnGuardar = document.getElementById("btn_guardar_incidencia");
  const form = document.getElementById("incidenciaForm");

  const manejarGuardado = () => {
    if (btnGuardar) btnGuardar.disabled = true;
    try {
      limpiarMensajes();
      limpiarErroresCampos();
      const { esValido, camposInvalidos, valores } = validarCamposObligatorios();
      if (!esValido) {
        marcarErroresCampos(camposInvalidos);
        mostrarMensajeError(`Revisa los campos: ${camposInvalidos.join(", ")}`);
        return;
      }

      const incidencia = crearIncidenciaDesdeFormulario(valores);
      if (!incidencia) return;

      const lista = cargarIncidencias();
      if (existeIncidenciaDuplicada(lista, incidencia)) {
        mostrarMensajeError("Ya existe una incidencia igual para ese AGV, fecha y tipo de fallo.");
        return;
      }

      lista.push(incidencia);
      guardarIncidencias(lista);

      resetFormulario();
      refrescarTablaSegunTab();

      const minutosInfo = Number.isFinite(incidencia.minutos_incidente) ? `${incidencia.minutos_incidente} min` : "0 min";
      mostrarMensajeExito(`Incidencia guardada para ${incidencia.circuito || ""} ${incidencia.agv || ""} (${incidencia.fallo_tipo || ""} · ${minutosInfo}).`);
    } finally {
      if (btnGuardar) btnGuardar.disabled = false;
    }
  };

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      manejarGuardado();
    });
  }

  if (!btnGuardar) {
    console.warn('Botón "Guardar incidencia" no encontrado');
    return;
  }

  btnGuardar.addEventListener("click", (event) => {
    event.preventDefault();
    manejarGuardado();
  });
}

/**
 * Punto de entrada: inicializa formulario y tabla.
 */
function initFormulario() {
  const circuitoSelect = $("#circuito");
  const falloTipoSelect = $("#fallo_tipo");
  const minutosParadaInput = $("#minutos_parada");

  if (minutosParadaInput) {
    minutosParadaInput.value = minutosParadaInput.value || "0";
    minutosParadaInput.max = "99";
    minutosParadaInput.min = "0";
  }

  if (circuitoSelect) {
    const placeholder = circuitoSelect.querySelector('option[value=""]')?.textContent || "Selecciona un circuito";
    const circuitoOptions = getCircuitoOptions().map((c) => ({ value: c, label: c }));
    renderSelectOptions(circuitoSelect, circuitoOptions, placeholder);
  }

  if (falloTipoSelect) {
    const placeholder = falloTipoSelect.querySelector('option[value=""]')?.textContent || "Selecciona un tipo de fallo";
    renderSelectOptions(falloTipoSelect, getFallosTipoOptions(), placeholder);
  }

  resetFormulario();
}

function initApp() {
  storageDisponibleFlag = storageDisponible();
  initEstadoConexionUI();
  initFormulario();
  initEstadoCarro();
  initAGV();
  initFalloDetalle();
  registrarEventosGuardarIncidencia();
  registrarEventosExportarCSV();
  initTabs();
  initHistorico();
  refrescarTablaSegunTab();
}

// Registro del service worker para PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.error("Error al registrar service worker", err);
    });
  });
}

document.addEventListener("DOMContentLoaded", initApp);
