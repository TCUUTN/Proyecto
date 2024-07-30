import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardAcademico from "./DashboardAcademico";
import DashboardAdministrativo from "./DashboardAdministrativo";
import DashboardEstudiante from "./DashboardEstudiante";

// Componente principal de la página de inicio
function Home() {
  // Estado para almacenar el rol de usuario seleccionado
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
     // Obtiene los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const cambioExitoso = params.get("cambioExitoso");
    const perfilCompletado = params.get("perfilCompletado");
// Muestra un mensaje de éxito si se ha actualizado la contraseña o completado el perfil
    if (cambioExitoso === "true") {
      toast.success("¡La contraseña ha sido actualizada correctamente!");
    }

    if (perfilCompletado === "true") {
      toast.success("¡El perfil ha sido completado con éxito!");
    }

   // Lee el rol seleccionado del sessionStorage y lo establece en el estado
    const role = sessionStorage.getItem("SelectedRole");
    setSelectedRole(role);
  }, []);
  // Función para renderizar el dashboard correspondiente según el rol
  const renderDashboard = () => {
    switch (selectedRole) {
      case "Académico":
        return <DashboardAcademico />;
      case "Administrativo":
        return <DashboardAdministrativo />;
      case "Estudiante":
        return <DashboardEstudiante />;
      default:
        // Mensaje mostrado cuando no hay un rol seleccionado
        return <p>Selecciona un rol para ver el dashboard correspondiente.</p>;
    }
  };
// Renderiza el componente
  return (
    <div>
      {renderDashboard()}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Home;
