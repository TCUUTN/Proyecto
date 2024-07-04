import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.module.css";
import DashboardAcademico from "./DashboardAcademico";
import DashboardAdministrativo from "./DashboardAdministrativo";
import DashboardEstudiante from "./DashboardEstudiante";

function Home() {
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cambioExitoso = params.get("cambioExitoso");
    const perfilCompletado = params.get("perfilCompletado");

    if (cambioExitoso === "true") {
      toast.success("¡La contraseña ha sido actualizada correctamente!");
    }

    if (perfilCompletado === "true") {
      toast.success("¡El perfil ha sido completado con éxito!");
    }

    // Leer la variable SelectedRole del sessionStorage
    const role = sessionStorage.getItem("SelectedRole");
    setSelectedRole(role);
  }, []);

  const renderDashboard = () => {
    switch (selectedRole) {
      case "Académico":
        return <DashboardAcademico />;
      case "Administrativo":
        return <DashboardAdministrativo />;
      case "Estudiante":
        return <DashboardEstudiante />;
      default:
        return <p>Selecciona un rol para ver el dashboard correspondiente.</p>;
    }
  };

  return (
    <div>
      {renderDashboard()}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Home;
