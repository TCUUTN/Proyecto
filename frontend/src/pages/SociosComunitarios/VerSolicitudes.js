import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { RiMailSendLine } from "react-icons/ri";
import "./VerSolicitud.css";

function VerSolicitudes() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    localStorage.removeItem("SolicitudIdSeleccionada");
    navigate("/SolicitudCartas");
  };
  return (

    
    <div className="versolicart-container">
      {/*En el titulo que solo se muestre el nombre del socio y se quita Socio seleccionado*/}
      <h1 className="title-versolicart">Socio Seleccionado:</h1>
      <div className="versolicart-divider" />
      <div className="content-versolicart">
        <div className="left-versolicart">
          <h2 className="subtitle-versolicart">Estudiantes Seleccionados</h2>
          {/* Tabla*/}
          <table className="table-versolicart">
            <thead className="thead-versolicart">
              <tr>
                <th>Nombre Completo</th>
              </tr>
            </thead>
            <tbody className="tbody-versolicart">
              <tr>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="versolicart-divider-vertical"></div>
        {/* Lado derecho*/}
        <div className="right-versolicart">
          <h2 className="subtitle-versolicart">Adjuntar Carta</h2>
          <form className="form-versolicart">
            <input className="fileinput-versolicart" type="file" />
         
            <div className="buttons-versolicart">
              <button
                className="back-button-versolicart"
                type="button"
                onClick={handleBackClick}
              >
                <FaChevronLeft />
                Regresar
              </button>
              <button className="submit-button-versolicart" type="submit">
               Enviar Carta  &nbsp;
               <RiMailSendLine />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerSolicitudes;
