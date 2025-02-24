import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { EyeOff, Eye } from "lucide-react";
import "../Styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BACKEND}/auth/login`,
        formData,
        { withCredentials: true } // Inclui cookies na requisição
      );
      console.log("Resposta do servidor:", response);
  
      const token = response.data.token;
  
      if (token) {
        // Salvando o token no cookie
        Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
        console.log("Token salvo no cookie:", token); // Verifique se o token está sendo salvo
  
        setMessage("Login realizado com sucesso!");
        setIsLoading(false);
        onLogin(token); // Passando o token para a função onLogin
        console.log("Redirecionando para /formularioProdutos...");
        navigate("/formularioProdutos");
      } else {
        setMessage("Erro ao realizar login. Verifique o backend.");
        setIsLoading(false);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao realizar login");
      setIsLoading(false);
      console.error("Erro no login:", error);
    }
  };
  
  
  return (
    <div className="container-login">
      <form className="form-login" onSubmit={handleSubmit}>
        <h3 className="title-login">Login</h3>
        <input
          type="text"
          name="username"
          placeholder="Usuário"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
          className="input-login-user"
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
          className="input-login-password"
        />
        <div
          className={`toggle-switch ${showPassword ? "on" : "off"}`}
          onClick={toggleShowPassword}
        >
          <div className="toggle-indicator">
            {showPassword ? <Eye className="icon" /> : <EyeOff className="icon" />}
          </div>
        </div>
        <button className="btn-submit" type="submit" disabled={isLoading}>
  {isLoading ? "Entrando..." : "Entrar"}
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