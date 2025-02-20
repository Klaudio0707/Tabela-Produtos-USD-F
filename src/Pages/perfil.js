import React, { useState, useEffect } from "react";

import axios from "axios";
import "../Styles/UserProfile.css"; // Crie e ajuste conforme seu estilo



const Perfil = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    permiss: "user",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_BACKEND; // Certifique-se de que está configurado
  const token = localStorage.getItem("authToken");

  // Busca os dados do perfil do usuário ao montar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Atualiza o estado com os dados do usuário retornados (senha não é retornada)
        setUser({ ...response.data, password: "" });
      } catch (error) {
        setMessage("Erro ao buscar dados do perfil");
        console.error(error);
      }
    };

    if (token) fetchUserData();
  }, [API_URL, token]);

  // Atualiza o estado conforme o usuário edita os campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Envia os dados atualizados para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.put(
        `${API_URL}/auth/users/me`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Perfil atualizado com sucesso!");
      // Atualiza o estado com os dados retornados (não inclui a senha, se não alterada)
      setUser({ ...response.data.user, password: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao atualizar o perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-container">
      <h1>Meu Perfil</h1>
      {message && <p className="message">{message}</p>}
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Nome de Usuário:
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            className="input-profile"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            className="input-profile"
          />
        </label>
        <label>
          Tipo de Usuário:
          <select
            name="permiss"
            value={user.permiss}
            onChange={handleChange}
            required
            className="input-profile-select"
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
            <option value="quest">Consultor</option>
          </select>
        </label>
        <label>
          Nova Senha:
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Deixe em branco para não alterar"
            className="input-profile"
          />
        </label>
        <button type="submit" disabled={loading} className="btn-profile">
          {loading ? "Atualizando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
};

export default Perfil;
