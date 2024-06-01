import React from "react";
import { MdEmail } from "react-icons/md";
import './Olvidar.css';

function OlvidarClave() {
  return (
    <div className="olvidar-container">
      <div className="olvidar-form">
        <h1 className="title">¿Olvidaste tu contraseña?</h1>
        <hr className="Title-linea" />
        <form >
        <div className="input-wrapper">
        <label htmlFor="currentPassword" className="input-label">
        Por favor, ingresa tu dirección de correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </label> 
            <div className="input-container">
            <MdEmail  className="icon-email"/>
            <input 
              type="text" 
              id="email" 
              name="email" 
              placeholder="Correo electronico"
            />
          </div> 
        </div>
        <button type="submit" className="olvidar-button">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default OlvidarClave;
