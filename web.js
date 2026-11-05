(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const frame = $("stage"), panel = $("panel"), launch = $("launch");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const qs = new URLSearchParams(location.search);
  let app, rol = "", esc2 = "", hash = "";

  const rolP = () => app.rolParam || "rol", escP = () => app.escenarioParam || "hoy";
  const base = () => "apps/" + app.id + "/";
  /* La app recibe rol y escenario por query y la ruta por hash: así un enlace reproduce el estado. */
  const url = () => {
    const p = new URLSearchParams();
    if (rol) p.set(rolP(), rol);
    if (esc2) p.set(escP(), esc2);
    const q = p.toString();
    return base() + (app.inicio || "index.html") + (q ? "?" + q : "") + hash;
  };
  const roles = () => app.roles || [];

  function pintar() {
    $("titulo").textContent = app.nombre || app.id;
    $("gRol").hidden = !roles().length;
    $("segRol").innerHTML = roles().map((r) => {
      const on = r.id === rol;
      return '<button type="button" class="tt-role' + (on ? " is-active" : "") + '" data-r="' + esc(r.id) + '" title="' + esc(r.desc || "") + '" aria-pressed="' + on + '">' + esc(r.etiqueta) + "</button>";
    }).join("");
    $("gEsc").hidden = !(app.escenarios || []).length;
    $("segEsc").innerHTML = '<label class="sr" for="escSel">Escenario</label><select id="escSel" class="tt-sel">' + (app.escenarios || []).map((e) => '<option value="' + esc(e.valor) + '"' + (e.valor === esc2 ? " selected" : "") + ">" + esc(e.etiqueta) + "</option>").join("") + "</select>";
    $("solo").href = url();
    const r = roles().find((x) => x.id === rol);
    document.title = (r ? r.etiqueta + " · " : "") + (app.nombre || app.id) + " · Demo web";
    const p = new URLSearchParams({ app: app.id });
    if (rol) p.set("rol", rol);
    if (esc2) p.set("esc", esc2);
    try { history.replaceState(null, "", "?" + p + hash); } catch (e) { /* sin historial */ }
  }
  const cargar = () => { $("gHu").hidden = true; frame.src = url(); pintar(); };

  function abrir(on) {
    panel.classList.toggle("open", on); document.body.classList.toggle("tt-open", on);
    launch.setAttribute("aria-expanded", String(on));
    (on ? $("close") : launch).focus();
  }

  panel.addEventListener("click", (e) => {
    const hu = e.target.closest("[data-hu]");
    if (hu) { try { frame.contentWindow.postMessage({ demo: "hu-ir", id: hu.dataset.hu }, "*"); } catch (x) { /* otro origen */ } return; }
    const r = e.target.closest("[data-r]"), h = e.target.closest("[data-h]");
    if (e.target.closest("#reset")) {
      /* Contrato opcional: la app expone window.DEMO.restablecer(); si no, se limpia el almacenamiento. */
      try { frame.contentWindow.DEMO.restablecer(); } catch (x) { try { frame.contentWindow.localStorage.clear(); } catch (y) { /* otro origen */ } }
      hash = ""; cargar(); return;
    }
    if (h) { esc2 = h.dataset.h; cargar(); }
    if (r) { if (r.dataset.r !== rol) { rol = r.dataset.r; hash = ""; cargar(); } abrir(false); }
  });
  /* La app avisa su ruta con postMessage({type:"demo-ruta", hash}) para que cambiar de rol no la pierda. */
  window.addEventListener("message", (e) => {
    if (e.source !== frame.contentWindow || !e.data) return;
    if (e.data.type === "demo-ruta") { hash = e.data.hash || ""; pintar(); }
    if (e.data.demo === "abrir-panel") abrir(true);
    if (e.data.type === "demo-hu") {
      const ns = e.data.notas || [];
      $("gHu").hidden = !ns.length;
      $("listaHu").innerHTML = ns.map((n) => '<button type="button" class="tt-hu-nota" data-hu="' + esc(n.id) + '"><span class="tt-hu-ref">' + esc(n.hu) + "</span><b>" + esc(n.t) + "</b><span>" + esc(n.d) + "</span></button>").join("");
    }
  });
  panel.addEventListener("change", (e) => { if (e.target.id === "escSel") { esc2 = e.target.value; cargar(); } });
  launch.addEventListener("click", () => abrir(true));
  $("close").addEventListener("click", () => abrir(false));
  $("compact").addEventListener("click", () => $("compact").setAttribute("aria-pressed", String(document.body.classList.toggle("tt-compact"))));
  $("appSel").addEventListener("change", () => abrirApp($("appSel").value));
  /* ⌘/Ctrl+Shift+L; el marco es otro documento, por eso también se escucha dentro de él. */
  const atajo = (e) => { if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === "KeyL") { e.preventDefault(); abrir(!panel.classList.contains("open")); } };
  document.addEventListener("keydown", atajo);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) abrir(false); });
  frame.addEventListener("load", () => { try { frame.contentDocument.addEventListener("keydown", atajo); } catch (x) { /* otro origen */ } });

  function abrirApp(id, inicial) {
    app = window.APPS.find((a) => a.id === id) || window.APPS[0];
    $("appSel").value = app.id;
    const r = roles();
    rol = inicial && r.some((x) => x.id === qs.get("rol")) ? qs.get("rol") : (app.rolInicial || (r[0] && r[0].id) || "");
    esc2 = inicial && qs.has("esc") ? qs.get("esc") : app.escenarioInicial || "";
    hash = inicial ? location.hash : "";
    cargar();
  }

  if (!window.APPS.length) { $("vacio").hidden = false; launch.hidden = true; frame.hidden = true; return; }
  $("appSel").innerHTML = window.APPS.map((a) => '<option value="' + esc(a.id) + '">' + esc(a.nombre || a.id) + "</option>").join("");
  $("gApp").hidden = window.APPS.length < 2;
  abrirApp(qs.get("app"), true);
})();
