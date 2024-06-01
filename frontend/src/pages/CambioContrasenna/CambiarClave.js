import React, { useState } from 'react';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Cambiar.modulo.css';

function CambiarClave(){
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div className="cambio-container">
            <div className="cambio-form">
                <h1 className="title">Restablecer contraseña</h1>
                <hr className="Title-linea" />
                <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
            <label htmlFor="currentPassword" className="input-label">
              Introduzca su contraseña temporal:
            </label>
            <div className="input-container">
              <RiLockPasswordFill className="icon-candado" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                placeholder="Contraseña actual"
                className="inputs"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span className="icon2" onClick={toggleShowCurrentPassword}>
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="input-wrapper">
            <label htmlFor="newPassword" className="input-label">
              Introduzca su nueva contraseña:
            </label>
            <div className="input-container">
              <RiLockPasswordFill className="icon-candado" />
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Contraseña nueva"
      
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span className="icon2" onClick={toggleShowNewPassword}>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
                    <div className="input-wrapper">
            <label htmlFor="confirmPassword" className="input-label">
              Confirmar contraseña:
            </label>

            <div className="input-container">
              <RiLockPasswordFill className="icon-candado" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
             
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="icon2" onClick={toggleShowConfirmPassword}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

                    <button type="submit" className="login-button">Guardar cambios</button>
                </form>
            </div>
        </div>
    );
}

export default CambiarClave;
