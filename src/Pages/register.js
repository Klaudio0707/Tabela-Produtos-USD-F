import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const passwordConfirmRef = useRef(null);
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [permiss, setPermiss] = useState("user"); // A permissão padrão é "user"
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const formatCNPJ = (value) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");
console.log(numericValue);
    // Aplica a máscara de CNPJ
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 5) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
    } else if (numericValue.length <= 8) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(
        2,
        5
      )}.${numericValue.slice(5)}`;
    } else if (numericValue.length <= 12) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(
        2,
        5
      )}.${numericValue.slice(5, 8)}/${numericValue.slice(8)}`;
    } else {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(
        2,
        5
      )}.${numericValue.slice(5, 8)}/${numericValue.slice(
        8,
        12
      )}-${numericValue.slice(12, 14)}`;
    }
  };
  const handleCNPJChange = (e) => {
    const rawValue = e.target.value; // Valor bruto digitado pelo usuário
    const formattedValue = formatCNPJ(rawValue); // Aplica a máscara
    setCnpj(formattedValue); // Atualiza o estado com o valor formatado
  };

  const validateCNPJ = async (cnpj) => {
    const numericCNPJ = cnpj.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    if (numericCNPJ.length !== 14) {
      throw new Error("CNPJ deve conter 14 dígitos.");
    }

    try {
      const response = await fetch(
        `https://open.cnpja.com/office/${numericCNPJ}`
      );
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
      const cnpjData = await validateCNPJ(cnpj);
console.log(cnpjData);
      if (cnpjData.status.text !== "Ativa") {
        throw new Error("A empresa associada ao CNPJ está inativa.");
      }
      if (password !== passwordConfirm) {
        setErrorMessage("As senhas não conferem.");
        passwordConfirmRef.current.focus(); // Foca no campo de confirmação de senha
        return;
      }

      const REACT_APP_API_BACKEND = process.env.REACT_APP_API_BACKEND;
      if (!REACT_APP_API_BACKEND) {
        setErrorMessage("Ocorreu um erro interno. Entre em contato com o suporte.");
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
          companyName: cnpjData.nome,
          isActive: cnpjData.status.text,
        }),
      });

      if (response.ok) {
        alert("Usuário registrado com sucesso!");
        setUsername("");
        setPassword("");
        setCnpj("");
        setEmail("");
        setPermiss("user");
        navigate("/login");
      } if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Erro ao registrar o usuário.");
        return;
      }
    } catch (error) {
      if (error.message.includes("Empresa inativa")) {
        setErrorMessage("A empresa associada ao CNPJ está inativa.");
      } else if (error.message.includes("CNPJ deve conter 14 dígitos")) {
        setErrorMessage("O CNPJ deve conter exatamente 14 dígitos.");
      } else if (error.message.includes("As senhas não conferem")) {
        setErrorMessage("As senhas digitadas não coincidem.");
      } else {
        setErrorMessage("Ocorreu um erro ao registrar o usuário. Tente novamente.");
      console.log(error)
      }
    
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
          aria-label="Nome de usuário"
        />

        <input
          className="input-register-password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          aria-label="Senha"
        />
            <input
          className="input-register-password"
          type="password"
          placeholder="Senha-Confirmação"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          minLength={8}
          required
          aria-label="Senha"
          ref={passwordConfirmRef}
        />
        <input
         className="input-register-cnpj"
          type="text"
          placeholder="CNPJ"
          value={cnpj}
          onChange={handleCNPJChange}
          maxLength={18} // Limite o comprimento máximo (incluindo pontos e traços)
          required
          aria-label="CNPJ"
        />

        <input
          type="email"
          className="input-register-email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
        />

        <select
          value={permiss}
          className="select-register-permiss"
          onChange={(e) => setPermiss(e.target.value)}
          required
          aria-label="Permissão"
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
          <option value="quest">Consultor</option>
        </select>

        <button className="btn-register" type="submit" disabled={loading}>
          {loading ? (
            <span>
              <i className="fa fa-spinner fa-spin"></i> Validando e
              Registrando...
            </span>
          ) : (
            "Registrar"
          )}
        </button>

        <p className="login-Link">
          Você já tem conta? <a href="/login">Faça login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
