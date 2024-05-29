import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Monitorea, controla y da seguimiento a las</h1>
        <h1 className="home-title">actividades, tareas y productos de los</h1>
        <h1 className="home-title">estudiantes en sus proyectos de TCU de</h1>
        <h1 className="home-title">manera detallada y eficiente.</h1>
      </div>

      <div className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form>
          <label htmlFor="username">Nombre de usuario:</label>
          <input type="text" id="username" name="username" />

          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" />

          <button type="submit">Acceder</button>

          <p>¿Olvidó su contraseña?</p>
        </form>
      </div>
    </div>
  );
}

export default Home;
