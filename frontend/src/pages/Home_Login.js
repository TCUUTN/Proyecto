import React, { useState } from 'react';
import './Home.css';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/usuarios/credenciales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ CorreoElectronico: username, Contrasenna: password })
      });

      if (response.ok) {
        // Si las credenciales son correctas, redirige a la página Contact.js
        window.location.href = '/contact';
      } else {
        // Si las credenciales son incorrectas, muestra una notificación
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

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
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />

          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />

          <button type="submit" onClick={handleSubmit}>Acceder</button>

          <p>¿Olvidó su contraseña?</p>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Home;
