import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/UserProfile.css"; // Crie e ajuste conforme seu estilo

const Perfil = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    permiss: "user",
    cnpj: "",
    companyName: "",
    isActive: false,
  });
  const [isEditing, setIsEditing] = useState(false); // Controla o modo de edição
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_BACKEND; // Certifique-se de que está configurado

  // Busca os dados do perfil do usuário ao montar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/users/me`, {
          withCredentials: true, // Inclui cookies na requisição
        });
        console.log(response.data);
        setUser(response.data); // Atualiza o estado com os dados retornados
      } catch (error) {
        setMessage("Erro ao buscar dados do perfil");
        console.error(error);
      }
    };

    fetchUserData();
  }, [API_URL]);

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
        { withCredentials: true } // Inclui cookies na requisição
      );
      setMessage("Perfil atualizado com sucesso!");
      setUser(response.data); // Atualiza o estado com os dados retornados
      setIsEditing(false); // Sai do modo de edição após salvar
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
      <div className="profile-info">
        {/* Exibição dos dados do usuário */}
        <div className="info-row">
          <span>Usuário:</span>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange} // Atualiza o estado ao editar
              required
              className="input-profile"
            />
          ) : (
            <span>{user.username}</span>
          )}
          {!isEditing && (
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          )}
        </div>

        <div className="info-row">
          <span>Email:</span>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange} // Atualiza o estado ao editar
              required
              className="input-profile"
            />
          ) : (
            <span>{user.email}</span>
          )}
          {!isEditing && (
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          )}
        </div>

        <div className="info-row">
          <span>Permissão:</span>
          {isEditing ? (
            <select
              name="permiss"
              value={user.permiss}
              onChange={handleChange} // Atualiza o estado ao editar
              required
              className="input-profile-select"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
              <option value="quest">Consultor</option>
            </select>
          ) : (
            <span>{user.permiss}</span>
          )}
          {!isEditing && (
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          )}
        </div>

        <div className="info-row">
          <span>CNPJ:</span>
          <span>{user.cnpj}</span>
        </div>

        <div className="info-row">
          <span>Nome da Empresa:</span>
          <span>{user.companyName}</span>
        </div>

        <div className="info-row">
          <span>Status da Empresa:</span>
          <span>{user.isActive ? "Ativa" : "Inativa"}</span>
        </div>
      </div>

      {/* Botão para salvar alterações ou cancelar edição */}
      {isEditing && (
        <form className="profile-form" onSubmit={handleSubmit}>
          <button type="submit" disabled={loading} className="btn-profile">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn-cancel"
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};

export default Perfil;