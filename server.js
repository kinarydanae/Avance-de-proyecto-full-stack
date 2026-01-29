const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Registro = require("./models/Registro");
const authRoutes = require("./auth");
const { verificarToken } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// VER registros 
app.get("/api/registros", verificarToken, async (req, res, next) => {
  try {
    const registros = await Registro.find();
    res.json(registros);
  } catch (error) {
    next(error);
  }
});

// CREAR registro 
app.post("/api/registros", verificarToken, async (req, res, next) => {
  try {
    const nuevoRegistro = new Registro(req.body);
    await nuevoRegistro.save();
    console.log("Registro guardado:", nuevoRegistro);
    res.status(201).json({ mensaje: "Registro guardado" });
  } catch (error) {
    next(error);
  }
});

// ACTUALIZAR registro 
app.put("/api/registros/:id", verificarToken, async (req, res, next) => {
  try {
    const registroActualizado = await Registro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(registroActualizado);
  } catch (error) {
    next(error);
  }
});

// ELIMINAR registro 
app.delete("/api/registros/:id", verificarToken, async (req, res, next) => {
  try {
    await Registro.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Registro eliminado" });
  } catch (error) {
    next(error);
  }
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado (LOCAL)"))
  .catch(err => console.error("Error MongoDB:", err));

// Manejo de errores
app.use(errorHandler);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});