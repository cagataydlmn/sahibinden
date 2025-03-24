import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faMessage } from '@fortawesome/free-solid-svg-icons';

export default function MobileNav() {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="mobile__nav">
      <div className="fixed h-10 top-0 pl-[23px] left-0 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-xl py-1 flex justify-between items-center z-50">
        <div>
          {user ? (
            <NavLink
              className="flex flex-col items-center text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
              to="/post-advert"
            >
              <FontAwesomeIcon className="text-2xl" icon={faCamera} />
              {/*<span className="text-sm font-medium mt-1">Sat</span>*/}
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 text-sm font-medium"
            >
              Giriş Yap
            </NavLink>
          )}
        </div>
            <div>
            <Link to="/" className="text-xl font-semibold tracking-widest text-white ml-auto">
          Bazar
        </Link>
            </div>

<div>
<NavLink
          to="/messages"
          className="flex pr-[50px] flex-col items-center text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 mr-2"
        >
          <FontAwesomeIcon className="text-2xl" icon={faMessage} />
        </NavLink>
</div>

      </div>
    </nav>
  );
}
