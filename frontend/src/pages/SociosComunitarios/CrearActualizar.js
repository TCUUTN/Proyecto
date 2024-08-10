/* eslint-disable react-hooks/exhaustive-deps */
// Importación de módulos de React y otras librerías necesarias
import React, { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa6"; // Icono de flecha izquierda de FontAwesome
import { useNavigate } from "react-router-dom"; // Hook para navegación de rutas
import { FaSave } from "react-icons/fa"; // Icono de guardar de FontAwesome
import { toast, ToastContainer } from "react-toastify";

import "./CrearActuSocioCom.css";// Importación de estilos CSS específicos

// Componente principal que gestiona la creación y edición de socios comunitarios
function CrearActuSocioComunitarios() {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    NombreSocio: "",
    CorreoElectronicoSocio: "",
    TipoInstitucion: "",
    TelefonoSocio: "",
    DireccionSocio: "",
    UbicacionGPS: "",
    NombreCompletoContacto: "",
    Puesto: "",
    CorreoElectronicoContacto: "",
    TelefonoContacto: "",
    Estado: "1",  // Estado por defecto a "Activo"
  });
 // Estado para almacenar los errores del formulario
 const [formErrors, setFormErrors] = useState({});

 // Estado para verificar si el formulario es válido
 const [isFormValid, setIsFormValid] = useState(false);

 // Estado para almacenar el título de la página
 const [title, setTitle] = useState("Crear Socio Comunitario");

 // Estado para mostrar pantalla de carga
 const [loading, setLoading] = useState(false);

 // Estado para verificar si se está creando o editando un socio
 const [isCreating, setIsCreating] = useState(true);

