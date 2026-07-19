//LOGICA del DOM
// "import" trae la clase GestorTareas desde el archivo tareas.js
import { GestorTareas } from "./tareas.js";

//Creamos el objeto de gestor de tareas.
const gestor = new GestorTareas();

// El formulario completo
const formTarea = document.querySelector("#formTarea");

// El campo de texto donde el usuario escribe la tarea
const tareaInput = document.querySelector("#tareaInput");

//fecha limite
const fechaLimiteInput = document.querySelector("#fechaLimiteInput");

// El <ul> donde vamos a mostrar la lista de tareas
const listaTareas = document.querySelector("#listaTareas");

// Evento KEYUP
const previewTexto = document.querySelector("#previewTexto");

//Notificacion para cuando se agrega una tarea de forma correcta
const notificacion = document.querySelector("#notificacion");

//se usa cuando se enviar el formulario
formTarea.addEventListener("submit", (event) => {
  //le decimos que no se recarge la pagina
  event.preventDefault();

  // Sacamos la descripcion que escribió el usuario
  // usamos trim() para sacar los espacios demas
  const descripcion = tareaInput.value.trim();
  const fechaLimite = fechaLimiteInput.value;

  if (descripcion && fechaLimite) {
    setTimeout(() => {
      const nuevaTarea = gestor.agregarTarea(descripcion, fechaLimite);
      guardarTareasEnStorage();       // guardamos en localStorage
      guardarTareaEnAPI(nuevaTarea);  // "guardamos" en la API
      crearTareasHTML();
      mostrarNotificacion();
    }, 1000);
    //vaciamos el contenido de tareaInput
    tareaInput.value = "";
    //vaciamos la fehca
    fechaLimiteInput.value = "";
    //vaciamos el contenido de previewTexto
    previewTexto.textContent = "";
  }
});

//funcion que crea el html
function crearTareasHTML() {
  // Vaciamos todo lo que había antes en la lista
  // para no duplciar el contenido cada vez que creamos el HTML de las tareas
  listaTareas.innerHTML = "";

  // Recorremos TODAS las tareas guardadas en el gestor
  gestor.tareas.forEach((tarea) => {
    // Creamos un elemento <li>
    const li = document.createElement("li");

    // Le damos clases de Bootstrap al <li>
    //esto lo hicimos revisando la documentacion
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    // Guardamos el id de la tarea como atributo "data-id" en el HTML.
    li.dataset.id = tarea.id;
    //convertimos la fecha a texto
    const fechaCreacion = tarea.fchCreacion.toLocaleDateString();
    const fechaLimite = tarea.fechaLimite.toLocaleDateString();

    //usamos el innerHTML y creamos el html con los dato de la tarea y sus botones
    //cambiar estado y eliminar
    li.innerHTML = `
      <span> Tarea N°: ${tarea.id} — ${tarea.descripcion} — ${tarea.estado} </span>
      <span> Fch. Creacion: ${fechaCreacion} </span>
      <span> Fch. Limite: ${fechaLimite} </span>
      <small class="text-muted">Tiempo restante: <span class="contador">...</span></small>
      <div>
        <button class="btn btn-sm btn-success btn-estado">Cambiar estado</button>
        <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
      </div>
    `;

    //ahora agregamos el <li> al final de la lista
    listaTareas.appendChild(li);

    // Buscamos el <span> vacío que acabamos de crear,
    const spanContador = li.querySelector(".contador");
  
    // setInterval repite esta función cada 1000ms (1 segundo) sin parar
    setInterval(() => {
      // Calculamos cuanto tiempo queda para la tarea
      const tiempoRestante = tarea.fechaLimite - new Date();

      // si es mayor a 0
      if (tiempoRestante > 0) {
        // de milisegundos a horas totales
        const horasTotales = Math.floor(tiempoRestante / 1000 / 60 / 60);

        // de hora a dias
        const dias = Math.floor(horasTotales / 24);

        // sacamos las horas que sobran
        const horas = horasTotales % 24;

        // Mostramos el resultado en el <span>
        spanContador.textContent = `${dias} días ${horas} horas`;
      } else {
        // la tarea esta vencida
        spanContador.textContent = "¡Vencida!";
      }
    }, 1000);
  });
}

//cuando el usuario hace click en los botones de eliminar y
//estado activamos los metodos correspondientes
listaTareas.addEventListener("click", (event) => {
  // event.target es el elemento EXACTO donde se hizo click
  // si hace click en eliminar
  if (event.target.classList.contains("btn-eliminar")) {
    // El botón está adentro de un <div>, y ese <div> está
    // adentro del <li>. ya que el DOM es un jerarquia de clases del html usamos
    const li = event.target.parentElement.parentElement;

    //sacamos el id de la tareas y la pasamos a number
    const id = Number(li.dataset.id);

    // Le pedimos al gestor que elimine esa tarea con el id q sacamos del texto
    gestor.eliminarTarea(id);
    //guaramos en storage local
    guardarTareasEnStorage();

    // Volvemos a dibujar la lista, ya sin esa tarea
    crearTareasHTML();
  }

  // Preguntamos: "¿el elemento clickeado tiene la clase btn-estado?"
  if (event.target.classList.contains("btn-estado")) {
    // Mismo razonamiento que arriba: subimos del botón al li
    const li = event.target.parentElement.parentElement;
    //sacamos el id de y lo pasamos a numero
    const id = Number(li.dataset.id);

    // Le pedimos al gestor que cambie el estado de esa tarea
    gestor.editarEstadoTarea(id);
  
     guardarTareasEnStorage();
    // Volvemos a dibujar la lista, con el estado actualizado
    crearTareasHTML();
  }
});

