/* eslint-env browser */
// Configuración y catálogos
const STORAGE_KEY = "agv_incidencias_v1";
const SCHEMA_VERSION = 1;
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
      { value: "parada_seta", label: "Parada seta" }
    ]
  },
  fuera_de_guia: {
    label: "Fuera de guía",
    detalles: [
      { value: "obstaculo", label: "Obstáculo" },
      { value: "junta_dilatacion", label: "Junta de dilatación" },
      { value: "guia_deteriorada", label: "Guía deteriorada" },
      { value: "direccion_bloqueada", label: "Dirección bloqueada" },
      { value: "golpe", label: "Golpe" }
    ]
  },
  se_salta_parada: {
    label: "Se salta parada",
    detalles: [
      { value: "error_centralita", label: "Error de centralita" },
      { value: "no_lee_tag", label: "No lee tag" },
      { value: "no_ejecuta_tag", label: "No ejecuta tag" }
    ]
  },
  bateria: {
    label: "Batería",
    detalles: [
      { value: "descargada", label: "Descargada" },
      { value: "no_entra_carga_online", label: "No entra en carga online" },
      { value: "no_baja_pines_carga", label: "No baja pines de carga" },
      { value: "fallo_sistema_carga", label: "Fallo sistema de carga" }
    ]
  },
  apagado: {
    label: "Apagado",
    detalles: [
      { value: "mala_conexion_bateria", label: "Mala conexión de batería" },
      { value: "bateria_suelta", label: "Batería suelta" },
      { value: "apagado_manual", label: "Apagado manual" },
      { value: "fallo_interno", label: "Fallo interno" }
    ]
  },
  muy_despacio: {
    label: "Muy despacio",
    detalles: [
      { value: "reduccion_seguridad", label: "Reducción de seguridad" },
      { value: "no_lee_tags", label: "No lee tags" },
      { value: "mapa_incorrecto", label: "Mapa incorrecto" },
      { value: "fallo_interno", label: "Fallo interno" }
    ]
  }
};

/**
 * @typedef {Object} IncidenciaAGV
 * @property {string} id
 * @property {string} created_at
 * @property {string} circuito
 * @property {string} agv_id
 * @property {string} incidente_fecha
 * @property {string} incidente_hora
 * @property {string} fallo_tipo
 * @property {string} fallo_detalle
 * @property {string} estado_carga
 * @property {number|null} bateria_valor
 * @property {boolean} bateria_no_gmp
 * @property {boolean} requiere_taller
 * @property {number} minutos_parada
 * @property {string} posicion_codigo
 * @property {string} posicion_nota
 * @property {string} observaciones
 * @property {number} schema_version
 */

// Utilidades de almacenamiento (localStorage)

/**
 * Lee incidencias desde localStorage.
 * @returns {IncidenciaAGV[]} Lista de incidencias o []
 */
function cargarIncidencias() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("No se pudieron parsear las incidencias almacenadas", error);
    return [];
  }
}

/**
 * Guarda incidencias en localStorage.
 * @param {IncidenciaAGV[]} lista
 */
function guardarIncidencias(lista) {
  try {
    const safeList = Array.isArray(lista) ? lista : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeList));
  } catch (error) {
    console.error("No se pudieron guardar las incidencias", error);
  }
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
function initEstadoCargaCheckboxes() {
  const estadoVacio = $("#estado_vacio");
  const estadoLleno = $("#estado_lleno");

  if (!estadoVacio || !estadoLleno) return;

  const toggleExclusive = (source, target) => {
    source.addEventListener("change", () => {
      if (source.checked) target.checked = false;
    });
  };

  toggleExclusive(estadoVacio, estadoLleno);
  toggleExclusive(estadoLleno, estadoVacio);

  estadoVacio.checked = true;
  estadoLleno.checked = false;
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
      inc.agv_id === nueva.agv_id &&
      inc.incidente_fecha === nueva.incidente_fecha &&
      inc.incidente_hora === nueva.incidente_hora &&
      inc.fallo_tipo === nueva.fallo_tipo &&
      inc.fallo_detalle === nueva.fallo_detalle
  );
}

/**
 * Crea un objeto de incidencia con la estructura base.
 * @param {Partial<IncidenciaAGV>} [formValues={}]
 * @returns {IncidenciaAGV}
 */
