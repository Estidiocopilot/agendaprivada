/* =========================================
   AGENDA PERSONAL
   JavaScript
========================================= */


/* =========================================
   VARIABLES
========================================= */

let eventos = JSON.parse(
    localStorage.getItem("agendaEventos")
) || [];

let fechaCalendario = new Date();

let eventoEditando = null;


/* =========================================
   ELEMENTOS DEL DOM
========================================= */

const modalEvento = document.getElementById("modalEvento");

const formularioEvento = document.getElementById("formularioEvento");

const listaEventos = document.getElementById("listaEventos");

const diasCalendario = document.getElementById("diasCalendario");

const mesActual = document.getElementById("mesActual");

const totalEventos = document.getElementById("totalEventos");

const eventosPendientes = document.getElementById("eventosPendientes");

const eventosCompletados = document.getElementById("eventosCompletados");

const buscarEvento = document.getElementById("buscarEvento");

const filtroCategoria = document.getElementById("filtroCategoria");

const filtroEstado = document.getElementById("filtroEstado");


/* =========================================
   BOTONES
========================================= */

const btnNuevaTarea = document.getElementById("btnNuevaTarea");

const btnCerrarModal = document.getElementById("btnCerrarModal");

const btnCancelar = document.getElementById("btnCancelar");

const btnMesAnterior = document.getElementById("btnMesAnterior");

const btnMesSiguiente = document.getElementById("btnMesSiguiente");

const btnModoOscuro = document.getElementById("btnModoOscuro");


/* =========================================
   CAMPOS DEL FORMULARIO
========================================= */

const eventoId = document.getElementById("eventoId");

const tituloEvento = document.getElementById("tituloEvento");

const descripcionEvento = document.getElementById("descripcionEvento");

const fechaEvento = document.getElementById("fechaEvento");

const horaEvento = document.getElementById("horaEvento");

const categoriaEvento = document.getElementById("categoriaEvento");

const prioridadEvento = document.getElementById("prioridadEvento");

const tituloModal = document.getElementById("tituloModal");


/* =========================================
   INICIALIZACIÓN
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    cargarTema();

    establecerFechaActual();

    renderizarCalendario();

    renderizarEventos();

    actualizarResumen();

});


/* =========================================
   GUARDAR EVENTOS
========================================= */

function guardarEventos() {

    localStorage.setItem(
        "agendaEventos",
        JSON.stringify(eventos)
    );

}


/* =========================================
   GENERAR ID
========================================= */

function generarId() {

    return Date.now().toString();

}


/* =========================================
   ABRIR MODAL
========================================= */

function abrirModal() {

    modalEvento.classList.add("mostrar");

}


/* =========================================
   CERRAR MODAL
========================================= */

function cerrarModal() {

    modalEvento.classList.remove("mostrar");

    formularioEvento.reset();

    eventoId.value = "";

    eventoEditando = null;

    tituloModal.textContent = "Nueva actividad";

    establecerFechaActual();

}


/* =========================================
   ESTABLECER FECHA ACTUAL
========================================= */

function establecerFechaActual() {

    const ahora = new Date();

    const año = ahora.getFullYear();

    const mes = String(
        ahora.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        ahora.getDate()
    ).padStart(2, "0");

    fechaEvento.value = `${año}-${mes}-${dia}`;

}


/* =========================================
   NUEVA ACTIVIDAD
========================================= */

btnNuevaTarea.addEventListener(
    "click",
    function () {

        eventoEditando = null;

        formularioEvento.reset();

        eventoId.value = "";

        tituloModal.textContent = "Nueva actividad";

        establecerFechaActual();

        abrirModal();

    }
);


/* =========================================
   CERRAR MODAL
========================================= */

btnCerrarModal.addEventListener(
    "click",
    cerrarModal
);

btnCancelar.addEventListener(
    "click",
    cerrarModal
);


/* =========================================
   CERRAR MODAL AL HACER CLICK AFUERA
========================================= */

modalEvento.addEventListener(
    "click",
    function (e) {

        if (e.target === modalEvento) {

            cerrarModal();

        }

    }
);


/* =========================================
   GUARDAR / EDITAR ACTIVIDAD
========================================= */