// useEffect que se ejecuta al montar el componente
  // Verifica si se está editando un socio o creando uno nuevo
  useEffect(() => {
    // Obtiene el ID del socio seleccionado del almacenamiento local
    const socioIdSeleccionado = localStorage.getItem("SocioIdSeleccionado");
  // Si hay un socio seleccionado, se está editando
  if (socioIdSeleccionado) {
    setTitle("Editar Socio Comunitario"); // Cambia el título a "Editar"
    setIsCreating(false); // Cambia el estado a false ya que no se está creando un nuevo socio
     // Fetch para obtener los datos del socio desde el servidor
    fetch(`/socios/${socioIdSeleccionado}`)
        .then((response) => response.json()) // Convierte la respuesta a JSON
        .then((data) => {
          // Actualiza el estado del formulario con los datos recibidos
          setFormData({
            NombreSocio: data.NombreSocio,
            CorreoElectronicoSocio: data.CorreoElectronicoSocio,
            TipoInstitucion: data.TipoInstitucion,
            TelefonoSocio: data.TelefonoSocio,
            DireccionSocio: data.DireccionSocio,
            UbicacionGPS: data.UbicacionGPS,
            NombreCompletoContacto: data.NombreCompletoContacto,
            Puesto: data.Puesto,
            CorreoElectronicoContacto: data.CorreoElectronicoContacto,
            TelefonoContacto: data.TelefonoContacto,
            Estado: data.Estado,
          });
        })
        .catch((error) => {
           // Manejo de errores en la obtención de datos del socio
          toast.error("Error fetching socio data:", error);
        });
    } else {
      // Si no hay un socio seleccionado, se asegura que el estado sea "Activo"
      setFormData((prevFormData) => ({ ...prevFormData, Estado: "1" }));
    }
  }, []);
 // useEffect que se ejecuta cada vez que cambian los datos del formulario
  // Valida el formulario cuando hay cambios
  useEffect(() => {
    validateForm();
  }, [formData]);

 // Función para validar los datos del formulario
  const validateForm = () => {
    const errors = {};
    // Validación para el nombre del socio
    if (!formData.NombreSocio || formData.NombreSocio.length < 3) {
      errors.NombreSocio = "Nombre de socio es requerido y debe tener al menos 3 caracteres";
    }

    // Validación para el correo electrónico del socio
    if (!formData.CorreoElectronicoSocio || !/\S+@\S+\.\S+/.test(formData.CorreoElectronicoSocio)) {
      errors.CorreoElectronicoSocio = "Correo electrónico de socio es requerido y debe ser válido";
    }

    // Validación para el tipo de institución
    if (!formData.TipoInstitucion || formData.TipoInstitucion.length < 3) {
      errors.TipoInstitucion = "Tipo de institución es requerido y debe tener al menos 3 caracteres";
    }

    // Validación para el teléfono del socio
    if (!formData.TelefonoSocio || formData.TelefonoSocio.length < 3) {
      errors.TelefonoSocio = "Teléfono de socio es requerido y debe tener al menos 3 caracteres";
    }

    // Validación para la dirección del socio
    if (!formData.DireccionSocio || formData.DireccionSocio.length < 3) {
      errors.DireccionSocio = "Dirección exacta es requerida y debe tener al menos 3 caracteres";
    }

    // Validación para la ubicación GPS del socio
    if (!formData.UbicacionGPS || formData.UbicacionGPS.length < 3) {
      errors.UbicacionGPS = "Ubicación GPS es requerida y debe tener al menos 3 caracteres";
    }

    // Validación para el nombre completo del contacto
    if (!formData.NombreCompletoContacto || formData.NombreCompletoContacto.length < 3) {
      errors.NombreCompletoContacto = "Nombre completo es requerido y debe tener al menos 3 caracteres";
    }

    // Validación para el puesto del contacto
    if (!formData.Puesto || formData.Puesto.length < 3) {
      errors.Puesto = "Puesto es requerido y debe tener al menos 3 caracteres";
    }

    // Validación para el correo electrónico del contacto
    if (!formData.CorreoElectronicoContacto || !/\S+@\S+\.\S+/.test(formData.CorreoElectronicoContacto)) {
      errors.CorreoElectronicoContacto = "Correo electrónico personal es requerido y debe ser válido";
    }

    // Validación para el teléfono del contacto
    if (!formData.TelefonoContacto || formData.TelefonoContacto.length < 3) {
      errors.TelefonoContacto = "Teléfono personal es requerido y debe tener al menos 3 caracteres";
    }

    // Validación para el estado del socio
    if (!formData.Estado) {
      errors.Estado = "Estado es requerido";
    }
 // Actualiza el estado de los errores y valida si el formulario es correcto
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };
// Función que maneja el evento de clic para regresar a la lista de socios comunitarios
const handleBackClick = () => {
  localStorage.removeItem("SocioIdSeleccionado"); // Elimina el ID seleccionado del almacenamiento local
  navigate("/SocioComunitarios"); // Navega a la ruta de lista de socios
};
  // Función que maneja el cambio de los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target; // Desestructura el nombre y valor del input
    setFormData({ ...formData, [name]: value }); // Actualiza el estado del formulario
  };
  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    setLoading(true); // Muestra pantalla de carga
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
     // Si el formulario no es válido, termina la ejecución
    if (!isFormValid) {
      return;
    }
 // Obtiene el ID del socio seleccionado del almacenamiento local
 const socioIdSeleccionado = localStorage.getItem("SocioIdSeleccionado");

 // Define la URL para la creación o actualización del socio
 const url = `/socios/crearOActualizarSocio`;

 // Crea el objeto de datos que se enviará al servidor
    const payload = {
      ...formData,
      ...(socioIdSeleccionado && { SocioId: socioIdSeleccionado }), // Incluye el ID si está presente
    };
 // Realiza la petición POST para guardar o actualizar el socio
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Especifica que los datos son JSON
      },
      body: JSON.stringify(payload), // Convierte el objeto a una cadena JSON
    })
      .then((response) => {
        if (response.ok) {
          // Si la respuesta es correcta, elimina el ID del almacenamiento local y navega a la lista de socios
          localStorage.removeItem("SocioIdSeleccionado");
          localStorage.setItem("SocioGuardado", "true"); // Marca que el socio fue guardado correctamente
          setLoading(false); // Oculta pantalla de carga
          navigate("/SocioComunitarios"); // Navega a la lista de socios
        } else {
          // Si la respuesta no es correcta, lanza un error con el texto de la respuesta
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
      })
      .catch((error) => {
        // Manejo de errores en la petición
        toast.error("Error saving socio:", error);
        // Mostrar notificación de error aquí (opcional)
        setLoading(false);  // Oculta pantalla de carga
      });
  };
