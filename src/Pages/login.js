import React, { useState } from "react";
import axios from "axios";

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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>

                <input type="text" name="username" placeholder="Usuário"
                    value={formData.username} onChange={handleChange} required 
                />


                <input type="text" name="password" placeholder="Senha"
                    value={formData.password} onChange={handleChange} required 
                />
                <button type="submit"> Entrar</button>
                <button type="button" onClick={handleRegisterRedirect}>
                    Registre-se
                </button>
                <p>
        Não tem uma conta? <a href="/register">Cadastre-se</a>
      </p>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
