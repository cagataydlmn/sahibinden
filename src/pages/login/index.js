import { useState } from "react";
import { login as loginHandle } from "../../store/auth";
import { useDispatch } from "react-redux";
import {  Link, useNavigate } from "react-router-dom";
import { login } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
export default function Login(){
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await login(email, password);
        dispatch(loginHandle(user));
        navigate("/", { replace: true });
      };
    return(
        <div className="register">
            <form className="register__general" onSubmit={handleSubmit}>
              <div className="register__general__top">          <FontAwesomeIcon icon={faGoogle} />
          |
          <FontAwesomeIcon icon={faGoogle} /></div>
          <div className="register__general__genel">
          <div className="register__general__genel__mid">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="register__general__genel__mid" >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          </div>
  
          <div className="register__general__under">
          <button type="submit">Giriş Yap</button>
          <div className="register__general__under__text">
            Hesabın yoksa <Link to="/register">Kayıt ol!</Link>
          </div>
          </div>
          
            </form>
        </div>)
}