let usuarioActual = null;
let tareaSeleccionada = null;
let mesCalendario = new Date();

async function init() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { window.location.href = 'index.html'; return; }

  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', user.id).single();
  if (!perfil || perfil.rol !== 'estudiante') { window.location.href = 'index.html'; return; }

  usuarioActual = perfil;
  document.getElementById('nombre-usuario').textContent = perfil.nombre;
  cargarClases();
  dibujarCalendario();
  cargarProximosEventos();
}

function mostrarSeccion(nombre) {
  ['mis-clases','tareas','materiales','calificaciones'].forEach(s => {
    document.getElementById('seccion-' + s).style.display = 'none';
  });
  document.getElementById('seccion-' + nombre).style.display = 'block';
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('activo'));
  event.target.classList.add('activo');

  if (nombre === 'tareas') cargarTareas();
  if (nombre === 'materiales') cargarMateriales();
  if (nombre === 'calificaciones') cargarCalificaciones();
}

async function cargarClases() {
  const { data } = await supabase
    .from('inscripciones')
    .select('seccion_id, secciones(id, nombre, codigo, descripcion, periodo, grado, perfiles(nombre))')
    .eq('estudiante_id', usuarioActual.id);

  document.getElementById('titulo-bienvenida').textContent = `¡Bienvenido/a, ${usuarioActual.nombre.split(' ')[0]}! 👋`;
  document.getElementById('stat-clases').textContent = data ? data.length : 0;

  const contenedor = document.getElementById('lista-clases');
  if (!data || data.length === 0) {
    contenedor.innerHTML = '<div class="tarjeta"><p style="color:var(--plata);">No estás inscrito en ninguna clase aún. Usa el código de tu profesor para inscribirte.</p></div>';
  } else {
    contenedor.innerHTML = data.map(i => `
      <div class="curso-card">
        <div class="curso-banner">
          <span class="curso-etiqueta">${i.secciones.codigo}</span>
        </div>
        <div class="curso-body">
          <h4>${i.secciones.nombre}</h4>
          <div class="curso-meta">👨‍🏫 ${i.secciones.perfiles?.nombre || 'Sin asignar'} · ${i.secciones.periodo}</div>
          <p style="font-size:0.85rem; color:var(--plata); margin-bottom:12px;">${i.secciones.descripcion || ''}</p>
        </div>
      </div>
    `).join('');
  }

  if (data && data.length > 0) {
    const ids = data.map(i => i.seccion_id);
    const { data: tareas } = await supabase.from('tareas').select('id').in(
