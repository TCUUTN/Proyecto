import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Cambiar.modulo.css";

function CambiarClave() {
  // Estados para manejar los valores y errores del formulario
  const [currentPassword, setCurrentPassword] = useState(""); // Contraseña actual del usuario
  const [newPassword, setNewPassword] = useState(""); // Nueva contraseña del usuario
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmación de la nueva contraseña
  const [CorreoElectronico, setCorreoElectronico] = useState(""); // Correo electrónico del usuario
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Controlar visibilidad de la contraseña actual
  const [showNewPassword, setShowNewPassword] = useState(false); // Controlar visibilidad de la nueva contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Controlar visibilidad de la confirmación de contraseña
  const [error, setError] = useState(""); // Mensaje de error general
  const [passwordErrors, setPasswordErrors] = useState([]); // Errores de validación de la nueva contraseña
  const [isFormValid, setIsFormValid] = useState(false); // Controlar si el formulario es válido para habilitar el botón de envío

  // Cargar el correo electrónico almacenado en sessionStorage al montar el componente
  useEffect(() => {
    const storedCorreo = sessionStorage.getItem("CorreoElectronico");

    if (storedCorreo) {
      setCorreoElectronico(storedCorreo);
    }
  }, []);

  // Mostrar notificación si la contraseña se cambió exitosamente
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

  // Funciones para alternar la visibilidad de las contraseñas
  const toggleShowCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Función para validar la nueva contraseña
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
 // Manejar el cambio en el campo de la nueva contraseña
  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    const errors = validatePassword(newPassword);
    setPasswordErrors(errors);
    validateForm(errors, newPassword, confirmPassword);
  };

  // Manejar el cambio en el campo de confirmación de contraseña
  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    validateForm(passwordErrors, newPassword, confirmPassword);
  };
  // Validar el formulario en base a los errores de contraseña y la confirmación
  const validateForm = (passwordErrors, newPassword, confirmPassword) => {
    const isValid =
      passwordErrors.length === 0 &&
      newPassword === confirmPassword &&
      newPassword !== "" &&
      confirmPassword !== "";
    setIsFormValid(isValid);
  };
// Manejar el envío del formulario
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
        setError(
          "Error al cambiar la contraseña, por favor verificar los datos"
        );
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <div className="cambio-container">
      <div className="cambio-form">
        <h1 className="cambic-title ">Restablecer contraseña</h1>
        <div className="cambic-linea" />
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper-cambic ">
            <label htmlFor="currentPassword" className="input-label-cambic ">
              Introduzca su contraseña temporal:
            </label>
            <div className="input-container-cambic ">
              <RiLockPasswordFill className="icon-cambic" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                placeholder="Contraseña actual"
                className="inputs-cambic "
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span
                className="icon2-cambic "
                onClick={toggleShowCurrentPassword}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="input-wrapper-cambic ">
            <label htmlFor="newPassword" className="input-label-cambic ">
              Introduzca su nueva contraseña:
            </label>
            <div className="input-container-cambic ">
              <RiLockPasswordFill className="icon-cambic" />
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                className="inputs-cambic "
                placeholder="Contraseña nueva"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <span className="icon2-cambic " onClick={toggleShowNewPassword}>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordErrors.length > 0 && (
              <ul className="error-list">
                {passwordErrors.map((error, index) => (
                  <li key={index} className="error-message">
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-wrapper-cambic ">
            <label htmlFor="confirmPassword" className="input-label-cambic ">
              Confirmar contraseña:
            </label>
            <div className="input-container-cambic ">
              <RiLockPasswordFill className="icon-cambic" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                className="inputs-cambic "
                onChange={handleConfirmPasswordChange}
              />
              <span
                className="icon2-cambic "
                onClick={toggleShowConfirmPassword}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {confirmPassword !== newPassword && (
              <p className="error-message">Las contraseñas no coinciden</p>
            )}
          </div>

          <button
            type="submit"
            className="cambiar-button"
            disabled={!isFormValid}
          >
            Guardar <FaSave />
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default CambiarClave;
