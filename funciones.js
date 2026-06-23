// Pasamos 'event' como argumento para que el navegador sepa qué se presionó
function mostrarDiv(event) {
  const botonPresionado = event.target;
  const infoOculta = botonPresionado.nextElementSibling;

  if (infoOculta.style.display === "block") {
    infoOculta.style.display = "none";
  } else {
    infoOculta.style.display = "block";
  }
}

// Listener para controlar el envío del formulario sin recargar la página
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("miFormulario");
  const botonSubmit = document.getElementById("miBoton");

  if (formulario && botonSubmit) {
    formulario.addEventListener("submit", function(event) {
      event.preventDefault(); // Evita que la página se refresque
      
      // Cambiamos temporalmente el texto mientras se envía
      botonSubmit.textContent = "Enviando...";
      botonSubmit.disabled = true;

      // CORRECCIÓN PARA AJAX: Convertimos los datos del formulario a un objeto JSON
      const formData = new FormData(formulario);
      const objetoData = Object.fromEntries(formData.entries());
      const cuerpoJson = JSON.stringify(objetoData);

      // Enviamos de forma asíncrona al servidor de FormSubmit usando la API de AJAX
      fetch(formulario.action, {
        method: "POST",
        body: cuerpoJson,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Verificamos si el usuario ya había enviado un mensaje antes
          if (sessionStorage.getItem("formularioEnviado")) {
            window.location.reload();
          } else {
            sessionStorage.setItem("formularioEnviado", "true");

            // Cambiamos el texto del botón al mensaje de confirmación exitosa
            botonSubmit.textContent = "¡Datos enviados, esperamos contactar con ustedes pronto!";
            formulario.reset(); // Limpia los campos del formulario
            window.alert("Gracias por enviar sus opiniones, nos contactaremos lo antes posible");
          }
        } else {
          botonSubmit.textContent = "Error al enviar";
          botonSubmit.disabled = false;
        }
      })
      .catch(error => {
        console.error("Error:", error);
        botonSubmit.textContent = "Error de conexión";
        botonSubmit.disabled = false;
      });
    });
  } 
});