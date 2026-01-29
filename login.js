const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token); 
      window.location.href = "index.html";
    } else {
      document.getElementById("error").textContent = data.error || "Error en el login";
    }

  } catch (err) {
    console.error(err);
  }
});