function crearIncidenciaBase(formValues = {}) {
  const now = new Date();
  const generatedId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `inc-${now.getTime()}-${Math.random().toString(16).slice(2)}`;

  const requiereTaller = (() => {
    if (typeof formValues.requiere_taller === "string") {
      return ["true", "1", "on", "si", "sí"].includes(formValues.requiere_taller.toLowerCase());
    }
    return Boolean(formValues.requiere_taller);
  })();

  const minutosParada = Number(formValues.minutos_parada);

  return {
    id: formValues.id || generatedId,
    created_at: formValues.created_at || now.toISOString(),
    circuito: formValues.circuito || "",
    agv_id: formValues.agv_id || "",
    incidente_fecha: formValues.incidente_fecha || "",
    incidente_hora: formValues.incidente_hora || "",
    fallo_tipo: formValues.fallo_tipo || "",
    fallo_detalle: formValues.fallo_detalle || "",
    estado_carga: formValues.estado_carga || "",
    bateria_valor: Number.isFinite(formValues.bateria_valor) ? formValues.bateria_valor : null,
    bateria_no_gmp: Boolean(formValues.bateria_no_gmp),
    requiere_taller: requiereTaller,
    minutos_parada: Number.isFinite(minutosParada) ? minutosParada : 0,
    posicion_codigo: formValues.posicion_codigo || "",
    posicion_nota: formValues.posicion_nota || "",
    observaciones: formValues.observaciones || "",
    schema_version: formValues.schema_version || SCHEMA_VERSION
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
 * Valida campos mínimos del formulario, lanza Error si falta algo.
 * @param {Object} payload
 */
function validarIncidenciaPayload(payload) {
  const faltantes = [];
  if (!payload.circuito) faltantes.push("circuito");
  if (!payload.agv_id) faltantes.push("agv");
  if (payload.circuito && payload.agv_id && !isAgvValido(payload.circuito, payload.agv_id)) {
    faltantes.push("agv no coincide con el circuito");
    marcarErrorCampo("agv", "Selecciona un AGV válido para el circuito");
  }
  if (!payload.incidente_fecha) faltantes.push("fecha de incidente");
  if (!payload.incidente_hora) faltantes.push("hora de incidente");
  if (!payload.fallo_tipo) faltantes.push("tipo de fallo");
  if (!payload.fallo_detalle) faltantes.push("detalle de fallo");

  if (faltantes.length) {
    const mensaje = `Revisa los campos: ${faltantes.join(", ")}`;
    mostrarMensajeError(mensaje);
    throw new Error(mensaje);
  }
}

/**
 * Lee el formulario y devuelve una incidencia lista para almacenar.
 * Devuelve null si no es válida.
 * @returns {IncidenciaAGV|null}
 */
function crearIncidenciaDesdeFormulario() {
  limpiarErroresCampos();
  limpiarMensajes();

  const circuito = ($("#circuito")?.value || "").trim();
  const agv = ($("#agv")?.value || "").trim();
  const incidenteFecha = $("#incidente_fecha")?.value || "";
  const incidenteHora = $("#incidente_hora")?.value || "";
  const falloTipo = $("#fallo_tipo")?.value || "";
  const falloDetalle = $("#fallo_detalle")?.value || "";
  const estadoVacio = Boolean($("#estado_vacio")?.checked);
  const estadoLleno = Boolean($("#estado_lleno")?.checked);
  const estadoCarga = estadoVacio ? "vacio" : estadoLleno ? "cargado" : "desconocido";
  const requiereTaller = Boolean($("#requiere_taller")?.checked);
  const minutosInput = document.getElementById("minutos_parada");
  let minutosParada = 0;
  if (minutosInput && minutosInput.value !== "") {
    const n = Number(minutosInput.value);
    if (!Number.isNaN(n) && n >= 0) {
      minutosParada = Math.min(n, 99);
    }
  }
  const posicionCodigo = $("#posicion_codigo")?.value || "";
  const observaciones = $("#observaciones")?.value || "";
  const bateriaValorInput = document.getElementById("bateria_valor");
  const bateriaValorParsed = bateriaValorInput ? parseInt(bateriaValorInput.value, 10) : NaN;
  const bateriaValor = Number.isFinite(bateriaValorParsed) && bateriaValorParsed >= 0 ? Math.min(bateriaValorParsed, 999) : null;
  const bateriaNoGmp = Boolean(document.getElementById("bateria_no_gmp")?.checked);

  const timestamp = Date.now();
  const payload = crearIncidenciaBase({
    id: `${circuito}-${agv}-${timestamp}`,
    created_at: new Date().toISOString(),
    circuito,
    agv_id: agv,
    incidente_fecha: incidenteFecha,
    incidente_hora: incidenteHora,
    fallo_tipo: falloTipo,
    fallo_detalle: falloDetalle,
    estado_carga: estadoCarga,
    bateria_valor: bateriaValor,
    bateria_no_gmp: bateriaNoGmp,
    requiere_taller: requiereTaller,
    minutos_parada: minutosParada,
    posicion_codigo: posicionCodigo,
    posicion_nota: posicionCodigo,
    observaciones
  });

  try {
    validarIncidenciaPayload(payload);
  } catch (error) {
    console.error("Formulario incompleto o inválido", error);
    marcarErrorCampo("circuito", !circuito ? "Obligatorio" : "");
    marcarErrorCampo("agv", !agv ? "Obligatorio" : "");
    marcarErrorCampo("incidente_fecha", !incidenteFecha ? "Obligatorio" : "");
    marcarErrorCampo("incidente_hora", !incidenteHora ? "Obligatorio" : "");
    marcarErrorCampo("fallo_tipo", !falloTipo ? "Obligatorio" : "");
    marcarErrorCampo("fallo_detalle", !falloDetalle ? "Obligatorio" : "");
    return null;
  }

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
      ultimaEl.textContent = `${fechaHora} · ${ultima.circuito || ""} ${ultima.agv_id || ""} · ${ultima.fallo_tipo || ""}`.trim();
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
    renderTablaIncidencias();
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
  const tbody = document.querySelector("#tabla_incidencias tbody");
  if (!tbody) {
    console.warn("No se encontró el tbody de la tabla de incidencias");
    return;
  }

  const incidencias = Array.isArray(lista) ? lista : cargarIncidencias();
  tbody.innerHTML = "";

  if (!incidencias.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 8;
    cell.textContent = "No hay incidencias registradas.";
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

    const columns = [
      fechaIncidente || "-",
      inc.circuito || "-",
      inc.agv_id || "-",
      inc.fallo_tipo || "-",
      inc.fallo_detalle || "-",
      Number.isFinite(inc.minutos_parada) ? inc.minutos_parada : "-",
      inc.posicion_codigo || "-",
      inc.requiere_taller ? "Sí" : "No"
    ];

    columns.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  actualizarResumenIncidencias();
}

// Alias para compatibilidad
function pintarTablaIncidencias(lista) {
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
      const agvVal = (inc.agv_id || "").toString().toLowerCase();
      if (!agvVal.includes(agvTerm)) return false;
    }
    return true;
  });
}

