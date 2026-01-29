document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000";
    const token = localStorage.getItem("token");

    // Redirigir al login si no hay token
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // REGISTRO DESDE EL FORMULARIO 
    const form = document.getElementById("contacto");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const correo = document.getElementById("correo").value;
            const actividad = document.getElementById("actividad").value;

            try {
                const res = await fetch(`${API_URL}/api/registros`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // cualquier usuario logueado puede registrar
                    },
                    body: JSON.stringify({ nombre, correo, actividad })
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.mensaje);
                    form.reset();
                } else {
                    alert(data.mensaje || "Error al registrar");
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Error al conectar con el servidor");
            }
        });
    }

    // FUNCIONES CRUD

    // Obtener todos los registros
    async function getRegistros() {
        try {
            const res = await fetch(`${API_URL}/api/registros`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return await res.json();
        } catch (err) {
            console.error("Error GET registros:", err);
        }
    }

    // Actualizar un registro por ID
    async function updateRegistro(id, data) {
        try {
            const res = await fetch(`${API_URL}/api/registros/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (err) {
            console.error("Error PUT registro:", err);
        }
    }

    // Eliminar un registro por ID
    async function deleteRegistro(id) {
        try {
            const res = await fetch(`${API_URL}/api/registros/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            return await res.json();
        } catch (err) {
            console.error("Error DELETE registro:", err);
        }
    }
});