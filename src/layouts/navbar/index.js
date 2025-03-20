import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";
import webIcon from "../../assets/web_icon.jpeg";
import defaultProfile from "../../assets/default-profile.jpeg";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import MobileNav from "../mobileNav";
import Search from "../../components/search";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faMessage ,faHeart} from '@fortawesome/free-solid-svg-icons';
import MobileNavBottom from "../mobileNavBottom";
export default function Nav() {
  const { user } = useSelector((state) => state.auth);
  const [profilePhoto, setProfilePhoto] = useState(defaultProfile);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfilePhoto(user.photoURL);
      }
    });

    return () => unsubscribe();
  }, []);

  const isInvalidPhoto = profilePhoto && profilePhoto.includes("undefined");

  return (
      <div className="relative min-h-screen flex flex-col">
        {/* Üst Navbar (Mobil) */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Ana Navbar (Sadece Masaüstü) */}
        <div className="hidden md:block sticky top-0 bg-white z-50 shadow-md">
          <nav className="nav bg-gradient-to-r from-indigo-600 to-blue-500">
            <div className="nav__general">
              <div>
                <Link to="/" className="nav__general__left">
                  <img src={webIcon} alt="link" />
                </Link>
              </div>
              <Search />
              {user ? (
                  <div className="nav__general__right">
                    <NavLink className="nav-link flex " to="/post-advert">
                      <FontAwesomeIcon className="size-[30px]" icon={faCamera} />
                    </NavLink>
                    <NavLink to="/messages">
                      <FontAwesomeIcon className="size-[30px] flex" icon={faMessage} />
                    </NavLink>
                      <NavLink to="/like">
                          <FontAwesomeIcon
                              icon={faHeart}
                              className="text-red-500  flex cursor-pointer size-[30px]"
                          />
                      </NavLink>
                    <NavLink className="nav-link" to="/profile">
                      <NavLink className="profile-info" to="/profile">
                        <img
                            src={isInvalidPhoto ? defaultProfile : defaultProfile}
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
        </div>

        {/* Sayfa İçeriği */}
        <div className="flex-grow">
          <Outlet />
        </div>

        {/* Alt Navbar (Mobil) */}
        <div className="md:hidden">
          <MobileNavBottom />
        </div>
      </div>
  );
}
