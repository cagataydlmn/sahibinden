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
                    <div className="nav__general__right flex justify-between items-center">
                        <NavLink className="nav-link flex justify-center items-center p-2" to="/post-advert">
                            <FontAwesomeIcon className="text-3xl text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110" icon={faCamera} />
                        </NavLink>

                        <NavLink className="nav-link flex justify-center items-center p-2" to="/messages">
                            <FontAwesomeIcon className="text-3xl text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110" icon={faMessage} />
                        </NavLink>

                        <NavLink className="nav-link flex justify-center items-center p-2" to="/like">
                            <FontAwesomeIcon className="text-3xl text-red-500 hover:text-red-400 transition-all duration-300 transform hover:scale-110" icon={faHeart} />
                        </NavLink>

                        <NavLink className="nav-link" to="/profile">
                            <div className="flex items-center justify-center">
                                <img
                                    src={isInvalidPhoto ? defaultProfile : defaultProfile}
                                    alt="Profil"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                />
                            </div>
                        </NavLink>
                    </div>
                ) : (
                    <div className="nav__general__right flex space-x-4">
                        <NavLink to="/login" className="nav-link text-white hover:text-gray-300 transition-all duration-300 transform hover:scale-110">
                            Login
                        </NavLink>
                        <NavLink to="/register" className="nav-link text-white hover:text-gray-300 transition-all duration-300 transform hover:scale-110">
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
