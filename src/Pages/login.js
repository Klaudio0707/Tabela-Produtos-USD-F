import React, { useState } from "react";
import axios from "axios";
import { EyeOff } from 'lucide-react';
import { Eye } from 'lucide-react';
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
    <div className="container-login">
      <h1 className="container-title">
        <span className="logi-title">Logi</span>
        <span className="box-title">Box</span>
      </h1>
      <form className="form-login" onSubmit={handleSubmit}>
      <h3 className="title-login">Login</h3>
        <input
          type="text"
          name="username"
          placeholder="Usuário"
          value={formData.username}
          onChange={handleChange}
          required
          className="input-login-user"
          />

        
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-login-password"
            />
          <div
            className={`toggle-switch ${showPassword ? "on" : "off"}`}
            onClick={toggleShowPassword}
            >
            <div className="toggle-indicator">{showPassword ? <Eye className="icon"/> : <EyeOff className="icon" />}</div>
          </div>
        

        <button className="btn-submit" type="submit">
          Entrar
        </button>
        <p className="text-lnfo-login">
          Não tem uma conta?{" "}
          <a className="a-register" href="/register">
            Cadastre-se
          </a>
        </p>
      </form>
      {message && <p className="error-login">{message}</p>}
    </div>
  );

};

export default Login;
