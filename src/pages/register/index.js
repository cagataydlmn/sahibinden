import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../firebase.js";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(email, password, name, lastName);
      if (user) {
        navigate("/"); 
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };

  return (
    <div className="register">
      <form className="register__general" onSubmit={handleSubmit}>
        <div className="register__general__name">
          <label>İsim</label>
          <input
            type="text"
            placeholder="Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="register__general__name">
          <label>Soyisim</label>
          <input
            placeholder="soyisim"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
          />
        </div>
        <div className="register__general__name">
          <label>E-mail</label>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="e-mail"
          />
        </div>
        <div className="register__general__name">
          <label>Şifre</label>
          <input
            placeholder="şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <button>kayıt ol</button>
      </form>
    </div>
  );
}
