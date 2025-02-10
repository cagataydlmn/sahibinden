import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";
import webIcon from "../../assets/web_icon.jpeg";
import defaultProfile from "../../assets/default-profile.jpeg"; // Varsayılan profil fotoğrafını içe aktar
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import MobileNav from "../mobileNav";
import Search from "../../components/search";

export default function Nav() {
  const { user } = useSelector((state) => state.auth);
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Auth değişti, yeni photoURL:", user.photoURL);
        setProfilePhoto(user.photoURL);
      }
    });
  
    return () => unsubscribe(); // Cleanup
  }, []);

  // Eğer profil fotoğrafı "undefined" içeren URL ise varsayılanı kullan
  const isInvalidPhoto =
    profilePhoto &&
    profilePhoto.includes("undefined");

  return (
    <div>
      <MobileNav/>
      <nav className="nav">
        <div className="nav__general">
          <div>
            <Link to="/" className="nav__general__left">
              <img src={webIcon} alt="link" />
            </Link>
          </div>
         <Search/>
          {user ? (
            <div className="nav__general__right">
              <NavLink className="nav-link" to="/post-advert">
                İlan Ver
              </NavLink>
              <NavLink className="nav-link" to="/profile">
                <NavLink className="profile-info" to="/profile">
                  <img
                    src={isInvalidPhoto ? defaultProfile : profilePhoto}
                    alt="Profil"
                    className="profile-photo"
                  />
                </NavLink>
              </NavLink>
            </div>
          ) : (
            <div className="nav__general__right">
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </div>
          )}
        </div>
      </nav>
      <div className="nav__media">
        <NavLink to="/">Ana Sayfa</NavLink>
        {user ? (
          <>
           <NavLink>Kategoriler</NavLink>
            <NavLink to="/profile" className="">
                  <img
                    src={isInvalidPhoto ? defaultProfile : profilePhoto}
                    alt="Profil"
                    className="profile-photo"
                  />
                </NavLink>
          </>
        ) : (
          <div><NavLink>Kategoriler</NavLink>
          <NavLink className="nav-link" to="/login">
            Profil
          </NavLink></div>
        )}
      </div>
      <Outlet />
    </div>
  );
}
