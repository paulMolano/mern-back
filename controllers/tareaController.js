const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer el proyecto y comprobar si existe

  try {
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      res.status(401).json({ msg: "No Autorizado" });
    }

    //Creamos la tarea
    const tarea = new Tarea(req.body);

    await tarea.save();

    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Hubo un error en el servidor" });
  }
};

//Obtener las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    //Extraer proyecto y comprobar que existe
    const { proyecto } = req.query;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      res.status(401).json({ msg: "No Autorizado" });
    }

    const tareas = await Tarea.find({ proyecto }).sort({
      creado: -1,
    });

    res.json(tareas);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Hubo un error" });
  }
};

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    //Extraer proyecto y comprobar que existe
    const { proyecto, nombre, estado } = req.body;

    //Revisar si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      res.status(404).json({ msg: "Tarea inexistente" });
    }

    //Extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    //revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      res.status(401).json({ msg: "No Autorizado" });
    }

    //Crear un objeto con la nueva información
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    //Guardar la tarea
    tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });

    //retornamos como respuesta el proyecto ya editado
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Hubo un error" });
  }
};

exports.eliminarTarea = async (req, res) => {
  try {
    //Extraer proyecto y comprobar que existe
    const { proyecto } = req.query;

    //Revisar si la tarea existe o no
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      res.status(404).json({ msg: "Tarea inexistente" });
    }

    //Extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    //revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      res.status(401).json({ msg: "No Autorizado" });
    }

    //eliminar
    await Tarea.findOneAndRemove({
      _id: req.params.id,
    });

    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Hubo un error" });
  }
};
