import React, { useState } from "react";
import axios from "axios";
import "../Styles/login.css";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BACKEND}/auth/login`, formData);
            const { token } = response.data;

            if (token) {
                // Salva o token no localStorage
                localStorage.setItem("authToken", token);
                setMessage("Login realizado com sucesso!");
                // Redirecionar para outra página protegida
                window.location.href = "/produtos";
            } else {
                setMessage("Token não recebido. Verifique o backend.");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Erro ao realizar login");
            console.error("Erro no login:", error);
        }
    };
        const handleRegisterRedirect = () => {
            window.location.href = "/register"; // Redireciona para a página de registro
    };
    return (
        <div className="container-Login">
            <h1 className="title-Login">Login</h1>
            <form  className="form-Login" onSubmit={handleSubmit}>

                <input type="text" name="username" placeholder="Usuário"
                    value={formData.username} onChange={handleChange} required 
                    className="input-Login-User"
                />


                <input type="text" name="password" placeholder="Senha"
                    value={formData.password} onChange={handleChange} required
                    className="input-Login-Password" 
                />
                <button className="btn-Submit" 
                type="submit">
                     Entrar</button>
                <button className="btn-Register" type="button" 
                onClick={handleRegisterRedirect}>
                    Registre-se</button>
                <p className="text-Info-Login">
        Não tem uma conta? <a href="/register">Cadastre-se</a>
      </p>
            </form>
            {message && <p className="error-Login">{message}</p>}
        </div>
    );
};

export default Login;