// Renderiza el formulario y la interfaz del componente
  return (
    <div className="creaedsocio-container">
          <ToastContainer position="bottom-right" />
      {loading && <div className="loading-overlay"><div className="loading-spinner"></div></div>}
      <div className="creaedsocio-content">
        <h1 className="creaedsocio-title">{title}</h1>
        <div className="creaedsocio-divider" />
        <form onSubmit={handleSubmit}>
          {/* Información de la Institución */}
          <div className="creaedsocio-section">
            <h3 className="creaedsocio-subt">Información de la Institución:</h3>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="NombreSocio"
                name="NombreSocio"
                placeholder="Nombre Socio"
                className="creaedsocio-input"
                value={formData.NombreSocio}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.NombreSocio && (
                <span className="error-creaedsocio">{formErrors.NombreSocio}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="email"
                id="CorreoElectronicoSocio"
                name="CorreoElectronicoSocio"
                placeholder="Correo Electrónico de la Institución"
                className="creaedsocio-input"
                value={formData.CorreoElectronicoSocio}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.CorreoElectronicoSocio && (
                <span className="error-creaedsocio">{formErrors.CorreoElectronicoSocio}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="TipoInstitucion"
                name="TipoInstitucion"
                placeholder="Tipo de institución"
                className="creaedsocio-input"
                value={formData.TipoInstitucion}
                onChange={handleChange}
              />
             <br></br>
              {formErrors.TipoInstitucion && (
                <span className="error-creaedsocio">{formErrors.TipoInstitucion}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="tel"
                id="TelefonoSocio"
                name="TelefonoSocio"
                placeholder="Teléfono de la institución"
                className="creaedsocio-input"
                value={formData.TelefonoSocio}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.TelefonoSocio && (
                <span className="error-creaedsocio">{formErrors.TelefonoSocio}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="DireccionSocio"
                name="DireccionSocio"
                placeholder="Dirección exacta de la institución"
                className="creaedsocio-input"
                value={formData.DireccionSocio}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.DireccionSocio && (
                <span className="error-creaedsocio">{formErrors.DireccionSocio}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="UbicacionGPS"
                name="UbicacionGPS"
                placeholder="Ubicación GPS"
                className="creaedsocio-input"
                value={formData.UbicacionGPS}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.UbicacionGPS && (
                <span className="error-creaedsocio">{formErrors.UbicacionGPS}</span>
              )}
            </div>
          </div>
          {/* Contacto del Socio */}
          <div className="creaedsocio-section">
            <h3 className="creaedsocio-subt">Contacto del Socio:</h3>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="NombreCompletoContacto"
                name="NombreCompletoContacto"
                placeholder="Nombre Completo del contacto"
                className="creaedsocio-input"
                value={formData.NombreCompletoContacto}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.NombreCompletoContacto && (
                <span className="error-creaedsocio">{formErrors.NombreCompletoContacto}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="Puesto"
                name="Puesto"
                placeholder="Puesto del contacto"
                className="creaedsocio-input"
                value={formData.Puesto}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.Puesto && (
                <span className="error-creaedsocio">{formErrors.Puesto}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="email"
                id="CorreoElectronicoContacto"
                name="CorreoElectronicoContacto"
                placeholder="Correo Electrónico del contacto"
                className="creaedsocio-input"
                value={formData.CorreoElectronicoContacto}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.CorreoElectronicoContacto && (
                <span className="error-creaedsocio">{formErrors.CorreoElectronicoContacto}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="tel"
                id="TelefonoContacto"
                name="TelefonoContacto"
                placeholder="Teléfono del Contacto"
                className="creaedsocio-input"
                value={formData.TelefonoContacto}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.TelefonoContacto && (
                <span className="error-creaedsocio">{formErrors.TelefonoContacto}</span>
              )}
            </div>
          </div>
          {/* Información Otros */}
          {!isCreating && (
            <div className="creaedsocio-section">
              <h3 className="creaedsocio-subt">Información Otros:</h3>
              <div className="creaedsocio-group">
                <select
                  id="Estado"
                  name="Estado"
                  className="creaedsocio-input"
                  value={formData.Estado}
                  onChange={handleChange}
                >
                  <option value="">Todos</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
                <br></br>
                {formErrors.Estado && (
                  <span className="error-creaedsocio">{formErrors.Estado}</span>
                )}
              </div>
            </div>
          )}
          {/* Botones */}
          <div className="creaedsocio-buttons">
            <button
              type="button"
              className="creaedsocio-button"
              onClick={handleBackClick}
            >
              <FaChevronLeft />
              Regresar
            </button>
            <button
              type="submit"
              className="creaedsocio-button"
              disabled={!isFormValid}
            >
              Guardar <FaSave />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearActuSocioComunitarios;
