import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Cambiar.modulo.css";

function CambiarClave() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [CorreoElectronico, setCorreoElectronico] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const storedCorreo = sessionStorage.getItem("CorreoElectronico");

    if (storedCorreo) {
      setCorreoElectronico(storedCorreo);
    }
  }, []);

  useEffect(() => {
    const showNotificationAfterRedirect = () => {
      const params = new URLSearchParams(window.location.search);
      const cambioExitoso = params.get("cambioExitoso");
      if (cambioExitoso === "true") {
        toast.success("¡La contraseña ha sido actualizada correctamente!");
      }
    };

    showNotificationAfterRedirect();
  }, []);

  const toggleShowCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Debe tener al menos 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Debe tener al menos una letra mayúscula");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Debe tener al menos una letra minúscula");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Debe tener al menos un número");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Debe tener al menos un carácter especial");
    }
    return errors;
  };

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    const errors = validatePassword(newPassword);
    setPasswordErrors(errors);
    validateForm(errors, newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    validateForm(passwordErrors, newPassword, confirmPassword);
  };

  const validateForm = (passwordErrors, newPassword, confirmPassword) => {
    const isValid = 
      passwordErrors.length === 0 && 
      newPassword === confirmPassword &&
      newPassword !== "" && 
      confirmPassword !== "";
    setIsFormValid(isValid);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/usuarios/actualizarContrasenna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorreoElectronico: CorreoElectronico,
          ContrasennaAntigua: currentPassword,
          ContrasennaNueva: newPassword,
          ConfirmacionContrasenna: confirmPassword,
        }),
      });

      if (response.ok) {
        window.location.href = "/Home?cambioExitoso=true";
      } else {
        setError("Error al cambiar la contraseña, por favor verificar los datos");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
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
              <RiLockPasswordFill className="icon" />
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
              <RiLockPasswordFill className="icon" />
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Contraseña nueva"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <span className="icon2" onClick={toggleShowNewPassword}>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordErrors.length > 0 && (
              <ul className="error-list">
                {passwordErrors.map((error, index) => (
                  <li key={index} className="error-message">{error}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-wrapper">
            <label htmlFor="confirmPassword" className="input-label">
              Confirmar contraseña:
            </label>
            <div className="input-container">
              <RiLockPasswordFill className="icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <span className="icon2" onClick={toggleShowConfirmPassword}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {confirmPassword !== newPassword && (
              <p className="error-message">Las contraseñas no coinciden</p>
            )}
          </div>

          <button type="submit" className="login-button" disabled={!isFormValid}>
            Guardar cambios
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default CambiarClave;