formularioEvento.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();


        const datos = {

            titulo: tituloEvento.value.trim(),

            descripcion: descripcionEvento.value.trim(),

            fecha: fechaEvento.value,

            hora: horaEvento.value,

            categoria: categoriaEvento.value,

            prioridad: prioridadEvento.value

        };


        /* ===============================
           VALIDAR TÍTULO
        =============================== */

        if (datos.titulo === "") {

            alert(
                "Por favor, ingresa el título de la actividad."
            );

            tituloEvento.focus();

            return;

        }


        /* ===============================
           VALIDAR FECHA
        =============================== */

        if (datos.fecha === "") {

            alert(
                "Por favor, selecciona una fecha."
            );

            fechaEvento.focus();

            return;

        }


        /* ===============================
           EDITAR ACTIVIDAD
        =============================== */

        if (eventoEditando !== null) {

            const indice = eventos.findIndex(
                function (evento) {

                    return evento.id === eventoEditando;

                }
            );


            if (indice !== -1) {

                eventos[indice] = {

                    ...eventos[indice],

                    titulo: datos.titulo,

                    descripcion: datos.descripcion,

                    fecha: datos.fecha,

                    hora: datos.hora,

                    categoria: datos.categoria,

                    prioridad: datos.prioridad

                };

            }

        }


        /* ===============================
           CREAR ACTIVIDAD
        =============================== */

        else {

            const nuevoEvento = {

                id: generarId(),

                titulo: datos.titulo,

                descripcion: datos.descripcion,

                fecha: datos.fecha,

                hora: datos.hora,

                categoria: datos.categoria,

                prioridad: datos.prioridad,

                completado: false,

                creado: new Date().toISOString()

            };


            eventos.push(nuevoEvento);

        }


        /* ===============================
           GUARDAR
        =============================== */

        guardarEventos();

        cerrarModal();

        renderizarEventos();

        renderizarCalendario();

        actualizarResumen();

    }
);


/* =========================================
   RENDERIZAR EVENTOS
========================================= */

function renderizarEventos() {

    let eventosFiltrados = [...eventos];


    /* ===============================
       BUSCAR
    =============================== */

    const texto = buscarEvento.value
        .toLowerCase()
        .trim();


    if (texto !== "") {

        eventosFiltrados = eventosFiltrados.filter(
            function (evento) {

                return (
                    evento.titulo
                        .toLowerCase()
                        .includes(texto)
                    ||
                    evento.descripcion
                        .toLowerCase()
                        .includes(texto)
                );

            }
        );

    }


    /* ===============================
       FILTRO CATEGORÍA
    =============================== */

    const categoria = filtroCategoria.value;


    if (categoria !== "todas") {

        eventosFiltrados = eventosFiltrados.filter(
            function (evento) {

                return evento.categoria === categoria;

            }
        );

    }


    /* ===============================
       FILTRO ESTADO
    =============================== */

    const estado = filtroEstado.value;


    if (estado === "pendiente") {

        eventosFiltrados = eventosFiltrados.filter(
            function (evento) {

                return !evento.completado;

            }
        );

    }


    if (estado === "completado") {

        eventosFiltrados = eventosFiltrados.filter(
            function (evento) {

                return evento.completado;

            }
        );

    }


    /* ===============================
       ORDENAR POR FECHA Y HORA
    =============================== */

    eventosFiltrados.sort(
        function (a, b) {

            const fechaA =
                `${a.fecha} ${a.hora || "00:00"}`;

            const fechaB =
                `${b.fecha} ${b.hora || "00:00"}`;

            return fechaA.localeCompare(fechaB);

        }
    );


    /* ===============================
       SIN EVENTOS
    =============================== */

    if (eventosFiltrados.length === 0) {

        listaEventos.innerHTML = `
            <div class="sin-eventos">

                <span>📭</span>

                <h3>No hay actividades</h3>

                <p>
                    No se encontraron actividades.
                </p>

            </div>
        `;

        return;

    }


    /* ===============================
       MOSTRAR EVENTOS
    =============================== */

    listaEventos.innerHTML = eventosFiltrados
        .map(
            function (evento) {

                return crearHTMLEvento(evento);

            }
        )
        .join("");

}


/* =========================================
   CREAR HTML DEL EVENTO
========================================= */

function crearHTMLEvento(evento) {

    const categoria =
        obtenerNombreCategoria(
            evento.categoria
        );


    const prioridad =
        obtenerNombrePrioridad(
            evento.prioridad
        );


    const claseCompletado =
        evento.completado
            ? "completado"
            : "";


    const botonEstado =
        evento.completado
            ? "↩️"
            : "✅";


    const tituloBotonEstado =
        evento.completado
            ? "Marcar como pendiente"
            : "Marcar como completada";


    const horaHTML =
        evento.hora
            ? `<span>🕐 ${evento.hora}</span>`
            : "";


    return `
        <article
            class="evento prioridad-${evento.prioridad} ${claseCompletado}"
        >

            <div class="evento-info">

                <h3 class="evento-titulo">
                    ${escaparHTML(evento.titulo)}
                </h3>


                <p class="evento-descripcion">
                    ${escaparHTML(
                        evento.descripcion || "Sin descripción"
                    )}
                </p>


                <div class="evento-datos">

                    <span>
                        📅 ${formatearFecha(evento.fecha)}
                    </span>

                    ${horaHTML}

                    <span>
                        🏷️ ${categoria}
                    </span>

                    <span>
                        ⚡ ${prioridad}
                    </span>

                </div>

            </div>


            <div class="evento-acciones">

                <button
                    type="button"
                    onclick="alternarCompletado('${evento.id}')"
                    title="${tituloBotonEstado}"
                >
                    ${botonEstado}
                </button>


                <button
                    type="button"
                    onclick="editarEvento('${evento.id}')"
                    title="Editar actividad"
                >
                    ✏️
                </button>


                <button
                    type="button"
                    onclick="eliminarEvento('${evento.id}')"
                    title="Eliminar actividad"
                >
                    🗑️
                </button>

            </div>

        </article>
    `;

}


