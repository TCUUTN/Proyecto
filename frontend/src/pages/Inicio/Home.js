import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Home() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cambioExitoso = params.get("cambioExitoso");

    if (cambioExitoso === "true") {
      toast.success("¡La contraseña ha sido actualizada correctamente!");
    }
  }, []);

  return (
    <div>
      <h1>Inicio</h1>
      <p>Los dashboards van aquí</p>
      {/* Contenido de tu página de inicio */}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Home;
