/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardAcademico from "./DashboardAcademico";
import DashboardAdministrativo from "./DashboardAdministrativo";
import DashboardEstudiante from "./DashboardEstudiante";

function Home() {
  const [selectedRole, setSelectedRole] = useState("");


  useEffect(() => {
    const role = sessionStorage.getItem("SelectedRole");
    if (role) {
      setSelectedRole(role);
    }

    
  }, []); // Dependencias incluidas para asegurar que se ejecuten correctamente

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
