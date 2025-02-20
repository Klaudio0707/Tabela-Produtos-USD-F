import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import "../Styles/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [permiss, setPermiss] = useState("user"); // a permisão padrão é user
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validateCNPJ = async (cnpj) => {
    try {
      const response = await fetch(`https://open.cnpja.com/office/${cnpj}`);
      const data = await response.json();
      if (data.status === "ERROR") {
        throw new Error(data.message || "CNPJ inválido.");
      }
      return data;
    } catch (error) {
      throw new Error("Erro ao validar o CNPJ.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Validar CNPJ
      const cnpjData = await validateCNPJ(cnpj.replace(/[^\d]/g, "")); // Remove caracteres não numéricos
console.log(cnpjData);
      if (cnpjData.status.text !== "Ativa") {
        throw new Error("Empresa inativa.");
      }

      const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;
      if (!REACT_APP_API_BACKEND) {
        setErrorMessage("Configuração do backend está ausente.");
        return;
      }

      // Registro no backend
      const response = await fetch(`${REACT_APP_API_BACKEND}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password, 
          cnpj, 
          email, 
          permiss,
          nomeEmpresa: cnpjData.nome, 
          situacao: cnpjData.situacao 
        }),
      });

      if (response.ok) {
        alert("Usuário registrado com sucesso!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Erro ao registrar o usuário.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-Container">
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
          className="input-register-cnpj"
          placeholder="CNPJ"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
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
          required
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
          <option value="quest">Consultor</option>
        </select>
        <button className="btn-register" type="submit" disabled={loading}>
          {loading ? "Validando e Registrando..." : "Registrar"}
        </button>
        <p className="login-Link">
          Você já tem conta? <a href="/login">Faça login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;

