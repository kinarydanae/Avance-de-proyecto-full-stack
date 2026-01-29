const express = require("express"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("./models/Usuario"); // Modelo de usuario

const router = express.Router();

// registro
router.post("/register", async (req, res, next) => {
  try {
    const { nombre, correo, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    // Crear nuevo usuario
    const usuario = new Usuario({ nombre, correo, password });
    await usuario.save();

    res.status(201).json({ mensaje: "Usuario creado exitosamente" });
  } catch (err) {
    next(err); // Pasar el error al middleware global
  }
});

// Login 
router.post("/login", async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

    // Verificar contraseña
    const esValido = await usuario.compararPassword(password);
    if (!esValido) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // El token expira en 1 hora
    );

    res.json({ token });
  } catch (err) {
    next(err); // Pasar el error al middleware global
  }
});

module.exports = router;