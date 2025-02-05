import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© Todos os direitos reservados.</p>

      <a
        target="_blank"
        rel="noreferrer"
        href="https://www.linkedin.com/in/cl%C3%A1udio-roberto-filho/"
      >
        <FaLinkedin />
      </a>
      <a target="_blank" rel="noreferrer" href="https://github.com/Klaudio0707">
        <FaGithub />
      </a>
    </footer>
  );
};

export default Footer;