/* =========================================
   ESCAPAR HTML
========================================= */

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


/* =========================================
   EDITAR EVENTO
========================================= */

function editarEvento(id) {

    const evento = eventos.find(
        function (item) {

            return item.id === id;

        }
    );


    if (!evento) {

        return;

    }


    eventoEditando = id;


    eventoId.value = evento.id;

    tituloEvento.value = evento.titulo;

    descripcionEvento.value =
        evento.descripcion || "";

    fechaEvento.value = evento.fecha;

    horaEvento.value =
        evento.hora || "";

    categoriaEvento.value =
        evento.categoria || "otros";

    prioridadEvento.value =
        evento.prioridad || "media";


    tituloModal.textContent =
        "Editar actividad";


    abrirModal();

}


/* =========================================
   ELIMINAR EVENTO
========================================= */

function eliminarEvento(id) {

    const evento = eventos.find(
        function (item) {

            return item.id === id;

        }
    );


    if (!evento) {

        return;

    }


    const confirmar = confirm(
        `¿Deseas eliminar "${evento.titulo}"?`
    );


    if (!confirmar) {

        return;

    }


    eventos = eventos.filter(
        function (item) {

            return item.id !== id;

        }
    );


    guardarEventos();

    renderizarEventos();

    renderizarCalendario();

    actualizarResumen();

}


/* =========================================
   COMPLETAR / DESCOMPLETAR
========================================= */

function alternarCompletado(id) {

    const evento = eventos.find(
        function (item) {

            return item.id === id;

        }
    );


    if (!evento) {

        return;

    }


    evento.completado =
        !evento.completado;


    guardarEventos();

    renderizarEventos();

    renderizarCalendario();

    actualizarResumen();

}


/* =========================================
   ACTUALIZAR RESUMEN
========================================= */

function actualizarResumen() {

    const total =
        eventos.length;


    const completados =
        eventos.filter(
            function (evento) {

                return evento.completado;

            }
        ).length;


    const pendientes =
        total - completados;


    totalEventos.textContent =
        total;


    eventosPendientes.textContent =
        pendientes;


    eventosCompletados.textContent =
        completados;

}


/* =========================================
   NOMBRE DE CATEGORÍA
========================================= */

function obtenerNombreCategoria(categoria) {

    const categorias = {

        trabajo: "Trabajo",

        personal: "Personal",

        estudio: "Estudio",

        salud: "Salud",

        otros: "Otros"

    };


    return categorias[categoria] || "Otros";

}


/* =========================================
   NOMBRE DE PRIORIDAD
========================================= */

function obtenerNombrePrioridad(prioridad) {

    const prioridades = {

        baja: "Baja",

        media: "Media",

        alta: "Alta"

    };


    return prioridades[prioridad] || "Media";

}


/* =========================================
   FORMATEAR FECHA
========================================= */

