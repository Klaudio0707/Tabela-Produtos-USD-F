import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleRegister = async (e) => {
      e.preventDefault();
  const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;
      const response = await fetch(`${REACT_APP_API_BACKEND}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        alert("Usuário registrado com sucesso!");
        navigate("/login");
      } else {
        alert("Erro ao registrar o usuário.");
      }
    };
    return (
<div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      <p>
        Já tem uma conta? <a href="/login">Faça login</a>
      </p>
    </div>
  );
};

export default Register;

