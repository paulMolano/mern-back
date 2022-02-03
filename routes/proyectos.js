//Rutas para CRUD proyectos
const express = require("express");
const router = express.Router();
const {
  crearProyecto,
  obtenerProyectos,
  actualizarProyecto,
  eliminarProyecto,
} = require("../controllers/proyectoController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//Crear un proyecto
// /api/proyectos
router.post(
  "/",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  crearProyecto
);

//Obtener todos los proyectos
router.get("/", auth, obtenerProyectos);

//Actualizar un proyectoviaid
router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  actualizarProyecto
);

//Eliminar un proyectoviaid
router.delete("/:id", auth, eliminarProyecto);

module.exports = router;
