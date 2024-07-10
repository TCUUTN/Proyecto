import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionMonitor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      // Verifica la existencia de las variables de sessionStorage que necesitas
      const identificacion = sessionStorage.getItem('Identificacion');
      const selectedRole = sessionStorage.getItem('SelectedRole');
      // Ejemplo de condiciones de verificación (puedes ajustar según tus necesidades)
      if (!identificacion || !selectedRole) {
        // Redirige a la página de inicio de sesión
        navigate('/'); // Ajusta la ruta según tu configuración
      }
    };

    // Verifica al cargar el componente y cada vez que cambie el sessionStorage
    checkSession();
    window.addEventListener('storage', checkSession);

    return () => {
      window.removeEventListener('storage', checkSession);
    };
  }, [navigate]);

  return null;
};

export default SessionMonitor;
