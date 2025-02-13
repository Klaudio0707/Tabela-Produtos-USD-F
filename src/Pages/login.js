import React, { useState } from "react";
import axios from "axios";
import "../Styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BACKEND}/auth/login`,
        formData
      );
      const { token } = response.data;

      if (token) {
        localStorage.setItem("authToken", token);
        setMessage("Login realizado com sucesso!");
        window.location.href = "/produtos";
      } else {
        setMessage("Token não recebido. Verifique o backend.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao realizar login");
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className="container-Login">
      <h1 className="title-Login">Login</h1>
      <form className="form-Login" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuário"
          value={formData.username}
          onChange={handleChange}
          required
          className="input-Login-User"
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-Login-Password"
          />
          <div
            className={`toggle-switch ${showPassword ? "on" : "off"}`}
            onClick={toggleShowPassword}
          >
            <div className="toggle-indicator">{showPassword ? "ON" : "OFF"}</div>
          </div>
        </div>

        <button className="btn-Submit" type="submit">
          Entrar
        </button>

        <p className="text-Info-Login">
          Não tem uma conta?{" "}
          <a className="btn-Register" href="/register">
            Cadastre-se
          </a>
        </p>
      </form>
      {message && <p className="error-Login">{message}</p>}
    </div>
  );
};

export default Login;
