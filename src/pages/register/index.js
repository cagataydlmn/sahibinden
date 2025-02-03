import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../firebase.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

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
        <div className="register__general__top">
          <FontAwesomeIcon icon={faGoogle} />
          |
          <FontAwesomeIcon icon={faGoogle} />
        </div>

        <div className="register__general__genel">
          <div className="register__general__genel__name">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
            />
          </div>

          <div className="register__general__genel__mid">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="e-mail"
            />
          </div>
          <div className="register__general__genel__mid">
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>
        </div>

        <div className="register__general__under">
          <button>Kayıt ol</button>
          <div className="register__general__under__text">
            Hesabın varsa <Link to="/login">Giriş Yap!</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
