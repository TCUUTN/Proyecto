import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  return (
    <div>
      <h1>Contacto</h1>
      <p>Información de contacto aquí.</p>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Contact;
