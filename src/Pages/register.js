import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [permiss, setPermiss] = useState("user"); // a permisão padrão é user
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();

    const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;

    if (!process.env.REACT_APP_API_BACKEND) {
      setErrorMessage("Configuração do backend está ausente.")
      return;
    }
try{
    const response = await fetch(`${REACT_APP_API_BACKEND}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, empresa, email, permiss }),
    });
    console.log(response);
    if (response.ok) {
      alert("Usuário registrado com sucesso!");
      navigate("/login");
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Erro ao registrar o usuário.");
    }
    } catch (error) {
setErrorMessage("Erro ao conectar com o servidor");
    } finally {
setLoading(false);

    }

  };
  return (
    <div className="register-Container">
      {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
      <form className="form-register" onSubmit={handleRegister}>
      <h2 className="container-title-register">Registro</h2>
        <input
          type="text"
          className="input-register-user"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
          required
        />
        <input
         className="input-register-password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <input
          type="text"
          className="input-register-empresa"
          placeholder="Empresa"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          required
        />
        <input
          type="email"
           className="input-register-email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          value={permiss}
          className="select-register-permiss"
          onChange={(e) => setPermiss(e.target.value)}
          required >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
          <option value="quest">Consultor</option>
        </select>
        <button className="btn-register" type="submit" disabled={loading}>{loading ? "Registrando...": "Registrar"}</button>
      </form>
      <p className="login-Link">
       Você já tem conta? <a href="/login">Faça login</a>
      </p>
    </div>
  );
};

export default Register;

