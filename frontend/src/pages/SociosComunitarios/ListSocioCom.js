import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import "./SocioCom.css";

function SocioComunitarios() {
  const [currentPage, setCurrentPage] = useState(1);
  const [socios, setSocios] = useState([]);
  const [filteredSocios, setFilteredSocios] = useState([]);
  const [filters, setFilters] = useState({
    institucion: "",
    contacto: "",
    tipoInstitucion: "",
    estado: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch socios data from backend
    fetch("/socios/")
      .then(response => response.json())
      .then(data => {
        setSocios(data);
        
        setFilteredSocios(data);
        
      });
      console.log(filteredSocios)
  }, []);

  const handleAddUser = () => {
    navigate("/CrearActuSocioComunitarios");
  };

  const handleEditUser = (socioId) => {
    localStorage.setItem("SocioIdSeleccionado", socioId);
    navigate("/CrearActuSocioComunitarios");
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = socios;

      if (filters.institucion) {
        filtered = filtered.filter(socio =>
          socio.NombreSocio.toLowerCase().includes(filters.institucion.toLowerCase())
        );
      }

      if (filters.contacto) {
        filtered = filtered.filter(socio =>
          socio.NombreCompletoContacto.toLowerCase().includes(filters.contacto.toLowerCase())
        );
      }

      if (filters.tipoInstitucion) {
        filtered = filtered.filter(socio =>
          socio.TipoInstitucion.toLowerCase().includes(filters.tipoInstitucion.toLowerCase())
        );
      }

      if (filters.estado !== "") {
        filtered = filtered.filter(socio =>
          String(socio.Estado) === filters.estado
        );
      }

      setFilteredSocios(filtered);
    };

    applyFilters();
  }, [filters, socios]);

  return (
    <div className="sociocomunitario-container">
      <main>
        <div className="sociocomu-sidebar">
          <div className="action-sociocomu">
            <button className="add-sociocomu" onClick={handleAddUser}>
              Agregar <IoMdAddCircle className="icon-socio" />
            </button>
            <div className="socio-divider" />
            <h1 className="sociocomu-titulo">Socios Comunitarios</h1>
          </div>
        </div>

        <div className="solicitud-section">
          <div className="filters-sociocomu">
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">Buscar Nombre Institución</label>
              <input
                type="text"
                name="institucion"
                placeholder="Nombre Institución"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={filters.institucion}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">Buscar Contacto</label>
              <input
                type="text"
                name="contacto"
                placeholder="Nombre Completo"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={filters.contacto}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">Tipo de Institución</label>
              <input
                type="text"
                name="tipoInstitucion"
                placeholder="Tipo de Institución"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={filters.tipoInstitucion}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">Estado</label>
              <select
                name="estado"
                className="filter-control-sociocomu filter-select-sociocomu"
                value={filters.estado}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="1">Activos</option>
                <option value="0">Inactivos</option>
              </select>
            </div>
          </div>

          <div className="table-container-sociocomu">
            <table className="table-sociocomu">
              <thead className="thead-sociocomu">
                <tr>
                  <th>Nombre del Socio</th>
                  <th>Informacion del Socio</th>
                  <th>Direccion</th>
                  <th>Tipo de Institucion</th>
                  <th>Nombre del Contacto</th>
                  <th>Informacion del Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="tbody-sociocomu">
                {filteredSocios.map((socio) => (
                  <tr key={socio.SocioId}>
                    <td>{socio.NombreSocio}</td>
                    <td>
                      <a href={`mailto:${socio.CorreoElectronicoSocio}`}>{socio.CorreoElectronicoSocio}</a>
                      <br />
                      {socio.TelefonoSocio}
                    </td>
                    <td>{socio.DireccionSocio}</td>
                    <td>{socio.TipoInstitucion}</td>
                    <td>{socio.NombreCompletoContacto}</td>
                    <td>
                      <a href={`mailto:${socio.CorreoElectronicoContacto}`}>{socio.CorreoElectronicoContacto}</a>
                      <br />
                      {socio.TelefonoContacto}
                    </td>
                    <td>
                      <button className="icon-btn--sociocomu" onClick={() => handleEditUser(socio.SocioId)}>
                        <RiEdit2Fill />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-sociocomu">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>Página {currentPage}</span>
              <button onClick={handleNextPage} disabled={filteredSocios.length <= currentPage * 10}>
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SocioComunitarios;
