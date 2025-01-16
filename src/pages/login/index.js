import { useState } from "react";
import { login as loginHandle } from "../../store/auth";
import { useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { login } from "../../firebase";
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
        <div className="login">
            <form className="login__general" onSubmit={handleSubmit}>
            <div className="login__general__posta">
            <label>e-posta:</label>
            <input
              type="text"
              placeholder="e-posta adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login__general__password" >
            <label>Şifre:</label>
            <input
              type="password"
              placeholder="Şifren"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Giriş Yap</button>
          
            </form>
        </div>)
}