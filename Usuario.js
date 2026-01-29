const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash del password antes de guardar
usuarioSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar passwords
usuarioSchema.methods.compararPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Usuario", usuarioSchema);