//Evento KUYUP, cuando el usuario escribe lanza el mensaje Escribiendo..
tareaInput.addEventListener("keyup", () => {
  //console.log(`Escribiendo: "${tareaInput.value}"`);
  previewTexto.textContent = `Escribiendo.. "${tareaInput.value}"`;
});

//evento mouseover, se activa al pasar el mouse por el elemento que le indiquemos
//en este caso es el <li>, el cual contiene la tarea y los botones de las operaciones
listaTareas.addEventListener("mouseover", (event) => {
  // closest("li") buscadesde hasta encontrar el <li> más cercano
  const li = event.target.closest("li");

  // Si encontramos un <li>
  if (li) {
    //cambiamos el fondo
    li.style.backgroundColor = "#c8dcea";
  }
});

// Cuando el mouse deja de esta sobre el <li>
listaTareas.addEventListener("mouseout", (event) => {
  const li = event.target.closest("li");
  if (li) {
    //dejamos el backgroundColor vacio y por defecto tomar el color que tenia antes
    li.style.backgroundColor = "";
  }
});

//funcion que muestra la notificacion que
function mostrarNotificacion() {
  // Mostramos la notificación
  notificacion.style.display = "block";

  // Despues de 2 seg. la escondemos
  setTimeout(() => {
    notificacion.style.display = "none";
  }, 2000);
}


//-----CONSUMO DE API EXTERNA------//

// esta la api que usaremos y que estaba en la ducumentacion
const URL_API = "https://jsonplaceholder.typicode.com/todos";


//funcion para ontener las tareas de la api
/**[
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
}
    ] */
async function obtenerTareasDeAPI() {
  try {
    // await espera a que la peticion termine, sin bloquear la pagina
    const respuesta = await fetch(URL_API);

    // Si la respuesta no es OK 
    if (!respuesta.ok) {
      throw new Error(`Error al obtener datos: ${respuesta.status}`);
    }
    // Convertimos la respuesta a JSON (también hay que esperarla con await)
    const datos = await respuesta.json();

    console.log("Tareas obtenidas de la API:", datos);

    // devolvemos solo 5 tareas de la api 
    return datos.slice(0, 5);

  } catch (error) {
    // captura cualquien tipo de error
    console.error("Hubo un problema al traer las tareas:", error.message);
    return []; 
  }
}


//funcio que guarda las tareas en la api
async function guardarTareaEnAPI(tarea) {
  try {
    // fetch() hace la peticion a la API
    const respuesta = await fetch(URL_API, {

      method: "POST",
      // envio datos en formato JSON
      headers: {
        "Content-Type": "application/json"
      },

     //enviamos la tarea que esta en el body y la pasamos a string
      body: JSON.stringify(tarea)
    });

    // si hay algun error en la respuesta del servidor 
    if (!respuesta.ok) {
      throw new Error(`Error al guardar la tarea: ${respuesta.status}`);
    }

    // si esta ok tomamos la respuesta del server y la pasamos JSON
    const resultado = await respuesta.json();

    // vemos al respuesta de la API
    console.log("Tarea guardada en la API (simulado):", resultado);

  } catch (error) {
    //tomar el error
    console.error("Hubo un problema al guardar la tarea:", error.message);
  }
}

//funcion para cargar tareas en el Storage
function guardarTareasEnStorage() {
  //pasamos la tareas como texto
  const tareasComoTexto = JSON.stringify(gestor.tareas);

  // guardamos el texto en el navegador, con la clave tareas
  localStorage.setItem("tareas", tareasComoTexto);
}

//recuperarmos las tareas del estoraje
function cargarTareasDeStorage() {
  // buscamos si hay guardadas algunas tareas
  const tareasGuardadas = localStorage.getItem("tareas");

  if (tareasGuardadas) {

    //pasamos el texto a Js
    const tareasArray = JSON.parse(tareasGuardadas);

    //convertimos las fechas a Date de nuevo
    tareasArray.forEach((tarea) => {
      tarea.fchCreacion = new Date(tarea.fchCreacion);
      tarea.fechaLimite = new Date(tarea.fechaLimite);
    });

    // pasamos las tareas del storage a gesto de tareas para mostrarlas de nuevo
    gestor.tareas = tareasArray;
  }
}

//esta funcion se ejecuta cuando cargamos la pagina
async function iniciarApp() {
  //ve si hay algo gurdado con la clave tareas
  const datosGuerdados = localStorage.getItem("tareas")!==null;

  // recuperamos la tareas
  cargarTareasDeStorage();

  //si no se guardo nada antes buscamos las tareas de la api
  if (!datosGuerdados) {

    //buscamos las tareas de la api
    const tareasDeAPI = await obtenerTareasDeAPI();

    // Recorremos las tareas que nos devolvió la API
    tareasDeAPI.forEach((tareaAPI) => {
      // tareaAPI.title es el texto de la tarea en JSONPlaceholder.
      //por defecto estas tareas estan vencidas
      gestor.agregarTarea(tareaAPI.title, new Date().toISOString());
    });
    //guerdamos estas tareas
    guardarTareasEnStorage();
  }

  //creamos el HTML con los datos de la tareas
  crearTareasHTML();
}
//llamamos a la funcion cuando cargue la pagina
iniciarApp(); 