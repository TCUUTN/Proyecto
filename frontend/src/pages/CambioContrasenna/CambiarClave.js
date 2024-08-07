import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const storedCorreo = sessionStorage.getItem("CorreoElectronico");
    if (storedCorreo) {
      setCorreoElectronico(storedCorreo);
    }
  }, []);

  const toggleShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
    const isValid = passwordErrors.length === 0 && newPassword === confirmPassword && newPassword !== "" && confirmPassword !== "";
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
        localStorage.setItem("cambioExitoso", "true");
        console.log(localStorage.getItem("cambioExitoso"))
        navigate("/Home");
      } else {
        setError("Error al cambiar la contraseña, por favor verificar los datos.");
      }
    } catch (error) {
      toast.error("Error al cambiar la contraseña, por favor verificar los datos: " + error.message);
    }
  };

  return (
    <div className="cambio-container">
      <div className="cambio-form">
        <h1 className="cambic-title">Restablecer contraseña</h1>
        <div className="cambic-linea" />
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper-cambic">
            <label htmlFor="currentPassword" className="input-label-cambic">
              Introduzca su contraseña temporal:
            </label>
            <div className="input-container-cambic">
              <RiLockPasswordFill className="icon-cambic" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                placeholder="Contraseña actual"
                className="inputs-cambic"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span className="icon2-cambic" onClick={toggleShowCurrentPassword}>
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="input-wrapper-cambic">
            <label htmlFor="newPassword" className="input-label-cambic">
              Introduzca su nueva contraseña:
            </label>
            <div className="input-container-cambic">
              <RiLockPasswordFill className="icon-cambic" />
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                className="inputs-cambic"
                placeholder="Contraseña nueva"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <span className="icon2-cambic" onClick={toggleShowNewPassword}>
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
          <div className="input-wrapper-cambic">
            <label htmlFor="confirmPassword" className="input-label-cambic">
              Confirmar contraseña:
            </label>
            <div className="input-container-cambic">
              <RiLockPasswordFill className="icon-cambic" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                className="inputs-cambic"
                onChange={handleConfirmPasswordChange}
              />
              <span className="icon2-cambic" onClick={toggleShowConfirmPassword}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="cambiar-button"
            disabled={!isFormValid}
          >
            Guardar <FaSave />
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default CambiarClave;