/**
 * Inicializa filtros del histórico y ejecuta filtrado.
 */
let historicoInicializado = false;

function aplicarFiltroHistorico() {
  const desde = $("#filtro_desde")?.value || "";
  const hasta = $("#filtro_hasta")?.value || "";
  const agvFiltro = $("#filtro_agv")?.value || "";
  const filtradas = filtrarIncidencias(desde, hasta, agvFiltro);
  renderTablaIncidencias(filtradas);
}

function initFiltrosHistorico() {
  const filtroDesde = $("#filtro_desde");
  const filtroHasta = $("#filtro_hasta");
  const btnFiltrar = $("#btn_filtrar_historico");
  const filtroAgv = $("#filtro_agv");

  if (!filtroDesde || !filtroHasta || !btnFiltrar || !filtroAgv) {
    console.warn("Filtros de histórico no encontrados en el DOM");
    historicoInicializado = true;
    renderTablaIncidencias();
    return;
  }

  if (!filtroDesde.value) filtroDesde.value = hoyInput();
  if (!filtroHasta.value) filtroHasta.value = hoyInput();
  if (!filtroAgv.value) filtroAgv.value = "";

  btnFiltrar.addEventListener("click", (event) => {
    event.preventDefault();
    aplicarFiltroHistorico();
  });

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
      if (!historicoInicializado) {
        initFiltrosHistorico();
      } else {
        aplicarFiltroHistorico();
      }
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

/**
 * Genera un CSV (string) desde una lista de incidencias.
 * @param {IncidenciaAGV[]} lista
 * @returns {string}
 */
function generarCSVDesdeIncidencias(lista) {
  const headers = [
    "id",
    "created_at",
    "circuito",
    "agv_id",
    "incidente_fecha",
    "incidente_hora",
    "fallo_tipo",
    "fallo_detalle",
    "estado_carga",
    "requiere_taller",
    "minutos_parada",
    "posicion_codigo",
    "bateria_valor",
    "bateria_no_gmp",
    "observaciones"
  ];

  const escape = (value) => {
    const str = value === undefined || value === null ? "" : String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = (Array.isArray(lista) ? lista : []).map((inc) =>
    [
      inc.id,
      inc.created_at,
      inc.circuito,
      inc.agv_id,
      inc.incidente_fecha,
      inc.incidente_hora,
      inc.fallo_tipo,
      inc.fallo_detalle,
      inc.estado_carga,
      inc.requiere_taller,
      inc.minutos_parada,
      inc.posicion_codigo,
      inc.bateria_valor,
      inc.bateria_no_gmp,
      inc.observaciones
    ]
      .map(escape)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Exporta las incidencias a CSV y dispara descarga.
 */
function exportarCSV() {
  const incidencias = obtenerIncidenciasParaExportar();
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

/**
 * Limpia campos no persistentes tras guardar.
 */
function limpiarFormularioParcial() {
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

  if (fechaIncidente) fechaIncidente.value = "";
  if (horaIncidente) horaIncidente.value = "";
  if (estadoVacio) estadoVacio.checked = true;
  if (estadoLleno) estadoLleno.checked = false;
  if (requiereTaller) requiereTaller.checked = false;
  if (minutosParada) minutosParada.value = "0";
  if (posicionCodigo) posicionCodigo.value = "";
  if (observaciones) observaciones.value = "";
  if (falloTipoSelect) {
    falloTipoSelect.value = "";
    actualizarDetalleSegunTipoFallo("");
  }

  setDefaultsIncidenteAhora();
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
      const incidencia = crearIncidenciaDesdeFormulario();
      if (!incidencia) return;

      const lista = cargarIncidencias();
      if (existeIncidenciaDuplicada(lista, incidencia)) {
        mostrarMensajeError("Ya existe una incidencia igual para ese AGV, fecha y tipo de fallo.");
        return;
      }

      lista.push(incidencia);
      guardarIncidencias(lista);

      limpiarFormularioParcial();
      refrescarTablaSegunTab();

      const minutosInfo = Number.isFinite(incidencia.minutos_parada) ? `${incidencia.minutos_parada} min` : "0 min";
      mostrarMensajeExito(`Incidencia guardada para ${incidencia.circuito || ""} ${incidencia.agv_id || ""} (${incidencia.fallo_tipo || ""} · ${minutosInfo}).`);
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
  const exportBtn = $("#btn_exportar_csv");
  const minutosParadaInput = $("#minutos_parada");

  setDefaultsIncidenteAhora();
  initEstadoCargaCheckboxes();
  initTabs();
  actualizarEstadoConexion("local", navigator.onLine);
  window.addEventListener("online", () => actualizarEstadoConexion("local", true));
  window.addEventListener("offline", () => actualizarEstadoConexion("local", false));
  if (minutosParadaInput) {
    minutosParadaInput.value = minutosParadaInput.value || "0";
    minutosParadaInput.max = "99";
    minutosParadaInput.min = "0";
  }
  initAGV();
  initFalloDetalle();

  if (circuitoSelect) {
    const placeholder = circuitoSelect.querySelector('option[value=""]')?.textContent || "Selecciona un circuito";
    const circuitoOptions = getCircuitoOptions().map((c) => ({ value: c, label: c }));
    renderSelectOptions(circuitoSelect, circuitoOptions, placeholder);
  }

  if (falloTipoSelect) {
    const placeholder = falloTipoSelect.querySelector('option[value=""]')?.textContent || "Selecciona un tipo de fallo";
    renderSelectOptions(falloTipoSelect, getFallosTipoOptions(), placeholder);
  }

  registrarEventosGuardarIncidencia();

  if (exportBtn) {
    exportBtn.addEventListener("click", exportarCSV);
  } else {
    console.warn("Botón de exportar CSV no encontrado");
  }

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

document.addEventListener("DOMContentLoaded", initFormulario);
