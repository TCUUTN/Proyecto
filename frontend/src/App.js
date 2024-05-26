import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/usuarios/')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="App">
      <h1>Data from Backend</h1>
      <ul>
        {data.map(item => (
          <li key={item.Identificacion}>{item.Identificacion}, {item.Nombre} </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
