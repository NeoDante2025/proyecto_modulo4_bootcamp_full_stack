/* ============================================================
   PROYECTO FINAL - MÓDULO 4: Programación en JavaScript Avanzado
   ============================================================ */

/* =============================================================
OBJETIVOS: 
1-Crear, Editar, Eliminar Tareas
2-Utilizar eventos
3-Manejar Datos de forma asincrona
4-Integracion de APIS para su consumo 
=============================================================== */
class TareasClass {
  //el ID comineza en 1,2,3....
  static #IDgene = 1;
  constructor(descripcion, fechaLimite) {
    //se genera el id por aca nueva tarea que se crea de forma incremental
    this.id = TareasClass.#generarID();
    this.descripcion = descripcion;
    //cada tarea que se crea empiza como bloqueada y luego se cambiar su estado a activa
    this.estado = "Bloqueada";
    //usamos la fecha actual de creacion
    this.fchCreacion = new Date();
    //fecha limite de la tarea
    this.fechaLimite = new Date(fechaLimite);//fecha elegida por el user
  }
  //metodo exclusivo del la clase TareasClass para crear el id
  static #generarID() {
    return TareasClass.#IDgene++;
  }

  modificarEstadoTarea() {
    //aca se uso el operador terniario, que se aprendio en clases
    //esto lo que hace es cuando se crea un tarea la bloquea he inmeditamente la activa
    //luego si se quieres modificar solo se llama la funciony cambia el estado a bloqueada
    //esto lo uso cuando tengo una variable que solo tiene dos estados para mas estado hacen falta mas procedimientos
    this.estado = this.estado === "Bloqueada" ? "Activa" : "Bloqueada";
    console.log(`La Tarea${this.descripcion} ahora esta: ${this.estado}`);
  }
}
//clase para gestion de tareas
class GestorTareas {
  //arreglo que contiene la tareas
  tareas = [];
  //mtodo para agregar un nueva tarea, con una descripcion
  agregarTarea(descripcion, fechaLimite) {
    //creamos la nueva tarea con su descripcion
    const newTarea = new TareasClass(descripcion, fechaLimite );
    //la agreamos con push
    this.tareas.push(newTarea);
    //console.log(`Se agrego la tarea ${descripcion} con fecha: ${fechaLimite}`);
    return newTarea;
  }
  //metodo para editar el estado de una tarea segun un ID
  editarEstadoTarea(idTarea) {
    //recoremos el array de tareas y buscamos la coincidencia y llamos a la funcion que
    //cambia el estado de la tarea
    this.tareas.forEach((tarea) => {
      if (tarea.id == idTarea) {
        //si encuentra el id
        tarea.modificarEstadoTarea();
      }
    });
  }

  //metodo para elimnar una tarea a partir de un Id
  eliminarTarea(idTarea) {
    //buscamos la tarea con id pasado por la funcion y con el filter creamo un nuevo arrey con la tareas que cumple dicha
    //condicion y lo asignamos a this.tarea.
    this.tareas = this.tareas.filter((tareaD) => tareaD.id !== idTarea);
    console.log(`La tarea N!°: ${idTarea}  ha sido eliminada.`);
  }

  obtenerTareas() {
    this.tareas.forEach((tarea) => {
      //aplicamos Destructuring y sacamos cada dato de la tarea
      const { id, descripcion, estado } = tarea;
      console.log(`${id}: ${descripcion} en estado: ${estado}`);
    });
    //aplicamos Spread: devolvemos una copia del array, no la referencia original
    return [...this.tareas];
  }
}

// Exportamos todas las clases juntas, al final del archivo
export { TareasClass, GestorTareas };
//para mostrar por consola 
/*
const gestor = new GestorTareas();
//creamos dos tareas
const t1 = gestor.agregarTarea("Tarea crea clase Tarea");
const t2 = gestor.agregarTarea("Tarea crear clase GestorTareas");

gestor.obtenerTareas();
console.log("Editamos tarea 1")
gestor.editarEstadoTarea(1);
console.log("Lista tareas")
gestor.obtenerTareas();
console.log("Eliminamos tarea 1")
gestor.eliminarTarea(1);
gestor.obtenerTareas();

const resultado = gestor.obtenerTareas();

console.log("Esto es lo que devolvio la funcion:", resultado);
***/


