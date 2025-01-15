import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";

export default function Nav() {
  const { user } = useSelector((state) => state.auth);
  const logout = () => {
    localStorage.removeItem("user");
    document.location.href = "/";
  };
  return (
    <div className="">
      <nav className="nav">
        <div className="nav__general">
          <div className="">
            <Link to="/" className="nav__general__left">< img  src="/assets/web_icon.jpeg"/></Link>
          </div>
          <div className="nav__general__input">
            <input placeholder="aramak istediğiniz ürün" />
          </div>
          {user == "" ? (
            <div className="nav__general__right">
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </div>
          ) : (
            <div className="nav__general__right">
              <NavLink className="nav-link" to="/post-advert">İlan Ver</NavLink>
              <NavLink to="/profile">Profil</NavLink>
              <NavLink onClick={logout} className="nav-link" to="/">
                  Çıkış Yap
              </NavLink>
            </div>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