function formatearFecha(fecha) {

    if (!fecha) {

        return "";

    }


    const partes = fecha.split("-");


    if (partes.length !== 3) {

        return fecha;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* =========================================
   RENDERIZAR CALENDARIO
========================================= */

function renderizarCalendario() {

    const año =
        fechaCalendario.getFullYear();


    const mes =
        fechaCalendario.getMonth();


    const nombresMeses = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    mesActual.textContent =
        `${nombresMeses[mes]} ${año}`;


    diasCalendario.innerHTML = "";


    /* ===============================
       PRIMER DÍA DEL MES
    =============================== */

    let primerDia =
        new Date(
            año,
            mes,
            1
        ).getDay();


    /*
        JavaScript:

        Domingo = 0
        Lunes = 1
        Martes = 2
        ...
    */


    primerDia =
        primerDia === 0
            ? 6
            : primerDia - 1;


    /* ===============================
       ÚLTIMO DÍA DEL MES
    =============================== */

    const ultimoDia =
        new Date(
            año,
            mes + 1,
            0
        ).getDate();


    /* ===============================
       ÚLTIMO DÍA MES ANTERIOR
    =============================== */

    const ultimoDiaMesAnterior =
        new Date(
            año,
            mes,
            0
        ).getDate();


    /* ===============================
       DÍAS MES ANTERIOR
    =============================== */

    for (
        let i = primerDia - 1;
        i >= 0;
        i--
    ) {

        const numero =
            ultimoDiaMesAnterior - i;


        crearDiaCalendario(
            numero,
            true,
            null
        );

    }


    /* ===============================
       DÍAS DEL MES ACTUAL
    =============================== */

    for (
        let dia = 1;
        dia <= ultimoDia;
        dia++
    ) {

        const fecha =
            `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


        crearDiaCalendario(
            dia,
            false,
            fecha
        );

    }


    /* ===============================
       COMPLETAR CALENDARIO
    =============================== */

    const celdas =
        diasCalendario.children.length;


    const restantes =
        42 - celdas;


    for (
        let dia = 1;
        dia <= restantes;
        dia++
    ) {

        crearDiaCalendario(
            dia,
            true,
            null
        );

    }

}


/* =========================================
   CREAR DÍA DEL CALENDARIO
========================================= */

function crearDiaCalendario(
    numero,
    otroMes,
    fecha
) {

    const div =
        document.createElement("div");


    div.className = "dia";


    if (otroMes) {

        div.classList.add(
            "otro-mes"
        );

    }


    /* ===============================
       MARCAR HOY
    =============================== */

    if (
        fecha &&
        esHoy(fecha)
    ) {

        div.classList.add(
            "hoy"
        );

    }


    div.innerHTML = `
        <div class="numero-dia">
            ${numero}
        </div>

        <div class="eventos-dia"></div>
    `;


    /* ===============================
       EVENTOS DEL DÍA
    =============================== */

    if (fecha) {

        const eventosDia =
            eventos.filter(
                function (evento) {

                    return evento.fecha === fecha;

                }
            );


        const contenedor =
            div.querySelector(
                ".eventos-dia"
            );


        eventosDia
            .slice(0, 3)
            .forEach(
                function (evento) {

                    const etiqueta =
                        document.createElement(
                            "div"
                        );


                    etiqueta.textContent =
                        evento.titulo;


                    etiqueta.style.fontSize =
                        "11px";


                    etiqueta.style.marginTop =
                        "5px";


                    etiqueta.style.overflow =
                        "hidden";


                    etiqueta.style.whiteSpace =
                        "nowrap";


                    etiqueta.style.textOverflow =
                        "ellipsis";


                    contenedor.appendChild(
                        etiqueta
                    );

                }
            );


        /* ===========================
           CLICK EN FECHA
        =========================== */

        div.addEventListener(
            "click",
            function () {

                fechaEvento.value =
                    fecha;

                eventoEditando = null;

                eventoId.value = "";

                tituloModal.textContent =
                    "Nueva actividad";

                abrirModal();

            }
        );

    }


    diasCalendario.appendChild(
        div
    );

}


/* =========================================
   COMPROBAR SI ES HOY
========================================= */

function esHoy(fecha) {

    const hoy =
        new Date();


    const año =
        hoy.getFullYear();


    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoy.getDate()
        ).padStart(2, "0");


    const fechaHoy =
        `${año}-${mes}-${dia}`;


    return fecha === fechaHoy;

}


/* =========================================
   MES ANTERIOR
========================================= */

btnMesAnterior.addEventListener(
    "click",
    function () {

        fechaCalendario.setMonth(
            fechaCalendario.getMonth() - 1
        );


        renderizarCalendario();

    }
);


/* =========================================
   MES SIGUIENTE
========================================= */

btnMesSiguiente.addEventListener(
    "click",
    function () {

        fechaCalendario.setMonth(
            fechaCalendario.getMonth() + 1
        );


        renderizarCalendario();

    }
);


/* =========================================
   BUSCADOR
========================================= */

buscarEvento.addEventListener(
    "input",
    function () {

        renderizarEventos();

    }
);


/* =========================================
   FILTRO CATEGORÍA
========================================= */

filtroCategoria.addEventListener(
    "change",
    function () {

        renderizarEventos();

    }
);


/* =========================================
   FILTRO ESTADO
========================================= */

filtroEstado.addEventListener(
    "change",
    function () {

        renderizarEventos();

    }
);


/* =========================================
   MODO OSCURO
========================================= */

btnModoOscuro.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "modo-oscuro"
        );


        const oscuro =
            document.body.classList.contains(
                "modo-oscuro"
            );


        localStorage.setItem(
            "agendaTema",
            oscuro
                ? "oscuro"
                : "claro"
        );


        btnModoOscuro.textContent =
            oscuro
                ? "☀️"
                : "🌙";

    }
);


/* =========================================
   CARGAR TEMA
========================================= */

function cargarTema() {

    const tema =
        localStorage.getItem(
            "agendaTema"
        );


    if (tema === "oscuro") {

        document.body.classList.add(
            "modo-oscuro"
        );


        btnModoOscuro.textContent =
            "☀️";

    }

}
